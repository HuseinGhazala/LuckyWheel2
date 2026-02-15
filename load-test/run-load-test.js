/**
 * تشغيل اختبار التحميل مع قراءة .env تلقائياً
 * Run load test with automatic .env loading
 */

import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const envPath = resolve(rootDir, '.env');

function loadEnv() {
  const env = {};
  if (!existsSync(envPath)) {
    console.warn('⚠️  ملف .env غير موجود. استخدم المتغيرات يدوياً أو أنشئ .env');
    return env;
  }
  const content = readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const eq = line.indexOf('=');
      if (eq > 0) {
        const key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[key] = val;
      }
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY مطلوبان في .env');
  process.exit(1);
}

console.log('🚀 تشغيل اختبار التحميل...');
console.log('   URL:', supabaseUrl);
console.log('   اضغط Ctrl+C للإيقاف\n');

const k6 = spawn('k6', [
  'run',
  resolve(__dirname, 'k6-load-test.js'),
  '-e', `SUPABASE_URL=${supabaseUrl}`,
  '-e', `SUPABASE_ANON_KEY=${supabaseKey}`,
], {
  stdio: 'inherit',
  cwd: rootDir,
});

k6.on('error', (err) => {
  console.error('\n❌ k6 غير مثبت. ثبّته أولاً:');
  console.error('   Windows: choco install k6');
  console.error('   أو حمّل من: https://k6.io/docs/getting-started/installation/');
  process.exit(1);
});

k6.on('close', (code) => {
  process.exit(code || 0);
});
