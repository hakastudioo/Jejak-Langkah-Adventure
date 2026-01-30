
# 📘 Panduan Lengkap Integrasi Cloud Jejak Langkah

Ikuti langkah-langkah ini secara perlahan untuk menghubungkan aplikasi Anda ke database Google Sheets.

## TAHAP 1: Menyiapkan Google Sheet (Database)
1. Buka [Google Sheets](https://sheets.new).
2. Cari **ID Spreadsheet** Anda di URL (antara `/d/` dan `/edit`).

## TAHAP 2: Menyiapkan Google Apps Script
1. Di Google Sheet: **Extensions** > **Apps Script**.
2. Tempel kode dari `google-apps-script.gs`.
3. Klik ikon 💾 (Save).

## TAHAP 3: PENTING - Solusi Error "Izin DriveApp"
Jika Anda mendapatkan error saat upload KTP, Anda harus memberikan izin secara manual:
1. Di Editor Apps Script, cari menu drop-down di sebelah tombol **Run**.
2. Pilih fungsi `triggerAuth`.
3. Klik **Run**.
4. Akan muncul jendela "Authorization Required". Klik **Review Permissions**.
5. Pilih akun Google Anda.
6. Jika muncul "Google hasn't verified this app", klik **Advanced** > **Go to Engine Jejak Langkah (unsafe)**.
7. Klik **Allow**.
8. Sekarang sistem sudah memiliki izin akses Drive.

## TAHAP 4: Deploy (Menerbitkan Akses)
1. Klik **Deploy** > **New Deployment**.
2. Pilih **Web App**.
3. **Execute as:** `Me` (Saya).
4. **Who has access:** `Anyone` (Siapa saja).
5. Klik **Deploy**.
6. Salin **Web App URL**.

## TAHAP 5: Menghubungkan ke Aplikasi
1. Buka aplikasi, masuk ke **Admin Panel**.
2. Masukkan Spreadsheet ID dan Web App URL.
3. Klik **SAVE & SYNC NOW**.
