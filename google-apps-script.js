// Google Apps Script للتحكم في بيانات عجلة الحظ
// انسخ هذا الكود إلى Google Apps Script

function doPost(e) {
  try {
    Logger.log('=== doPost called ===');
    Logger.log('Full event: ' + JSON.stringify(e));
    
    // محاولة قراءة البيانات من parameter أو postData
    let action = '';
    let parameters = {};
    
    // قراءة من parameter (URL parameters)
    if (e.parameter) {
      action = e.parameter.action || '';
      parameters = e.parameter;
      Logger.log('From parameter - Action: ' + action);
      Logger.log('From parameter - Parameters: ' + JSON.stringify(e.parameter));
    }
    
    // قراءة من postData (POST body)
    if (e.postData && e.postData.contents) {
      try {
        const postData = e.postData.contents;
        Logger.log('PostData contents: ' + postData);
        
        // محاولة parse كـ URL-encoded
        const urlParams = new URLSearchParams(postData);
        for (const [key, value] of urlParams.entries()) {
          parameters[key] = value;
          if (key === 'action') {
            action = value;
          }
        }
        Logger.log('Parsed from postData - Action: ' + action);
        Logger.log('Parsed from postData - Parameters: ' + JSON.stringify(parameters));
      } catch (parseError) {
        Logger.log('Error parsing postData: ' + parseError.toString());
      }
    }
    
    // إنشاء event object جديد مع البيانات المدمجة
    const mergedEvent = {
      parameter: parameters,
      postData: e.postData
    };
    
    if (action === 'saveSettings') {
      return saveSettings(mergedEvent);
    } else if (action === 'saveWin') {
      return saveWinData(mergedEvent);
    } else {
      // حفظ بيانات المستخدم (الوظيفة الأصلية - بدون action parameter)
      Logger.log('Saving user data (no action specified)');
      return saveUserData(mergedEvent);
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
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
  try {
    Logger.log('=== saveUserData called ===');
    Logger.log('Full request: ' + JSON.stringify(e));
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    Logger.log('PostData: ' + (e.postData ? e.postData.contents : 'No postData'));
    
    const ss = initializeSheets();
    let userDataSheet = ss.getSheetByName('UserData');
    
    // محاولة قراءة البيانات من parameter أو postData
    let name = '';
    let email = '';
    let phone = '';
    let timestamp = new Date().toISOString();
    
    if (e.parameter) {
      name = e.parameter.name || '';
      email = e.parameter.email || '';
      phone = e.parameter.phone || '';
      timestamp = e.parameter.timestamp || new Date().toISOString();
    }
    
    // إذا لم تكن البيانات في parameter، جرب قراءة من postData
    if (!name && e.postData && e.postData.contents) {
      try {
        const postData = e.postData.contents;
        Logger.log('Trying to parse postData: ' + postData);
        const params = new URL(postData).searchParams || {};
        name = params.get('name') || '';
        email = params.get('email') || '';
        phone = params.get('phone') || '';
        timestamp = params.get('timestamp') || new Date().toISOString();
      } catch (parseError) {
        Logger.log('Error parsing postData: ' + parseError.toString());
      }
    }
    
    Logger.log('Final data to save - Name: ' + name + ', Email: ' + email + ', Phone: ' + phone);
    
    // التأكد من وجود الأعمدة
    if (userDataSheet.getLastRow() === 0) {
      userDataSheet.appendRow(['Name', 'Email', 'Phone', 'Timestamp']);
    }
    
    // حفظ البيانات
    userDataSheet.appendRow([name, email, phone, timestamp]);
    
    Logger.log('✅ User data saved successfully to row: ' + userDataSheet.getLastRow());
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'User data saved',
      row: userDataSheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('❌ Error in saveUserData: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// حفظ بيانات الجائزة الفائزة
function saveWinData(e) {
  try {
    Logger.log('=== saveWinData called ===');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    
    const ss = initializeSheets();
    let winsSheet = ss.getSheetByName('Wins');
    
    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const phone = e.parameter.phone || '';
    const prize = e.parameter.prize || '';
    const couponCode = e.parameter.couponCode || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    
    Logger.log('Win data to save - Name: ' + name + ', Prize: ' + prize + ', Code: ' + couponCode);
    
    // التأكد من وجود الأعمدة
    if (winsSheet.getLastRow() === 0) {
      winsSheet.appendRow(['Name', 'Email', 'Phone', 'Prize', 'Coupon Code', 'Timestamp']);
    }
    
    winsSheet.appendRow([name, email, phone, prize, couponCode, timestamp]);
    
    Logger.log('✅ Win data saved successfully to row: ' + winsSheet.getLastRow());
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Win data saved',
      row: winsSheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('❌ Error in saveWinData: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
