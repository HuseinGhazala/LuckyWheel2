/**
 * اختبار تحميل الموقع المنشور - عجلة الحظ
 * Load Test for Deployed Lucky Wheel Website
 *
 * الموقع: https://lightslategrey-hawk-924323.hostingersite.com/
 *
 * التشغيل: k6 run load-test/k6-load-test-website.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const SITE_URL = __ENV.SITE_URL || 'https://lightslategrey-hawk-924323.hostingersite.com';
const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://lzkyhwlbgznivpuftvbc.supabase.co';
const SUPABASE_KEY = __ENV.SUPABASE_ANON_KEY || '';

export const options = {
  scenarios: {
    // سيناريو 1: زيارة الصفحة الرئيسية (Hostinger)
    visit_homepage: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 100 },
        { duration: '1m', target: 500 },
        { duration: '1m', target: 1000 },
        { duration: '2m', target: 2000 },
        { duration: '1m', target: 0 },
      ],
      startTime: '0s',
      exec: 'visitHomepage',
    },
    // سيناريو 2: قراءة Supabase (مثل ما يحدث عند فتح الموقع)
    api_calls: {
      executor: 'constant-vus',
      vus: 200,
      duration: '4m',
      startTime: '20s',
      exec: 'apiCalls',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<8000'],
    http_req_failed: ['rate<0.15'],
  },
};

const apiHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

export function setup() {
  return {
    siteUrl: SITE_URL,
    apiUrl: SUPABASE_KEY ? `${SUPABASE_URL}/rest/v1` : null,
  };
}

// زيارة الصفحة الرئيسية
export function visitHomepage(data) {
  const res = http.get(data.siteUrl + '/', {
    headers: { 'User-Agent': 'k6-load-test' },
    tags: { name: 'homepage' },
  });
  check(res, { 'الصفحة - 200': (r) => r.status === 200 }) ||
    console.warn(`الصفحة failed: ${res.status}`);
  sleep(1);
}

// محاكاة طلبات API (الإعدادات + تسجيل)
export function apiCalls(data) {
  if (!data.apiUrl) return;

  // قراءة الإعدادات
  const settingsRes = http.get(
    `${data.apiUrl}/settings?select=*&id=eq.1`,
    { headers: apiHeaders }
  );
  check(settingsRes, { 'API إعدادات - 200': (r) => r.status === 200 });

  sleep(0.5);

  // تسجيل بيانات (اختياري - كل 5 مستخدمين)
  if (__VU % 5 === 0) {
    const payload = JSON.stringify({
      name: `test_${__VU}_${Date.now()}`,
      email: `test_${__VU}_${Date.now()}@loadtest.com`,
      phone: `05${String(__VU).padStart(8, '0')}`,
      timestamp: new Date().toISOString(),
    });
    http.post(`${data.apiUrl}/user_data`, payload, {
      headers: { ...apiHeaders, 'Prefer': 'return=minimal' },
    });
  }

  sleep(2);
}
