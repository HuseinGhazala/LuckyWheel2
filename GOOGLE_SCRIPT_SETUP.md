# إعداد Google Apps Script للبيانات السحابية

## الخطوات المطلوبة:

### 1. إنشاء Google Sheet جديد
- افتح [Google Sheets](https://sheets.google.com)
- أنشئ ملف جديد باسم "LuckyWheelSettings"
- احفظه

### 2. إنشاء Google Apps Script
- من Google Sheet، اضغط على **Extensions** → **Apps Script**
- احذف الكود الموجود وألصق الكود التالي:

```javascript
// Google Apps Script للتحكم في بيانات عجلة الحظ
function doPost(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'saveSettings') {
      return saveSettings(e);
    } else {
      // حفظ بيانات المستخدم (الوظيفة الأصلية)
      return saveUserData(e);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getSettings') {
      return getSettings();
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// حفظ الإعدادات
function saveSettings(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let settingsSheet = ss.getSheetByName('Settings');
  
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet('Settings');
    settingsSheet.appendRow(['Key', 'Value']);
  }
  
  const settings = JSON.parse(e.parameter.settings);
  
  // حفظ كل إعداد في صف منفصل
  const data = [
    ['segments', JSON.stringify(settings.segments)],
    ['maxSpins', settings.maxSpins],
    ['logo', settings.logo || ''],
    ['socialLinks', JSON.stringify(settings.socialLinks)],
    ['backgroundSettings', JSON.stringify(settings.backgroundSettings)],
    ['winSound', settings.winSound],
    ['loseSound', settings.loseSound],
    ['googleScriptUrl', settings.googleScriptUrl || ''],
    ['lastUpdated', new Date().toISOString()]
  ];
  
  // مسح البيانات القديمة
  settingsSheet.clear();
  settingsSheet.appendRow(['Key', 'Value']);
  
  // إضافة البيانات الجديدة
  data.forEach(row => {
    settingsSheet.appendRow(row);
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Settings saved successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

// جلب الإعدادات
function getSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = ss.getSheetByName('Settings');
  
  if (!settingsSheet || settingsSheet.getLastRow() < 2) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'No settings found'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = settingsSheet.getDataRange().getValues();
  const settings = {};
  
  // تحويل البيانات إلى كائن
  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    let value = data[i][1];
    
    // تحويل القيم JSON إلى كائنات
    if (key === 'segments' || key === 'socialLinks' || key === 'backgroundSettings') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = null;
      }
    }
    
    // تحويل maxSpins إلى رقم
    if (key === 'maxSpins') {
      value = parseInt(value) || 1;
    }
    
    settings[key] = value;
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    settings: settings
  })).setMimeType(ContentService.MimeType.JSON);
}

// حفظ بيانات المستخدم (الوظيفة الأصلية)
function saveUserData(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let userDataSheet = ss.getSheetByName('UserData');
  
  if (!userDataSheet) {
    userDataSheet = ss.insertSheet('UserData');
    userDataSheet.appendRow(['Name', 'Email', 'Phone', 'Timestamp']);
  }
  
  const name = e.parameter.name || '';
  const email = e.parameter.email || '';
  const phone = e.parameter.phone || '';
  const timestamp = e.parameter.timestamp || new Date().toISOString();
  
  userDataSheet.appendRow([name, email, phone, timestamp]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'User data saved'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

### 3. نشر التطبيق
- اضغط على **Deploy** → **New deployment**
- اختر **Web app**
- **Execute as**: Me
- **Who has access**: Anyone
- اضغط **Deploy**
- انسخ رابط **Web app URL** (هذا هو الرابط الذي ستستخدمه في التطبيق)

### 4. تحديث الرابط في التطبيق
- افتح لوحة التحكم في التطبيق
- أدخل رابط Google Script في حقل "رابط نشر التطبيق"
- احفظ الإعدادات

## ملاحظات مهمة:
- تأكد من أن Google Sheet يحتوي على ورقتين: **Settings** و **UserData**
- البيانات المحفوظة ستكون مرئية لجميع المستخدمين
- عند تحديث الإعدادات من لوحة التحكم، سيتم تحديثها لجميع المستخدمين تلقائياً
