
/**
 * JEJAK LANGKAH ADVENTURE - CLOUD SYNC ENGINE
 * Versi: 5.0 (Admin Server Ready)
 */

function doGet(e) {
  return createResponse({ 
    status: 'success', 
    message: 'Admin Server Node is Online',
    timestamp: new Date().toISOString()
  });
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return createResponse({ status: 'error', message: 'No payload provided' });
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch(action) {
      case 'NEW_REGISTRATION':
        return handleNewRegistration(data);
      case 'UPDATE_STATUS':
        return handleUpdateStatus(data);
      case 'FETCH_ALL':
        return handleFetchAll(data);
      default:
        return createResponse({ status: 'error', message: 'Action unknown: ' + action });
    }
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function handleFetchAll(payload) {
  const ssId = payload.spreadsheetId;
  if (!ssId) return createResponse({ status: 'error', message: 'Spreadsheet ID Kosong' });

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = getOrCreateSheet(ss, "Pendaftaran");
    const values = sheet.getDataRange().getValues();
    const results = [];

    for (let i = 1; i < values.length; i++) {
      let row = values[i];
      results.push({
        id: row[0],
        timestamp: row[1],
        fullName: row[2],
        email: row[3],
        whatsapp: row[4],
        address: row[5],
        mountain: row[6],
        startDate: row[7],
        climberCode: row[8],
        identityImage: row[9],
        packageCategory: row[10],
        tripPackage: row[11],
        status: row[12] || "Menunggu Verifikasi"
      });
    }

    return createResponse({ status: 'success', data: results });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function handleNewRegistration(payload) {
  const reg = payload.registration;
  const ssId = payload.spreadsheetId;

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = getOrCreateSheet(ss, "Pendaftaran");

    sheet.appendRow([
      reg.id,
      reg.timestamp,
      reg.fullName,
      reg.email,
      reg.whatsapp,
      reg.address,
      reg.mountain,
      reg.startDate,
      reg.climberCode || "-",
      reg.identityImage || "-", 
      reg.packageCategory,
      reg.tripPackage,
      reg.status || "Menunggu Verifikasi",
      reg.id.toString().slice(-6)
    ]);

    return createResponse({ status: 'success', message: 'Inbound Data Success' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function handleUpdateStatus(payload) {
  const ssId = payload.spreadsheetId;
  const regId = payload.id;
  const newStatus = payload.status;

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName("Pendaftaran");
    const dataRows = sheet.getDataRange().getValues();
    
    for (let i = 1; i < dataRows.length; i++) {
      if (dataRows[i][0].toString() === regId.toString()) {
        sheet.getRange(i + 1, 13).setValue(newStatus);
        // Log Aktivitas di Sheet lain (Opsional)
        return createResponse({ status: 'success', message: 'Server Mutation Complete' });
      }
    }
    return createResponse({ status: 'error', message: 'ID Not Found in Node' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    const headers = ["ID", "Waktu Daftar", "Nama", "Email", "WhatsApp", "Alamat", "Gunung", "Mulai", "Kode Merbabu", "Identitas", "Tipe", "Paket", "Status", "Kode Tiket"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e11d48").setFontColor("#ffffff");
  }
  return sheet;
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
