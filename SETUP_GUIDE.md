
# 📘 Panduan Lengkap Integrasi Cloud Jejak Langkah

Ikuti langkah-langkah ini secara perlahan untuk menghubungkan aplikasi Anda ke database Google Sheets dan memastikan fitur Unggah KTP aktif.

## TAHAP 1: Menyiapkan Google Sheet (Database)
1. Buka [Google Sheets](https://sheets.new).
2. Cari **ID Spreadsheet** Anda di URL (teks panjang antara `/d/` dan `/edit`).

## TAHAP 2: Menyiapkan Google Apps Script
1. Di Google Sheet Anda: Pilih menu **Extensions** > **Apps Script**.
2. Hapus semua kode yang ada, lalu tempel kode dari file `google-apps-script.gs`.
3. Klik ikon 💾 (Save) dan beri nama proyek "Sistem Jejak Langkah".

## TAHAP 3: 🔴 KRITIKAL - Otorisasi Drive (WAJIB)
Tanpa langkah ini, fitur unggah KTP akan error.
1. Di Editor Apps Script, lihat menu bar bagian atas (di sebelah tombol **Run** / Jalankan).
2. Pilih fungsi `triggerAuth` dari menu drop-down.
3. Klik tombol **Run**.
4. Muncul jendela "Authorization Required". Klik **Review Permissions**.
5. Pilih akun Google Anda.
6. **PERINGATAN KEAMANAN:** Google akan bilang "Google hasn't verified this app".
   - Klik tulisan **Advanced** (Lanjutan) di kiri bawah.
   - Klik tulisan **Go to Sistem Jejak Langkah (unsafe)** di bagian paling bawah.
7. Klik **Allow** (Izinkan).
8. Tunggu hingga muncul pesan "Execution completed" di bagian bawah.

## TAHAP 4: Deploy (Menerbitkan Akses)
1. Klik tombol **Deploy** > **New Deployment**.
2. Pilih jenis **Web App**.
3. **Description:** Versi 1.0.
4. **Execute as:** `Me` (Saya).
5. **Who has access:** `Anyone` (Siapa saja).
6. Klik **Deploy**.
7. Salin **Web App URL** yang muncul (ini akan dimasukkan ke aplikasi).

## TAHAP 5: Menghubungkan ke Aplikasi
1. Buka aplikasi Anda, masuk ke **Admin Panel**.
2. Masukkan Spreadsheet ID dan Web App URL yang tadi Anda salin.
3. Klik **SAVE & SYNC CLOUD**.
