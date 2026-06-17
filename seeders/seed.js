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
