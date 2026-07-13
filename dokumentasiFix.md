# Sistem Penjadwalan Tugas Karyawan Berbasis Greedy dan Backtracking

## Deskripsi

Sistem Penjadwalan Tugas Karyawan merupakan aplikasi berbasis **Web** dan **Mobile** yang dikembangkan untuk membantu perusahaan dalam melakukan pembagian tugas secara otomatis menggunakan algoritma **Greedy** dan **Backtracking**.

Sistem ini mampu membantu administrator dalam mengelola data karyawan, data tugas, proses penjadwalan otomatis, monitoring jadwal, serta riwayat beban kerja setiap karyawan.

---

# Teknologi yang Digunakan

## Backend

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt
- dotenv

## Web

- React.js
- Vite
- Bootstrap
- Axios
- React Router

## Mobile

- Flutter
- Dart
- HTTP Package

---

# Persyaratan Sistem

Pastikan perangkat telah menginstal:

- Node.js v20 atau lebih baru
- MySQL 8.x
- Git
- Flutter SDK
- Android Studio / Android Emulator
- VSCode

---

# Clone Repository

```bash
git clone https://github.com/username/project-capstone.git

cd project-capstone
```

---

# Struktur Folder

```
project-capstone
│
├── backend
│
├── frontend-web
│
└── frontend-mobile
```

---

# Menjalankan Backend

Masuk ke folder backend

```bash
cd backend
```

Install dependency

```bash
npm install
```

Buat file

```
.env
```

Contoh isi

```
PORT=

DB_HOST=

DB_USER=

DB_PASSWORD=

DB_NAME=

JWT_SECRET=
```

Sesuaikan dengan konfigurasi database masing-masing.

---

## Membuat Database

Buat database MySQL

```
db_penjadwalan
```

Import struktur database sesuai file SQL yang tersedia.

---

## Menjalankan Seeder

```bash
npm run seed
```

Seeder akan membuat:

- Admin
- Data Karyawan
- Data Tugas

---

## Menjalankan Server

Development

```bash
npm run dev
```

atau

Production

```bash
npm start
```

Jika berhasil akan muncul

```
Backend Penjadwalan Tugas Berjalan
```

---

# Menjalankan Web

Masuk ke folder

```bash
cd frontend-web
```

Install dependency

```bash
npm install
```

Buat file

```
.env
```

Contoh

```
VITE_API_URL=
```

Sesuaikan dengan alamat backend.

Jalankan

```bash
npm run dev
```

Web akan berjalan pada

```
http://localhost:5173
```

---

# Menjalankan Mobile

Masuk ke folder

```bash
cd frontend-mobile
```

Install package

```bash
flutter pub get
```

Pastikan emulator Android telah berjalan.

Jalankan aplikasi

```bash
flutter run
```

Untuk build release

Android APK

```bash
flutter build apk
```

Android App Bundle

```bash
flutter build appbundle
```

---

# Login

Gunakan akun administrator yang telah dibuat melalui proses seeding database.

---

# Fitur Sistem

## Web

- Login Administrator
- Dashboard
- Kelola Data Karyawan
- Kelola Data Tugas
- Penjadwalan Manual
- Generate Jadwal Otomatis
- Monitoring Jadwal
- Riwayat Beban Kerja
- Logout

## Mobile

- Login
- Dashboard
- Jadwal Tugas
- Detail Jadwal
- Profil

---

# Algoritma

Sistem menggunakan dua algoritma utama.

## Greedy

Digunakan untuk memilih kandidat karyawan terbaik berdasarkan:

- Prioritas tugas
- Kesesuaian skill
- Beban kerja

## Backtracking

Digunakan untuk melakukan validasi terhadap hasil Greedy sehingga:

- Tidak terjadi konflik jadwal
- Beban kerja tetap seimbang
- Seluruh constraint terpenuhi

---

# Kontributor

Capstone Project

Program Studi Teknik Informatika

Universitas Putra Indonesia "YPTK" Padang
