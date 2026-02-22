# سكربت Google Apps Script للعجلة

## التثبيت
1. انسخ محتوى `Code.gs` إلى مشروع Google Apps Script (ملحق لـ Google Sheet).
2. شغّل الدالة `setupSheets()` مرة واحدة من المحرر (Run → setupSheets) لإنشاء الصفحات أو تحديث ترويسة **Wins**.

## صفحة Wins
العناوين بعد التحديث:
| Timestamp | Name | Email | Phone | Result | Prize | Coupon_Code |
|-----------|------|-------|-------|--------|-------|-------------|
- **Result:** `كسب` أو `خسر`
- **Prize:** نص الجائزة أو "حظ أوفر"
- **Coupon_Code:** يُملأ فقط عند الفوز (كسب)

إذا كانت لديك بالفعل صفحة Wins بعناوين قديمة (بدون Result)، أضف عموداً يدوياً باسم **Result** بعد **Phone**، أو احذف الصفحة وشغّل `setupSheets()` من جديد.
