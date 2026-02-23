// إعدادات الصفحات
const SHEET_SETTINGS = "Settings";
const SHEET_USER_DATA = "UserData";
const SHEET_WINS = "Wins";

/**
 * دالة الإعداد الأولي
 * قم بتشغيلها مرة واحدة لإنشاء الصفحات
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEET_SETTINGS);
    settingsSheet.appendRow(["Settings_JSON", "Last_Updated"]);
  }

  let userSheet = ss.getSheetByName(SHEET_USER_DATA);
  if (!userSheet) {
    userSheet = ss.insertSheet(SHEET_USER_DATA);
    userSheet.appendRow(["Timestamp", "Name", "Email", "Phone"]);
  }

  let winsSheet = ss.getSheetByName(SHEET_WINS);
  if (!winsSheet) {
    winsSheet = ss.insertSheet(SHEET_WINS);
    winsSheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Prize", "Coupon_Code"]);
  } else {
    const lastRow = winsSheet.getLastRow();
    if (lastRow === 0) {
      winsSheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Prize", "Coupon_Code"]);
    }
  }
  
  Logger.log("✅ تم إنشاء جميع الصفحات بنجاح!");
}

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log("📥 Request received");
    
    let params = e.parameter || {};
    
    if ((!params || Object.keys(params).length === 0) && e.postData && e.postData.contents) {
      try {
        const content = e.postData.contents;
        if (content.startsWith('{')) {
           const jsonParams = JSON.parse(content);
           params = { ...params, ...jsonParams };
        } else {
           const parts = content.split('&');
           parts.forEach(part => {
             const idx = part.indexOf('=');
             if (idx > 0) {
               const key = decodeURIComponent(part.substring(0, idx).trim());
               const value = decodeURIComponent(part.substring(idx + 1).replace(/\+/g, ' '));
               if (key) params[key] = value;
             }
           });
        }
      } catch (err) {
        Logger.log("⚠️ Error parsing postData: " + err.toString());
      }
    }

    Logger.log("📋 Params: " + JSON.stringify(params));

    const action = params.action;
    let result = { success: false, message: "No action specified" };

    if (action === "getSettings") {
      result = getSettings(ss);
    } 
    else if (action === "saveSettings") {
      Logger.log("⚙️ Saving settings...");
      result = saveSettings(ss, params.settings);
    } 
    else if (action === "saveWin") { 
      Logger.log("🏆 Saving spin result: " + (params.result || "كسب") + " - " + params.prize);
      result = saveWinData(ss, params);
    } 
    else if (action === "saveUserData" || (params.name && params.phone)) { 
      Logger.log("👤 Saving user data: " + params.name);
      result = saveUserData(ss, params);
    } else {
      Logger.log("❓ Unknown action or empty data: " + action);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("❌ FATAL ERROR: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getSettings(ss) {
  let sheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!sheet) return { success: false, message: "No settings sheet" };
  const data = sheet.getRange("A2").getValue();
  if (data && data !== "") return { success: true, settings: JSON.parse(data) };
  return { success: false, message: "No settings found" };
}

function saveSettings(ss, settingsJson) {
  let sheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!sheet) sheet = ss.insertSheet(SHEET_SETTINGS);
  sheet.getRange("A2").setValue(settingsJson);
  sheet.getRange("B2").setValue(new Date()); 
  return { success: true };
}

function saveUserData(ss, params) {
  let sheet = ss.getSheetByName(SHEET_USER_DATA);
  if (!sheet) sheet = ss.insertSheet(SHEET_USER_DATA);
  
  const timestamp = params.timestamp ? new Date(params.timestamp) : new Date();
  
  sheet.appendRow([
    timestamp,
    params.name || "",
    params.email || "",
    params.phone || ""
  ]);
  return { success: true };
}

/**
 * حفظ الفائزين فقط في صفحة Wins: الاسم، الجائزة، الكوبون.
 * لا يُسجّل الخاسرون (خسر) — الصفحة للفائزين فقط.
 */
function saveWinData(ss, params) {
  const result = (params.result === "خسر" || params.result === "lost") ? "خسر" : "كسب";
  if (result === "خسر") {
    return { success: true };
  }

  let sheet = ss.getSheetByName(SHEET_WINS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_WINS);
    sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Prize", "Coupon_Code"]);
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Prize", "Coupon_Code"]);
  }
  
  const timestamp = params.timestamp ? new Date(params.timestamp) : new Date();
  const couponCode = params.couponCode || params.coupon_code || "";
  
  sheet.appendRow([
    timestamp,
    params.name || "",
    params.email || "",
    params.phone || "",
    params.prize || "",
    couponCode
  ]);
  return { success: true };
}
