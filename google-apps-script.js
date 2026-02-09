// Google Apps Script للتحكم في بيانات عجلة الحظ
// انسخ هذا الكود إلى Google Apps Script

function doPost(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'saveSettings') {
      return saveSettings(e);
    } else if (action === 'saveWin') {
      return saveWinData(e);
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

// إنشاء جميع الأوراق المطلوبة عند البداية
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // إنشاء ورقة Settings
  let settingsSheet = ss.getSheetByName('Settings');
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet('Settings');
    settingsSheet.appendRow(['Key', 'Value']);
  }
  
  // إنشاء ورقة UserData
  let userDataSheet = ss.getSheetByName('UserData');
  if (!userDataSheet) {
    userDataSheet = ss.insertSheet('UserData');
    userDataSheet.appendRow(['Name', 'Email', 'Phone', 'Timestamp']);
  }
  
  // إنشاء ورقة Wins
  let winsSheet = ss.getSheetByName('Wins');
  if (!winsSheet) {
    winsSheet = ss.insertSheet('Wins');
    winsSheet.appendRow(['Name', 'Email', 'Phone', 'Prize', 'Coupon Code', 'Timestamp']);
  }
  
  return ss;
}

// دالة يمكن تشغيلها يدوياً لإنشاء جميع الأوراق فوراً
function createAllSheets() {
  try {
    const ss = initializeSheets();
    Logger.log('تم إنشاء جميع الأوراق بنجاح!');
    return 'تم إنشاء جميع الأوراق بنجاح!';
  } catch (error) {
    Logger.log('خطأ في إنشاء الأوراق: ' + error.toString());
    return 'خطأ: ' + error.toString();
  }
}

// حفظ الإعدادات
function saveSettings(e) {
  const ss = initializeSheets();
  let settingsSheet = ss.getSheetByName('Settings');
  
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
  const ss = initializeSheets();
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
  const ss = initializeSheets();
  let userDataSheet = ss.getSheetByName('UserData');
  
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

// حفظ بيانات الجائزة الفائزة
function saveWinData(e) {
  const ss = initializeSheets();
  let winsSheet = ss.getSheetByName('Wins');
  
  const name = e.parameter.name || '';
  const email = e.parameter.email || '';
  const phone = e.parameter.phone || '';
  const prize = e.parameter.prize || '';
  const couponCode = e.parameter.couponCode || '';
  const timestamp = e.parameter.timestamp || new Date().toISOString();
  
  winsSheet.appendRow([name, email, phone, prize, couponCode, timestamp]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Win data saved'
  })).setMimeType(ContentService.MimeType.JSON);
}
