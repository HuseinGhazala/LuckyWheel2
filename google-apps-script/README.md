# سكربت Google Apps Script للعجلة

## التثبيت
1. انسخ محتوى `Code.gs` إلى مشروع Google Apps Script (ملحق لـ Google Sheet).
2. شغّل الدالة `setupSheets()` مرة واحدة من المحرر (Run → setupSheets) لإنشاء الصفحات أو تحديث ترويسة **Wins**.
3. **نشر التطبيق كـ Web App (ضروري لاستقبال البيانات من الموقع):**
   - من المحرر: **Deploy** → **New deployment** → نوع **Web app**.
   - **Execute as:** Me.
   - **Who has access:** Anyone (أو Anyone with Google account).
   - انسخ رابط **Web app URL** (يبدأ بـ `https://script.google.com/macros/s/.../exec`) والصقه في لوحة التحكم في حقل رابط Google Script.

## صفحة Wins (الفائزون فقط)
تُسجَّل فيها **الفائزون فقط** مع الجائزة والكوبون. الخاسرون لا يُحفظون.

العناوين:
| Timestamp | Name | Email | Phone | Prize | Coupon_Code |
|-----------|------|-------|-------|-------|-------------|
- **Prize:** نص الجائزة (مثل خصم 10%)
- **Coupon_Code:** الكوبون الذي فاز به العميل
