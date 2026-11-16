# Weekly Case Tracker — PICAPA (Supabase)

Aplikasi Weekly Case Tracker menggunakan **Supabase Auth dan PostgreSQL sebagai satu-satunya backend aktif**. Frontend dibangun menjadi file statis dan di-host di Vercel.

## Backend aktif

- Login ID + password melalui Supabase Auth. ID dipetakan ke email internal `@weeklycasetracker.app`.
- Profil, role, dan status akses disimpan di `public.wct_users`.
- Direktori PIC disimpan di `public.wct_team_directory`.
- Data Case, Action, Progress Log, audit koreksi, Weekly Meeting, dan pengaturan disimpan pada tabel `wct_*`.
- Akses data dibatasi dengan Supabase Row Level Security (RLS).
- Pembuatan akun anggota menggunakan Supabase Edge Function `wct-admin-users`; service-role key tidak pernah dimasukkan ke browser.
- Tidak menggunakan Firebase Authentication, Cloud Firestore, Firebase Hosting, atau Firebase Cloud Functions.

## Tabel yang digunakan

| Tabel | Fungsi |
|---|---|
| `wct_users` | Profil, login ID, role, area, dan status pengguna |
| `wct_team_directory` | Direktori PIC |
| `wct_cases` | Data permasalahan / Case |
| `wct_actions` | Corrective dan Preventive Action |
| `wct_progress_logs` | Riwayat update progress |
| `wct_progress_log_edits` | Audit koreksi progress |
| `wct_meetings` | Weekly Meeting |
| `wct_meeting_cases` | Relasi Meeting dengan Case |
| `wct_counters` | Penomoran Case |
| `wct_app_settings` | Kategori, divisi, dan pengaturan aplikasi |

## Setup database

Tabel dan RLS dasar dibuat terpisah pada project Supabase. Untuk menambahkan transaksi atomik yang dipakai oleh alur Case, PICAPA, dan audit progress:

1. Buka Supabase Dashboard → SQL Editor.
2. Buka file [`supabase/migrations/20261116_wct_workflows.sql`](./supabase/migrations/20261116_wct_workflows.sql).
3. Jalankan seluruh SQL satu kali.
4. Pastikan semua fungsi `wct_*` berhasil dibuat.

Jalankan file ini hanya satu kali setelah tabel dan RLS dasar berhasil dibuat. Jangan menghapus atau mengganti tabel/data lain di schema `public`.

Fungsi tersebut memvalidasi role dari `wct_users` dan menjalankan operasi terkait dalam satu transaksi PostgreSQL.

## Setup Edge Function untuk manajemen pengguna

Fungsi ini diperlukan agar Admin dapat membuat akun Auth, mengubah profil, mengaktifkan/nonaktifkan pengguna, dan mengatur ulang password anggota.

Folder `supabase/functions/wct-admin-users` sudah disiapkan sebagai Edge Function bernama `wct-admin-users`. Dari root repository (Node.js 20+), jalankan:

```bash
npx supabase@latest login
npx supabase@latest link --project-ref ktqgtutzgivxjwtdqcbw
npx supabase@latest functions deploy wct-admin-users --project-ref ktqgtutzgivxjwtdqcbw --use-api
```

Opsi `--use-api` menghindari kebutuhan Docker untuk proses bundling. Konfigurasi lokal ada di `supabase/config.toml`, dan verifikasi JWT tetap aktif.

Function memakai environment bawaan Supabase: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEYS`, dan `SUPABASE_SECRET_KEYS` (mengambil key bernama `default`). Ada fallback ke nama legacy selama masa transisi API key. Jangan pernah menyalin secret key ke file frontend, GitHub, atau Vercel public environment. Secret key hanya digunakan di Edge Function.

## Admin pertama

Akun pertama sudah dibuat melalui Supabase Authentication dan profilnya sudah dipasangkan ke `wct_users`:

- Login ID: `admin`
- Email internal: `admin@weeklycasetracker.app`
- Role: `admin`
- Status: aktif

Tidak perlu membuat ulang akun atau menjalankan ulang INSERT admin.

## Build dan deploy Vercel

Build:

```bash
npm run build
```

Konfigurasi Vercel:
- Build command: `npm run build`
- Output directory: `public`
- Framework preset: Other
- Root directory: `./`

URL Supabase dan publishable key dipakai pada frontend. Publishable key memang dirancang untuk browser; keamanan database tetap bergantung pada RLS dan validasi fungsi server-side.

## Perilaku aplikasi

Fitur yang dipertahankan: Dashboard, Case Monitoring, PICAPA, penugasan PIC, update progress, koreksi riwayat dengan audit trail, Weekly Meeting, Reports & Archive, Pengaturan, dan Manajemen Pengguna.

Case baru dan action awal disimpan secara atomik. Update progress dan koreksi riwayat juga menggunakan fungsi PostgreSQL atomik supaya ringkasan Action dan audit log tidak terpisah.

## Catatan migrasi

- Aplikasi pada branch ini tidak lagi menggunakan Firebase SDK atau Firebase sebagai backend.
- Data lama Firebase tidak otomatis dipindahkan. Project Firebase lama tidak dihapus dari konsol; data lama tetap menjadi arsip terpisah.
- Database Supabase baru berawal dengan akun Admin yang sudah dibuat. Data Case, Action, Meeting, dan pengguna lain dimulai kosong sampai dibuat melalui aplikasi.
- Branch `supabase-migration` dipakai untuk uji sebelum dijadikan branch produksi.
