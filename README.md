# Weekly Case Tracker — Firebase V1

Aplikasi internal untuk mencatat case operasional, PICAPA, progres mingguan, hasil weekly meeting, dan arsip.

## Fitur V1
- Dashboard ringkasan case lintas area.
- Create Case oleh Admin/Koordinator.
- Problem Identification, Corrective Action, dan Preventive Action.
- PIC memperbarui tindakan yang ditugaskan kepadanya.
- Progress log menyimpan riwayat update, kendala, dan next step.
- Catatan Weekly Meeting dan arsip case.
- Ekspor rekap CSV yang dapat dibuka di Excel.
- Login menggunakan ID Pengguna + password. Email teknis tidak terlihat oleh anggota.
- Admin membuat akun, mengaktifkan/menonaktifkan akun, dan reset password.

## Struktur
- `source/app.part01..06`: source frontend terkompresi (gzip + Base64).
- `scripts/build.js`: merakit source menjadi `public/index.html`.
- `public/`: output build website.
- `functions/`: Firebase Cloud Functions dengan Admin SDK.
- `firestore.rules`: kontrol akses database.
- `firebase.json`, `.firebaserc`: konfigurasi Firebase CLI.
- `vercel.json`: konfigurasi build Vercel.

## Deploy ke Vercel
1. Di Vercel, pilih **Add New → Project**, lalu import repository `Gustiadi97/weekly-case-tracker`.
2. Framework Preset: **Other**.
3. Root Directory: `./`.
4. Build Command: gunakan nilai dari `vercel.json` (`npm run build`).
5. Output Directory: `public`.
6. Install Command: kosongkan (project frontend tidak memiliki dependency npm).
7. Klik **Deploy**.

Vercel menjalankan script build dan membuat `public/index.html`. Setiap push ke branch `main` akan memicu deployment baru jika integrasi Git Vercel aktif.

## Setup Firebase
Project target pada `.firebaserc`: `weekly-case-tracker`.

Di Firebase Console:
1. Authentication → Sign-in method → aktifkan **Email/Password**.
2. Firestore Database → Create database. Pilih lokasi dengan hati-hati.
3. Untuk pengelolaan akun dari menu Admin, aktifkan paket **Blaze** dan hubungkan billing karena Cloud Functions memerlukan billing.

Login ID dipetakan secara internal menjadi email teknis `idlogin@weeklycasetracker.app`; anggota hanya memasukkan ID dan password di website.

### Deploy backend Firebase
Persyaratan: Node.js 22+ dan Firebase CLI.

```bash
npm install -g firebase-tools
firebase login
firebase use weekly-case-tracker
firebase functions:secrets:set BOOTSTRAP_CODE
```

Saat diminta, masukkan kode acak yang panjang. Simpan rahasia ini dengan aman, jangan commit ke GitHub.

```bash
cd functions
npm install
cd ..
firebase deploy --only firestore:rules,functions
```

Setelah frontend Vercel tersedia, tambahkan domain Vercel di Firebase Authentication → Settings → Authorized domains.

### Aktivasi Admin pertama (satu kali)
1. Firebase Console → Authentication → Users → Add user.
2. Buat user dengan email teknis, misalnya `admin001@weeklycasetracker.app`, dan password awal.
3. Buka website Vercel, login memakai ID `admin001` dan password tersebut.
4. Pada form Aktivasi Admin Pertama, isi nama Admin dan Secret `BOOTSTRAP_CODE`.
5. Setelah berhasil, buat semua akun Koordinator, PIC, dan Viewer melalui menu Manajemen Pengguna.

Bootstrap hanya dapat digunakan sekali. Setelah Admin pertama aktif, semua akun berikutnya dibuat melalui website.

## Hak akses
| Role | Hak akses |
|---|---|
| Admin | Mengelola akun pengguna dan seluruh data |
| Koordinator | Membuat case, menambah tindakan, mencatat meeting, menutup case |
| Anggota / PIC | Melihat case dan memperbarui tindakan yang ditugaskan |
| Management / Viewer | Melihat dashboard, case, progres, dan laporan |

Security Rules memeriksa custom claims role dan status akun. Jangan membuka akses database untuk publik.

## Uji sebelum digunakan tim
1. Login sebagai Admin pertama.
2. Buat satu Koordinator dan dua akun PIC uji.
3. Login sebagai Koordinator, buat case dan tetapkan CA/PA kepada PIC.
4. Login sebagai PIC, pastikan hanya tindakan yang ditugaskan kepadanya dapat diperbarui.
5. Login sebagai Viewer, pastikan tidak ada menu membuat case atau update.
6. Nonaktifkan akun uji dan pastikan akun tersebut kehilangan akses.
7. Uji di HP dan laptop.

## Biaya dan keamanan
- Authentication, Firestore, dan Hosting memiliki kuota tanpa biaya sesuai ketentuan Firebase.
- Cloud Functions memerlukan paket Blaze dan billing tertaut. Blaze adalah pay-as-you-go; pantau penggunaan dan buat budget alert.
- Cloud Storage belum diaktifkan pada V1.
- Firebase Web App config di frontend adalah konfigurasi client, bukan service-account key. Jangan commit service-account JSON, private key, password, atau nilai `BOOTSTRAP_CODE`.
- Batasi Web API key untuk API yang diperlukan dan domain website produksi.
- Repository ini saat ini **Public**. Untuk aplikasi internal, sebaiknya ubah visibility menjadi **Private** pada GitHub Settings → Danger Zone → Change repository visibility sebelum mengundang tim.
