# اختبار التحميل - عجلة الحظ
## Load Testing - Lucky Wheel

### اختبار الموقع المنشور
**الموقع:** https://lightslategrey-hawk-924323.hostingersite.com/

```bash
npm run load-test
```
يختبر: Hostinger (الصفحة) + Supabase (API)

### اختبار Supabase فقط
```bash
npm run load-test:api
```

---

اختبار قدرة Supabase على استقبال الطلبات عند عدد كبير من العملاء.

---

## التثبيت

### 1. تثبيت k6

**Windows (PowerShell كمسؤول):**
```powershell
choco install k6
```

**أو حمّل من:** [k6.io/docs/getting-started/installation](https://k6.io/docs/getting-started/installation)

**التحقق:**
```bash
k6 version
```

---

## التشغيل

### الطريقة الأولى (موصى بها)

يقرأ تلقائياً من ملف `.env`:

```bash
npm run load-test
```

### الطريقة الثانية (يدوياً)

```bash
k6 run load-test/k6-load-test.js -e SUPABASE_URL=https://xxx.supabase.co -e SUPABASE_ANON_KEY=your-key
```

---

## مراحل الاختبار الحالية

| السيناريو      | الوصف              | الحمل       |
|----------------|--------------------|-------------|
| read_settings  | قراءة الإعدادات    | حتى 2000 مستخدم |
| save_user_data | تسجيل بيانات       | 50 مستخدم ثابت |
| save_win_data  | حفظ الجوائز       | 20 مستخدم ثابت |

**المدة الإجمالية:** ~5 دقائق

---

## الوصول إلى 200 ألف عميل

⚠️ **تحذير:** 200 ألف عميل متزامن حمل ثقيل جداً. ابدأ صغيراً وراقب Supabase Dashboard.

### تعديل الحمل في `k6-load-test.js`

عدّل قسم `options`:

```javascript
export const options = {
  scenarios: {
    read_settings: {
      executor: 'ramping-vus',
      stages: [
        { duration: '5m', target: 10000 },   // 10k
        { duration: '10m', target: 50000 },  // 50k
        { duration: '15m', target: 100000 }, // 100k
        { duration: '20m', target: 200000 }, // 200k
        { duration: '5m', target: 0 },
      ],
      // ...
    },
  },
};
```

### نصائح لـ 200k

1. **خطة Supabase:** قد تحتاج Pro أو Enterprise
2. **Connection pooling:** فعّل PgBouncer في Supabase
3. **Rate limits:** Supabase يطبّق حدود على الطلبات
4. **شغّل تدريجياً** ولا تقفز مباشرة لـ 200k

---

## قراءة النتائج

بعد انتهاء الاختبار ستظهر:

- `http_reqs` - إجمالي الطلبات
- `http_req_duration` - وقت الاستجابة (avg, p95, p99)
- `http_req_failed` - نسبة الفشل
- `vus` - عدد المستخدمين الافتراضيين

**معايير النجاح الحالية:**
- 95% من الطلبات أسرع من 5 ثوانٍ
- أقل من 10% أخطاء
