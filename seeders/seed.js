const db = require("../config/db");
const bcrypt = require("bcrypt");

const seed = async () => {
  try {
    console.log("=== Memulai Seeder ===");

    /*
     * Hapus data lama
     */
    console.log("Menghapus data lama...");

    await db.query("DELETE FROM riwayat_beban");
    await db.query("DELETE FROM jadwal");
    await db.query("DELETE FROM tugas");
    await db.query("DELETE FROM karyawan");
    await db.query("DELETE FROM admin");

    /*
     * Reset AUTO_INCREMENT
     */
    console.log("Reset AUTO_INCREMENT...");

    await db.query("ALTER TABLE admin AUTO_INCREMENT = 1");
    await db.query("ALTER TABLE karyawan AUTO_INCREMENT = 1");
    await db.query("ALTER TABLE tugas AUTO_INCREMENT = 1");
    await db.query("ALTER TABLE jadwal AUTO_INCREMENT = 1");
    await db.query("ALTER TABLE riwayat_beban AUTO_INCREMENT = 1");

    /*
     * Seed Admin
     */
    console.log("Menambahkan admin...");

    const adminPassword = await bcrypt.hash("admin123", 10);

    await db.query(
      `
      INSERT INTO admin (nama, email, password)
      VALUES (?, ?, ?)
      `,
      ["Administrator", "admin@gmail.com", adminPassword],
    );

    /*
     * Seed Karyawan
     */
    console.log("Menambahkan karyawan...");

    const karyawanPassword = await bcrypt.hash("password123", 10);

    const karyawanData = [
      [
        "Budi Santoso",
        "budi@gmail.com",
        "Backend Developer",
        "081234567801",
        "NodeJS,MySQL,Docker",
        4,
      ],
      [
        "Andi Saputra",
        "andi@gmail.com",
        "Frontend Developer",
        "081234567802",
        "React,JavaScript,Figma",
        4,
      ],
      [
        "Siti Rahma",
        "siti@gmail.com",
        "Fullstack Developer",
        "081234567803",
        "NodeJS,React,MySQL",
        5,
      ],
      [
        "Rina Putri",
        "rina@gmail.com",
        "QA Engineer",
        "081234567804",
        "Testing,Postman,Manual Testing",
        3,
      ],
      [
        "Dika Pratama",
        "dika@gmail.com",
        "Mobile Developer",
        "081234567805",
        "Flutter,Dart,Firebase",
        4,
      ],
      [
        "Yoga Prakoso",
        "yoga@gmail.com",
        "DevOps Engineer",
        "081234567806",
        "Docker,Linux,CI/CD",
        3,
      ],
    ];

    for (const karyawan of karyawanData) {
      await db.query(
        `
        INSERT INTO karyawan (
          nama_karyawan,
          email,
          password,
          jabatan,
          no_hp,
          skill,
          maksimal_tugas
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          karyawan[0],
          karyawan[1],
          karyawanPassword,
          karyawan[2],
          karyawan[3],
          karyawan[4],
          karyawan[5],
        ],
      );
    }

    /*
     * Seed Tugas
     */
    console.log("Menambahkan tugas...");

    const tugasData = [
      [
        "Perbaikan API Login",
        "Memperbaiki bug autentikasi",
        "Tinggi",
        "NodeJS",
        "2026-06-30",
        "4 Jam",
      ],
      [
        "Pembuatan Dashboard Admin",
        "Membuat tampilan dashboard",
        "Sedang",
        "React",
        "2026-07-02",
        "8 Jam",
      ],
      [
        "Pengujian Modul Login",
        "Testing fitur login",
        "Tinggi",
        "Testing",
        "2026-06-28",
        "3 Jam",
      ],
      [
        "Deploy Server Produksi",
        "Deployment aplikasi",
        "Tinggi",
        "Docker,Linux",
        "2026-06-27",
        "2 Jam",
      ],
      [
        "Pengembangan Fitur Mobile",
        "Pembuatan fitur mobile",
        "Sedang",
        "Flutter",
        "2026-07-05",
        "10 Jam",
      ],
      [
        "Optimasi Database",
        "Optimasi query MySQL",
        "Rendah",
        "MySQL",
        "2026-07-06",
        "5 Jam",
      ],
      [
        "Integrasi Frontend API",
        "Integrasi React dengan Backend",
        "Sedang",
        "React,NodeJS",
        "2026-07-03",
        "6 Jam",
      ],
      [
        "Pembuatan CI/CD Pipeline",
        "Automasi deployment",
        "Rendah",
        "Docker,CI/CD",
        "2026-07-08",
        "6 Jam",
      ],
      [
        "Backup Database",
        "Backup rutin database",
        "Rendah",
        "MySQL",
        "2026-07-01",
        "2 Jam",
      ],
      [
        "Monitoring Infrastruktur",
        "Pengecekan server",
        "Sedang",
        "Linux",
        "2026-07-04",
        "3 Jam",
      ],
      [
        "Refactor Modul Pembayaran",
        "Perbaikan struktur kode pembayaran",
        "Tinggi",
        "NodeJS",
        "2026-07-02",
        "5 Jam",
      ],
      [
        "Implementasi Notifikasi Email",
        "Membuat sistem email otomatis",
        "Sedang",
        "NodeJS",
        "2026-07-03",
        "4 Jam",
      ],
      [
        "Pengujian Modul Pembayaran",
        "Testing fitur pembayaran",
        "Tinggi",
        "Testing",
        "2026-07-02",
        "3 Jam",
      ],
      [
        "Desain Halaman Profil",
        "Desain UI halaman profil",
        "Rendah",
        "Figma",
        "2026-07-06",
        "4 Jam",
      ],
      [
        "Pembuatan Laporan PDF",
        "Generate laporan PDF",
        "Sedang",
        "NodeJS",
        "2026-07-04",
        "5 Jam",
      ],
      [
        "Sinkronisasi Firebase",
        "Sinkronisasi data mobile",
        "Sedang",
        "Firebase",
        "2026-07-05",
        "6 Jam",
      ],
      [
        "Optimasi Query Transaksi",
        "Percepatan query transaksi",
        "Tinggi",
        "MySQL",
        "2026-07-03",
        "4 Jam",
      ],
      [
        "Pembuatan Unit Test",
        "Unit testing backend",
        "Sedang",
        "Testing",
        "2026-07-07",
        "5 Jam",
      ],
      [
        "Monitoring Container",
        "Monitoring Docker container",
        "Rendah",
        "Docker",
        "2026-07-08",
        "3 Jam",
      ],
      [
        "Integrasi Payment Gateway",
        "Integrasi pembayaran",
        "Tinggi",
        "NodeJS",
        "2026-07-04",
        "8 Jam",
      ],
      [
        "Perbaikan Tampilan Mobile",
        "Perbaikan UI mobile",
        "Sedang",
        "Flutter",
        "2026-07-06",
        "4 Jam",
      ],
      [
        "Pembuatan Dokumentasi API",
        "Dokumentasi endpoint",
        "Rendah",
        "NodeJS",
        "2026-07-08",
        "2 Jam",
      ],
      [
        "Pengujian API Gateway",
        "Testing gateway",
        "Sedang",
        "Postman",
        "2026-07-05",
        "3 Jam",
      ],
      [
        "Optimasi Server Linux",
        "Optimasi performa server",
        "Tinggi",
        "Linux",
        "2026-07-04",
        "4 Jam",
      ],
      [
        "Audit Keamanan Sistem",
        "Pengecekan keamanan",
        "Tinggi",
        "Testing",
        "2026-07-03",
        "6 Jam",
      ],
      [
        "Pembuatan Fitur Chat",
        "Realtime chat",
        "Sedang",
        "React",
        "2026-07-07",
        "8 Jam",
      ],
      [
        "Backup Log Server",
        "Backup file log",
        "Rendah",
        "Linux",
        "2026-07-09",
        "2 Jam",
      ],
      [
        "Integrasi Mobile Notification",
        "Push notification",
        "Sedang",
        "Flutter,Firebase",
        "2026-07-08",
        "5 Jam",
      ],
      [
        "Deploy Staging Server",
        "Deploy environment staging",
        "Sedang",
        "Docker,Linux",
        "2026-07-06",
        "3 Jam",
      ],
      [
        "Stress Testing Sistem",
        "Pengujian beban aplikasi",
        "Tinggi",
        "Testing",
        "2026-07-05",
        "6 Jam",
      ],
    ];

    for (const tugas of tugasData) {
      await db.query(
        `
        INSERT INTO tugas (
          nama_tugas,
          deskripsi,
          prioritas,
          skill_dibutuhkan,
          deadline,
          durasi
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        tugas,
      );
    }

    console.log("=== Seeder berhasil dijalankan ===");

    process.exit();
  } catch (error) {
    console.error("Seeder gagal:", error);

    process.exit(1);
  }
};

seed();
