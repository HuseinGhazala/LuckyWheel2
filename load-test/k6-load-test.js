/**
 * اختبار تحميل Supabase - عجلة الحظ
 * Load Test for Lucky Wheel Supabase API
 *
 * التشغيل: k6 run load-test/k6-load-test.js
 * مع .env: npm run load-test
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// ============ الإعدادات - عدّل حسب الحاجة ============
const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://lzkyhwlbgznivpuftvbc.supabase.co';
const SUPABASE_KEY = __ENV.SUPABASE_ANON_KEY || '';

// مراحل الاختبار (ابدأ صغير ثم زد تدريجياً)
// للحصول على 200k: استخدم vus: 200000 لكن قد يستغرق وقتاً وتحقق من حدود Supabase
export const options = {
  scenarios: {
    // سيناريو 1: قراءة الإعدادات (الأكثر شيوعاً)
    read_settings: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 100 },   // 100 مستخدم خلال 30 ثانية
        { duration: '1m', target: 500 },    // 500 مستخدم
        { duration: '1m', target: 1000 },   // 1000 مستخدم
        { duration: '2m', target: 2000 },   // 2000 مستخدم (ضغط متوسط)
        { duration: '1m', target: 0 },      // إيقاف تدريجي
      ],
      startTime: '0s',
      exec: 'readSettings',
    },
    // سيناريو 2: تسجيل بيانات المستخدمين
    save_user_data: {
      executor: 'constant-vus',
      vus: 50,
      duration: '3m',
      startTime: '30s',
      exec: 'saveUserData',
    },
    // سيناريو 3: حفظ الجوائز الفائزة
    save_win_data: {
      executor: 'constant-vus',
      vus: 20,
      duration: '3m',
      startTime: '1m',
      exec: 'saveWinData',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<5000'],  // 95% من الطلبات أسرع من 5 ثوانٍ
    http_req_failed: ['rate<0.1'],      // أقل من 10% أخطاء
  },
};

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

export function setup() {
  if (!SUPABASE_KEY) {
    console.error('⚠️  SUPABASE_ANON_KEY مطلوب! شغّل: npm run load-test');
    return { skip: true };
  }
  return { baseUrl: `${SUPABASE_URL}/rest/v1` };
}

// جلب الإعدادات (GET)
export function readSettings(data) {
  if (data?.skip) return;
  const res = http.get(
    `${data.baseUrl}/settings?select=*&id=eq.1`,
    { headers }
  );
  check(res, { 'إعدادات - حالة 200': (r) => r.status === 200 }) ||
    console.warn(`إعدادات failed: ${res.status}`);
  sleep(0.5);
}

// حفظ بيانات مستخدم (POST)
export function saveUserData(data) {
  if (data?.skip) return;
  const payload = JSON.stringify({
    name: `مستخدم_${__VU}_${Date.now()}`,
    email: `user_${__VU}_${Date.now()}@test.com`,
    phone: `05${String(__VU).padStart(8, '0')}`,
    timestamp: new Date().toISOString(),
  });
  const res = http.post(`${data.baseUrl}/user_data`, payload, { headers });
  check(res, { 'بيانات مستخدم - حالة 2xx': (r) => r.status >= 200 && r.status < 300 }) ||
    console.warn(`user_data failed: ${res.status} - ${res.body}`);
  sleep(1);
}

// حفظ جائزة فائزة (POST)
export function saveWinData(data) {
  if (data?.skip) return;
  const payload = JSON.stringify({
    name: `فائز_${__VU}_${Date.now()}`,
    email: `winner_${__VU}_${Date.now()}@test.com`,
    phone: `05${String(__VU + 1000).padStart(8, '0')}`,
    prize: 'كوبون خصم 10%',
    coupon_code: `WIN-${Date.now()}`,
    timestamp: new Date().toISOString(),
  });
  const res = http.post(`${data.baseUrl}/wins`, payload, { headers });
  check(res, { 'جائزة - حالة 2xx': (r) => r.status >= 200 && r.status < 300 }) ||
    console.warn(`wins failed: ${res.status} - ${res.body}`);
  sleep(2);
}

export function teardown(data) {
  if (data?.skip) return;
  console.log('✅ انتهى الاختبار');
}
