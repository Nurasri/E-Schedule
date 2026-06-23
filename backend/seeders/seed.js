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
        "Staf Administrasi Operasional",
        "081234567801",
        "Administrasi,Dokumentasi,Pelaporan",
        4,
      ],
      [
        "Andi Saputra",
        "andi@gmail.com",
        "Staf Monitoring Operasional",
        "081234567802",
        "Monitoring,Analisis Data,Excel",
        4,
      ],
      [
        "Siti Rahma",
        "siti@gmail.com",
        "Auditor Internal",
        "081234567803",
        "Audit,Evaluasi,Pelaporan",
        5,
      ],
      [
        "Rina Putri",
        "rina@gmail.com",
        "Staf Verifikasi",
        "081234567804",
        "Verifikasi Dokumen,Validasi Data,Administrasi",
        4,
      ],
      [
        "Dika Pratama",
        "dika@gmail.com",
        "Koordinator Operasional",
        "081234567805",
        "Koordinasi Tim,Monitoring,Pelaporan",
        5,
      ],
      [
        "Yoga Prakoso",
        "yoga@gmail.com",
        "Supervisor Operasional",
        "081234567806",
        "Pengawasan,Evaluasi,Penjadwalan",
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
        "Verifikasi Dokumen Pengiriman",
        "Memeriksa kelengkapan dokumen pengiriman dari cabang.",
        "Tinggi",
        "Verifikasi Dokumen",
        "2026-06-30",
        "4 Jam",
      ],
      [
        "Penyusunan Laporan Operasional Harian",
        "Menyusun laporan aktivitas operasional harian.",
        "Tinggi",
        "Pelaporan",
        "2026-06-30",
        "3 Jam",
      ],
      [
        "Monitoring Distribusi Cabang Utara",
        "Memantau kelancaran distribusi ke wilayah cabang utara.",
        "Tinggi",
        "Monitoring",
        "2026-07-01",
        "5 Jam",
      ],
      [
        "Audit Kepatuhan SOP Operasional",
        "Melakukan audit kepatuhan terhadap SOP operasional.",
        "Tinggi",
        "Audit",
        "2026-07-01",
        "6 Jam",
      ],
      [
        "Analisis Keterlambatan Distribusi",
        "Menganalisis penyebab keterlambatan distribusi barang.",
        "Sedang",
        "Analisis Data",
        "2026-07-02",
        "5 Jam",
      ],
      [
        "Validasi Data Pengiriman",
        "Memastikan data pengiriman telah sesuai.",
        "Sedang",
        "Validasi Data",
        "2026-07-02",
        "3 Jam",
      ],
      [
        "Koordinasi Tim Operasional",
        "Melakukan koordinasi pekerjaan antar staf operasional.",
        "Sedang",
        "Koordinasi Tim",
        "2026-07-03",
        "4 Jam",
      ],
      [
        "Evaluasi Beban Kerja Mingguan",
        "Mengevaluasi pemerataan distribusi tugas karyawan.",
        "Sedang",
        "Evaluasi",
        "2026-07-03",
        "4 Jam",
      ],
      [
        "Pengawasan Pelaksanaan Tugas",
        "Mengawasi pelaksanaan tugas yang sedang berjalan.",
        "Tinggi",
        "Pengawasan",
        "2026-07-04",
        "6 Jam",
      ],
      [
        "Dokumentasi Kegiatan Operasional",
        "Mendokumentasikan aktivitas operasional harian.",
        "Rendah",
        "Dokumentasi",
        "2026-07-04",
        "2 Jam",
      ],
      [
        "Pembuatan Rekapitulasi Data",
        "Menyusun rekapitulasi data operasional bulanan.",
        "Sedang",
        "Excel",
        "2026-07-05",
        "4 Jam",
      ],
      [
        "Verifikasi Dokumen Vendor",
        "Memeriksa dokumen kerja sama vendor.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-07-05",
        "3 Jam",
      ],
      [
        "Monitoring Proyek Cabang Selatan",
        "Memantau progres operasional cabang selatan.",
        "Sedang",
        "Monitoring",
        "2026-07-06",
        "4 Jam",
      ],
      [
        "Penyusunan Laporan Evaluasi",
        "Menyusun laporan hasil evaluasi operasional.",
        "Tinggi",
        "Pelaporan",
        "2026-07-06",
        "5 Jam",
      ],
      [
        "Audit Dokumen Operasional",
        "Pemeriksaan kelengkapan dokumen operasional.",
        "Sedang",
        "Audit",
        "2026-07-06",
        "5 Jam",
      ],
      [
        "Pengarsipan Dokumen Cabang",
        "Mengelola arsip dokumen operasional.",
        "Rendah",
        "Administrasi",
        "2026-07-07",
        "3 Jam",
      ],
      [
        "Analisis Efektivitas Distribusi",
        "Analisis efektivitas proses distribusi.",
        "Sedang",
        "Analisis Data",
        "2026-07-07",
        "5 Jam",
      ],
      [
        "Validasi Data Mitra",
        "Memastikan keakuratan data mitra perusahaan.",
        "Rendah",
        "Validasi Data",
        "2026-07-07",
        "2 Jam",
      ],
      [
        "Koordinasi Evaluasi Operasional",
        "Koordinasi tindak lanjut hasil evaluasi.",
        "Sedang",
        "Koordinasi Tim",
        "2026-07-08",
        "4 Jam",
      ],
      [
        "Evaluasi Kinerja Operasional",
        "Melakukan evaluasi capaian operasional.",
        "Tinggi",
        "Evaluasi",
        "2026-07-08",
        "5 Jam",
      ],
      [
        "Dokumentasi Rapat Operasional",
        "Membuat dokumentasi hasil rapat operasional.",
        "Rendah",
        "Dokumentasi",
        "2026-07-08",
        "2 Jam",
      ],
      [
        "Monitoring Tindak Lanjut Temuan Audit",
        "Memantau penyelesaian temuan audit.",
        "Sedang",
        "Monitoring",
        "2026-07-09",
        "4 Jam",
      ],
      [
        "Penyusunan Laporan Bulanan",
        "Menyusun laporan bulanan divisi operasional.",
        "Tinggi",
        "Pelaporan",
        "2026-07-09",
        "6 Jam",
      ],
      [
        "Verifikasi Berkas Administrasi",
        "Memeriksa kelengkapan berkas administrasi.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-07-10",
        "3 Jam",
      ],
      [
        "Analisis Produktivitas Tim",
        "Menganalisis produktivitas kerja tim operasional.",
        "Sedang",
        "Analisis Data",
        "2026-07-10",
        "5 Jam",
      ],
      [
        "Pengawasan Distribusi Cabang",
        "Mengawasi pelaksanaan distribusi antar cabang.",
        "Tinggi",
        "Pengawasan",
        "2026-07-10",
        "6 Jam",
      ],
      [
        "Koordinasi Penutupan Mingguan",
        "Koordinasi penyelesaian pekerjaan mingguan.",
        "Sedang",
        "Koordinasi Tim",
        "2026-07-11",
        "4 Jam",
      ],
      [
        "Evaluasi SOP Operasional",
        "Evaluasi penerapan SOP operasional.",
        "Tinggi",
        "Evaluasi",
        "2026-07-11",
        "5 Jam",
      ],
      [
        "Pengarsipan Dokumen Evaluasi",
        "Mengarsipkan dokumen hasil evaluasi.",
        "Rendah",
        "Administrasi",
        "2026-07-11",
        "2 Jam",
      ],
      [
        "Penyusunan Rencana Kerja Mingguan",
        "Menyusun rencana kerja operasional minggu berikutnya.",
        "Sedang",
        "Penjadwalan",
        "2026-07-11",
        "4 Jam",
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
