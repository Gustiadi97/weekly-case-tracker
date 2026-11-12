# Weekly Case Tracker — PICAPA

Aplikasi menggunakan Firebase Authentication dan Cloud Firestore. Frontend di-host di Vercel. Runtime aplikasi tidak menggunakan Cloud Functions dan tidak memerlukan billing Cloud Functions.

## Fitur
- Login dengan ID dan password; ID dipetakan ke email internal `@weeklycasetracker.app`.
- Dashboard, case monitoring, tindakan PICAPA, progress log, weekly meeting, laporan, dan arsip.
- Admin membuat akun anggota melalui Firebase Authentication sekunder tanpa memutus sesi Admin.
- Role dibaca dari dokumen `users/{uid}` dan ditegakkan oleh Firestore Security Rules.
- Nonaktifkan akun dengan mengubah `active=false`; Firestore Rules menolak akses data.
- Data operasional tetap berada di koleksi Firestore yang sama.

## Pengujian Firestore Rules (lokal)

Pengujian menggunakan Firestore Emulator dan project demo terpisah. Pengujian ini tidak membutuhkan login Firebase dan tidak mengakses database produksi.

```bash
npm install --prefix tests
npm run test:rules
```

Suite menguji pembuatan Case dan Action, penugasan PIC, kesesuaian Case/Action pada progress log, kewajiban memperbarui Action bersama progress log, serta pencatatan audit ketika riwayat dikoreksi. CI menjalankan suite yang sama setiap ada pull request yang mengubah Rules, konfigurasi emulator, atau test.
## Deploy
Vercel menjalankan `npm run build` dan menerbitkan folder `public`. Push ke branch `main` memicu deployment otomatis jika integrasi GitHub Vercel aktif.

Terbitkan Firestore Rules terbaru agar koreksi progress memiliki izin yang aman. Bila tidak menggunakan terminal, buka Firebase Console → Firestore Database → Rules, salin seluruh isi file [`firestore.rules`](./firestore.rules), tempel, lalu klik **Publish**. Langkah ini diperlukan satu kali setelah pembaruan aturan.

Alternatif melalui Cloud Shell:
```bash
firebase use weekly-case-tracker
firebase deploy --only firestore:rules
```
Tidak ada target Cloud Functions pada konfigurasi Firebase.

## Aktivasi Admin pertama — satu kali
Akun Admin pertama harus dibuat sekali oleh pemilik project melalui Firebase Console karena browser tidak boleh diberi kemampuan membuat Admin pertama secara publik.

1. Firebase Console → Authentication → Sign-in method → aktifkan **Email/Password**.
2. Authentication → Users → Add user.
3. Email: `10001596@weeklycasetracker.app`.
4. Password awal: gunakan password kuat yang kamu tentukan (Firebase minimum 6 karakter). Jika memakai `123456` untuk tes, segera ganti setelah login.
5. Salin UID akun.
6. Firestore Database → Data → buat koleksi `users`; Document ID harus sama dengan UID tadi.
7. Isi field:
   - `full_name` string: `Admin Weekly Case Tracker`
   - `login_id` string: `10001596`
   - `employee_id` string: `10001596`
   - `area_name` string: `All Areas`
   - `role` string: `admin`
   - `active` boolean: `true`
   - `created_at` string: waktu ISO
   - `created_by` string: `setup`
8. Pastikan Firestore Rules terbaru sudah diterbitkan. Login ke website dengan ID `10001596` dan password yang dibuat di langkah 4.

Jangan buat profil Admin pertama melalui form website. Setelah Admin pertama aktif, akun anggota dapat dibuat dari menu **Manajemen Pengguna**.

## Batasan tanpa backend
Admin dapat membuat akun dan menonaktifkan/mengaktifkan profil. Admin tidak dapat mengganti password Firebase milik pengguna lain dari browser tanpa backend tepercaya; pengguna harus mengganti password melalui sesi akunnya sendiri. Email internal dipakai sebagai identitas login dan bukan alamat email pemulihan yang dapat menerima pesan.

## Koleksi Firestore
`users`, `cases`, `actions`, `progress_logs`, `meetings`, dan `counters`.

Firestore Rules hanya mengatur izin akses; tidak menghapus atau memigrasikan data lama.
