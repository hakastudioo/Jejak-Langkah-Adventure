
/**
 * JEJAK LANGKAH ADVENTURE - CLOUD SYNC ENGINE
 * Versi: 10.0 (Enhanced Drive Integration)
 */

function doGet(e) {
  return createResponse({ 
    status: 'success', 
    message: 'Jejak Langkah Admin Server is Online',
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

/**
 * Konversi Base64 ke File Google Drive
 * Mengembalikan URL file yang bisa diakses publik
 */
function saveBase64ToFile(identityData, fileName) {
  if (!identityData || identityData === "-" || identityData === "" || !identityData.toString().includes("base64,")) {
    return identityData || "-";
  }

  try {
    const folderName = "JEJAK_LANGKAH_DOKUMEN";
    let folder;
    const folders = DriveApp.getFoldersByName(folderName);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    // Ekstrak data base64
    const splitData = identityData.split("base64,");
    const contentType = splitData[0].split(":")[1].split(";")[0];
    const bytes = Utilities.base64Decode(splitData[1]);
    const blob = Utilities.newBlob(bytes, contentType, fileName);

    // Simpan ke Drive
    const file = folder.createFile(blob);
    
    // Set izin agar link bisa dibuka oleh siapa saja (Admin)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return file.getUrl();
  } catch (e) {
    console.error("Error saving to Drive: " + e.toString());
    return "Error Upload: " + e.toString();
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
        endDate: row[8],
        climberCode: row[9],
        identityImage: row[10],
        packageCategory: row[11],
        tripPackage: row[12],
        status: row[13] || "Menunggu Verifikasi"
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

    // PROSES UPLOAD KE DRIVE
    const fileName = "KTP_" + reg.fullName.replace(/\s+/g, '_') + "_" + reg.id;
    const driveUrl = saveBase64ToFile(reg.identityImage, fileName);

    const nextRow = sheet.getLastRow() + 1;
    
    // Header: ID, Waktu, Nama, Email, WA, Alamat, Gunung, Mulai, Selesai, Kode, Identitas, Layanan, Paket, Status, RefCode
    sheet.appendRow([
      reg.id,
      reg.timestamp,
      reg.fullName,
      reg.email,
      reg.whatsapp,
      reg.address,
      reg.mountain,
      reg.startDate,
      reg.endDate || "-",
      reg.climberCode || "-",
      "", // Kolom Identitas (K) akan diisi dengan formula di bawah
      reg.packageCategory,
      reg.tripPackage,
      reg.status || "Menunggu Verifikasi",
      reg.id.toString().slice(-6)
    ]);

    // Format Kolom K (Kolom ke-11) sebagai Hyperlink Drive
    const cell = sheet.getRange(nextRow, 11);
    if (driveUrl && driveUrl.startsWith('http')) {
      cell.setFormula('=HYPERLINK("' + driveUrl + '"; "BUKA DOKUMEN")');
      cell.setFontColor("#e11d48")
          .setFontWeight("bold")
          .setUnderline(true)
          .setHorizontalAlignment("center");
    } else {
      cell.setValue(driveUrl || "-");
    }

    return createResponse({ status: 'success', message: 'Registration Recorded to Drive and Sheet' });
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
        sheet.getRange(i + 1, 14).setValue(newStatus);
        return createResponse({ status: 'success', message: 'Status Updated' });
      }
    }
    return createResponse({ status: 'error', message: 'ID Not Found' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    const headers = ["ID", "Waktu Daftar", "Nama", "Email", "WhatsApp", "Alamat", "Gunung", "Mulai", "Selesai", "Kode Merbabu", "Identitas (Drive Link)", "Layanan", "Paket", "Status", "Ref Code"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e11d48").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(11, 150); // Lebarkan kolom link identitas
  }
  return sheet;
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
