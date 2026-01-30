# 📘 Panduan Lengkap Integrasi Cloud Jejak Langkah

Ikuti langkah-langkah ini secara perlahan untuk menghubungkan aplikasi Anda ke database Google Sheets.

## TAHAP 1: Menyiapkan Google Sheet (Database)
1. Buka [Google Sheets](https://sheets.new).
2. Beri nama file Anda, misalnya: `Database Jejak Langkah`.
3. Lihat alamat (URL) di browser Anda saat membuka sheet tersebut.
4. **Cari ID Spreadsheet Anda:**
   - Contoh URL: `https://docs.google.com/spreadsheets/d/1ABC123xyz789_ID_ANDA/edit#gid=0`
   - Bagian yang berada di antara `/d/` dan `/edit` adalah **ID Spreadsheet** Anda.
   - Salin dan simpan ID tersebut.

## TAHAP 2: Menyiapkan Google Apps Script (Mesin Penghubung)
1. Di dalam Google Sheet tadi, klik menu **Extensions** (Ekstensi) > **Apps Script**.
2. Akan terbuka jendela baru. Hapus semua kode yang ada di sana (`function myFunction...`).
3. Buka file `google-apps-script.gs` yang ada di proyek ini, salin semua kodenya, dan tempelkan ke jendela Apps Script.
4. Klik ikon 💾 (Save/Simpan) dan beri nama proyek, misal: `Engine Jejak Langkah`.

## TAHAP 3: Deploy (Menerbitkan Akses)
1. Klik tombol biru **Deploy** di pojok kanan atas > **New Deployment**.
2. Klik ikon gerigi (Select type) > Pilih **Web App**.
3. Isi kolom:
   - **Description:** `V1`
   - **Execute as:** `Me` (Saya)
   - **Who has access:** `Anyone` (Siapa saja) — **PENTING: Jangan pilih 'Anyone with Google Account' agar aplikasi lancar.**
4. Klik **Deploy**.
5. Jika muncul "Authorize access", klik **Authorize Access**, pilih akun Google Anda.
6. Jika muncul peringatan "Google hasn't verified this app", klik **Advanced** > Klik **Go to Engine Jejak Langkah (unsafe)**.
7. Klik **Allow** (Izinkan).
8. **Salin Web App URL** yang muncul (biasanya berakhiran `/exec`).

## TAHAP 4: Menghubungkan ke Aplikasi
1. Buka aplikasi Jejak Langkah Anda.
2. Masuk ke **Admin Panel** (Ikon Perisai di pojok kanan atas).
3. Masuk dengan: User: `admin` | Pass: `jejaklangkah2024`.
4. Klik tab **Config** (Ikon Server di paling bawah).
5. Masukkan **Spreadsheet ID** dan **Web App URL** yang sudah Anda salin tadi.
6. Klik **SAVE & SYNC NOW**.

Selesai! Sekarang data yang diinput di aplikasi akan otomatis masuk ke Google Sheet Anda.
