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
    console.log("Menambahkan 20 karyawan...");

    const karyawanPassword = await bcrypt.hash("password123", 10);

    const karyawanData = [
      //   [
      //     "Budi Santoso",
      //     "budi@gmail.com",
      //     "Supervisor Operasional",
      //     "081234567801",
      //     "Pelaporan,Evaluasi,Koordinasi Tim,Monitoring",
      //     6,
      //   ],

      //   [
      //     "Andi Saputra",
      //     "andi@gmail.com",
      //     "Koordinator Operasional",
      //     "081234567802",
      //     "Koordinasi Tim,Monitoring,Evaluasi,Pelaporan",
      //     6,
      //   ],

      //   [
      //     "Siti Rahma",
      //     "siti@gmail.com",
      //     "Auditor Internal",
      //     "081234567803",
      //     "Audit,Evaluasi,Validasi Data,Pelaporan",
      //     6,
      //   ],

      //   [
      //     "Rina Putri",
      //     "rina@gmail.com",
      //     "Staf Administrasi",
      //     "081234567804",
      //     "Administrasi,Pelaporan,Verifikasi Dokumen,Validasi Data",
      //     6,
      //   ],

      //   [
      //     "Dika Pratama",
      //     "dika@gmail.com",
      //     "Staf Monitoring",
      //     "081234567805",
      //     "Monitoring,Analisis Data,Excel,Evaluasi",
      //     6,
      //   ],

      //   [
      //     "Yoga Prakoso",
      //     "yoga@gmail.com",
      //     "Quality Assurance",
      //     "081234567806",
      //     "Audit,Validasi Data,Evaluasi,Monitoring",
      //     6,
      //   ],

      //   [
      //     "Fajar Nugroho",
      //     "fajar@gmail.com",
      //     "Staf Gudang",
      //     "081234567807",
      //     "Monitoring,Verifikasi Dokumen,Pelaporan,Excel",
      //     6,
      //   ],

      //   [
      //     "Nina Maharani",
      //     "nina@gmail.com",
      //     "Inventory Controller",
      //     "081234567808",
      //     "Analisis Data,Excel,Validasi Data,Monitoring",
      //     6,
      //   ],

      //   [
      //     "Rizki Hidayat",
      //     "rizki@gmail.com",
      //     "Planner Operasional",
      //     "081234567809",
      //     "Koordinasi Tim,Monitoring,Pelaporan,Evaluasi",
      //     6,
      //   ],

      //   [
      //     "Maya Sari",
      //     "maya@gmail.com",
      //     "Reporting Officer",
      //     "081234567810",
      //     "Pelaporan,Excel,Analisis Data,Validasi Data",
      //     6,
      //   ],

      //   [
      //     "Agus Setiawan",
      //     "agus@gmail.com",
      //     "Data Analyst",
      //     "081234567811",
      //     "Analisis Data,Excel,Monitoring,Evaluasi",
      //     6,
      //   ],

      //   [
      //     "Putri Lestari",
      //     "putri@gmail.com",
      //     "Document Controller",
      //     "081234567812",
      //     "Verifikasi Dokumen,Validasi Data,Pelaporan,Administrasi",
      //     6,
      //   ],

      //   [
      //     "Rendy Saputra",
      //     "rendy@gmail.com",
      //     "Compliance Officer",
      //     "081234567813",
      //     "Audit,Evaluasi,Verifikasi Dokumen,Koordinasi Tim",
      //     6,
      //   ],

      //   [
      //     "Farhan Ramadhan",
      //     "farhan@gmail.com",
      //     "Project Administrator",
      //     "081234567814",
      //     "Koordinasi Tim,Pelaporan,Verifikasi Dokumen,Monitoring",
      //     6,
      //   ],

      //   [
      //     "Intan Permata",
      //     "intan@gmail.com",
      //     "Finance Support",
      //     "081234567815",
      //     "Validasi Data,Excel,Analisis Data,Pelaporan",
      //     6,
      //   ],

      //   [
      //     "Aldi Firmansyah",
      //     "aldi@gmail.com",
      //     "Purchasing Staff",
      //     "081234567816",
      //     "Verifikasi Dokumen,Monitoring,Evaluasi,Koordinasi Tim",
      //     6,
      //   ],

      //   [
      //     "Riska Amelia",
      //     "riska@gmail.com",
      //     "Customer Service Internal",
      //     "081234567817",
      //     "Pelaporan,Koordinasi Tim,Monitoring,Evaluasi",
      //     6,
      //   ],

      //   [
      //     "Bagas Pratama",
      //     "bagas@gmail.com",
      //     "Maintenance Coordinator",
      //     "081234567818",
      //     "Monitoring,Evaluasi,Koordinasi Tim,Analisis Data",
      //     6,
      //   ],

      //   [
      //     "Naufal Akbar",
      //     "naufal@gmail.com",
      //     "Staf Logistik",
      //     "081234567819",
      //     "Monitoring,Pelaporan,Verifikasi Dokumen,Validasi Data",
      //     6,
      //   ],

      //   [
      //     "Dewi Anggraini",
      //     "dewi@gmail.com",
      //     "HR Operasional",
      //     "081234567820",
      //     "Evaluasi,Pelaporan,Koordinasi Tim,Validasi Data",
      //     6,
      //   ],
      // ];

      // alur alternative
      [
        "Budi Santoso",
        "budi@gmail.com",
        "Supervisor Operasional",
        "081234567801",
        "Pengawasan,Evaluasi,Penjadwalan",
        5,
      ],

      [
        "Andi Saputra",
        "andi@gmail.com",
        "Koordinator Operasional",
        "081234567802",
        "Koordinasi Tim,Monitoring,Pelaporan",
        5,
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
        "Staf Administrasi",
        "081234567804",
        "Administrasi,Dokumentasi,Pelaporan",
        5,
      ],

      [
        "Dika Pratama",
        "dika@gmail.com",
        "Staf Monitoring",
        "081234567805",
        "Monitoring,Analisis Data,Excel",
        5,
      ],

      [
        "Yoga Prakoso",
        "yoga@gmail.com",
        "Quality Assurance",
        "081234567806",
        "Audit,Validasi Data,Evaluasi",
        5,
      ],

      [
        "Fajar Nugroho",
        "fajar@gmail.com",
        "Staf Gudang",
        "081234567807",
        "Inventori,Administrasi,Monitoring",
        5,
      ],

      [
        "Nina Maharani",
        "nina@gmail.com",
        "Inventory Controller",
        "081234567808",
        "Inventori,Excel,Analisis Data",
        5,
      ],

      [
        "Rizki Hidayat",
        "rizki@gmail.com",
        "Planner Operasional",
        "081234567809",
        "Penjadwalan,Monitoring,Evaluasi",
        5,
      ],

      [
        "Maya Sari",
        "maya@gmail.com",
        "Reporting Officer",
        "081234567810",
        "Pelaporan,Excel,Administrasi",
        5,
      ],

      [
        "Agus Setiawan",
        "agus@gmail.com",
        "Data Analyst",
        "081234567811",
        "Analisis Data,Excel,Monitoring",
        5,
      ],

      [
        "Putri Lestari",
        "putri@gmail.com",
        "Document Controller",
        "081234567812",
        "Dokumentasi,Administrasi,Verifikasi Dokumen",
        5,
      ],

      [
        "Rendy Saputra",
        "rendy@gmail.com",
        "Compliance Officer",
        "081234567813",
        "Audit,Kepatuhan,Evaluasi",
        5,
      ],

      [
        "Farhan Ramadhan",
        "farhan@gmail.com",
        "Project Administrator",
        "081234567814",
        "Administrasi,Pelaporan,Koordinasi Tim",
        5,
      ],

      [
        "Intan Permata",
        "intan@gmail.com",
        "Finance Support",
        "081234567815",
        "Validasi Data,Administrasi,Excel",
        5,
      ],

      [
        "Aldi Firmansyah",
        "aldi@gmail.com",
        "Purchasing Staff",
        "081234567816",
        "Administrasi,Verifikasi Dokumen,Monitoring",
        5,
      ],

      [
        "Riska Amelia",
        "riska@gmail.com",
        "Customer Service Internal",
        "081234567817",
        "Pelaporan,Administrasi,Koordinasi Tim",
        5,
      ],

      [
        "Bagas Pratama",
        "bagas@gmail.com",
        "Maintenance Coordinator",
        "081234567818",
        "Monitoring,Evaluasi,Koordinasi Tim",
        5,
      ],

      [
        "Naufal Akbar",
        "naufal@gmail.com",
        "Staf Logistik",
        "081234567819",
        "Distribusi,Monitoring,Administrasi",
        5,
      ],

      [
        "Dewi Anggraini",
        "dewi@gmail.com",
        "HR Operasional",
        "081234567820",
        "Administrasi,Pelaporan,Evaluasi",
        5,
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
    console.log("Menambahkan 120 tugas...");

    const tugasData = [
      [
        "Penyusunan Laporan Operasional Mingguan",
        "Menyusun laporan operasional minggu pertama Juli.",
        "Tinggi",
        "Pelaporan",
        "2026-09-01",
        "4 Jam",
      ],

      [
        "Audit Dokumen Cabang Barat",
        "Melakukan audit dokumen operasional cabang barat.",
        "Tinggi",
        "Audit",
        "2026-09-01",
        "5 Jam",
      ],

      [
        "Monitoring Distribusi Wilayah Timur",
        "Monitoring pengiriman wilayah timur.",
        "Tinggi",
        "Monitoring",
        "2026-09-01",
        "4 Jam",
      ],

      [
        "Verifikasi Dokumen Vendor A",
        "Verifikasi kontrak dan dokumen vendor.",
        "Tinggi",
        "Verifikasi Dokumen",
        "2026-09-02",
        "3 Jam",
      ],

      [
        "Analisis Produktivitas Gudang",
        "Analisis produktivitas gudang pusat.",
        "Sedang",
        "Analisis Data",
        "2026-09-02",
        "5 Jam",
      ],

      [
        "Penyusunan Rekap KPI Divisi",
        "Menyusun rekap KPI seluruh divisi.",
        "Tinggi",
        "Excel",
        "2026-09-02",
        "4 Jam",
      ],

      [
        "Validasi Data Persediaan",
        "Validasi stok gudang pusat.",
        "Sedang",
        "Validasi Data",
        "2026-09-03",
        "3 Jam",
      ],

      [
        "Koordinasi Persiapan Audit",
        "Koordinasi audit internal.",
        "Sedang",
        "Koordinasi Tim",
        "2026-09-03",
        "4 Jam",
      ],

      [
        "Pembuatan Laporan Pengiriman",
        "Menyusun laporan distribusi harian.",
        "Tinggi",
        "Pelaporan",
        "2026-09-03",
        "3 Jam",
      ],

      [
        "Evaluasi SLA Pengiriman",
        "Evaluasi pencapaian SLA pengiriman.",
        "Sedang",
        "Evaluasi",
        "2026-09-04",
        "4 Jam",
      ],

      [
        "Monitoring Cabang Utara",
        "Monitoring aktivitas cabang utara.",
        "Sedang",
        "Monitoring",
        "2026-09-04",
        "4 Jam",
      ],

      [
        "Audit Kepatuhan SOP Gudang",
        "Audit SOP gudang pusat.",
        "Tinggi",
        "Audit",
        "2026-09-04",
        "6 Jam",
      ],

      [
        "Penyusunan Laporan Bulanan Divisi Logistik",
        "Laporan performa logistik.",
        "Tinggi",
        "Pelaporan",
        "2026-09-05",
        "5 Jam",
      ],

      [
        "Analisis Kinerja Pengiriman",
        "Analisis performa distribusi.",
        "Sedang",
        "Analisis Data",
        "2026-09-05",
        "5 Jam",
      ],

      [
        "Verifikasi Berkas Purchasing",
        "Pemeriksaan dokumen pembelian.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-09-05",
        "3 Jam",
      ],

      [
        "Monitoring Vendor Logistik",
        "Monitoring vendor eksternal.",
        "Sedang",
        "Monitoring",
        "2026-09-06",
        "4 Jam",
      ],

      [
        "Penyusunan Dashboard Excel",
        "Menyusun dashboard operasional.",
        "Sedang",
        "Excel",
        "2026-09-06",
        "5 Jam",
      ],

      [
        "Evaluasi Efektivitas Distribusi",
        "Evaluasi distribusi nasional.",
        "Tinggi",
        "Evaluasi",
        "2026-09-06",
        "5 Jam",
      ],

      [
        "Koordinasi Tim Audit",
        "Koordinasi jadwal audit.",
        "Sedang",
        "Koordinasi Tim",
        "2026-09-07",
        "4 Jam",
      ],

      [
        "Validasi Data Cabang Selatan",
        "Validasi data operasional.",
        "Sedang",
        "Validasi Data",
        "2026-09-07",
        "3 Jam",
      ],

      [
        "Monitoring Stok Gudang",
        "Monitoring persediaan gudang.",
        "Sedang",
        "Monitoring",
        "2026-09-07",
        "4 Jam",
      ],

      [
        "Penyusunan Rekap Distribusi",
        "Rekap distribusi mingguan.",
        "Sedang",
        "Pelaporan",
        "2026-09-08",
        "4 Jam",
      ],

      [
        "Audit Dokumen Keuangan",
        "Audit administrasi keuangan.",
        "Tinggi",
        "Audit",
        "2026-09-08",
        "6 Jam",
      ],

      [
        "Analisis Kinerja Cabang",
        "Analisis performa cabang.",
        "Sedang",
        "Analisis Data",
        "2026-09-08",
        "5 Jam",
      ],

      [
        "Verifikasi Dokumen Proyek",
        "Pemeriksaan dokumen proyek.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-09-09",
        "3 Jam",
      ],

      [
        "Penyusunan Laporan Audit",
        "Menyusun hasil audit.",
        "Tinggi",
        "Pelaporan",
        "2026-09-09",
        "5 Jam",
      ],

      [
        "Monitoring Pengiriman Ekspor",
        "Monitoring ekspor nasional.",
        "Tinggi",
        "Monitoring",
        "2026-09-09",
        "5 Jam",
      ],

      [
        "Evaluasi Vendor",
        "Evaluasi vendor utama.",
        "Sedang",
        "Evaluasi",
        "2026-09-10",
        "4 Jam",
      ],

      [
        "Koordinasi Penyelesaian Temuan",
        "Koordinasi hasil audit.",
        "Sedang",
        "Koordinasi Tim",
        "2026-09-10",
        "4 Jam",
      ],

      [
        "Validasi Master Data",
        "Validasi master data perusahaan.",
        "Sedang",
        "Validasi Data",
        "2026-09-10",
        "3 Jam",
      ],

      [
        "Monitoring Cabang Timur",
        "Monitoring operasional cabang.",
        "Sedang",
        "Monitoring",
        "2026-09-11",
        "4 Jam",
      ],

      [
        "Pembuatan Laporan Evaluasi",
        "Menyusun laporan evaluasi.",
        "Tinggi",
        "Pelaporan",
        "2026-09-11",
        "5 Jam",
      ],

      [
        "Audit Persediaan Gudang",
        "Audit stok gudang.",
        "Tinggi",
        "Audit",
        "2026-09-11",
        "6 Jam",
      ],

      [
        "Analisis SLA Cabang",
        "Analisis SLA cabang.",
        "Sedang",
        "Analisis Data",
        "2026-09-12",
        "5 Jam",
      ],

      [
        "Verifikasi Dokumen Pengadaan",
        "Verifikasi administrasi pengadaan.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-09-12",
        "3 Jam",
      ],

      [
        "Monitoring Kinerja Vendor",
        "Monitoring vendor nasional.",
        "Sedang",
        "Monitoring",
        "2026-09-12",
        "4 Jam",
      ],

      [
        "Penyusunan Dashboard Kinerja",
        "Dashboard performa bulanan.",
        "Tinggi",
        "Excel",
        "2026-09-13",
        "5 Jam",
      ],

      [
        "Evaluasi Efektivitas Tim",
        "Evaluasi tim operasional.",
        "Sedang",
        "Evaluasi",
        "2026-09-13",
        "4 Jam",
      ],

      [
        "Koordinasi Penutupan Proyek",
        "Koordinasi penyelesaian proyek.",
        "Tinggi",
        "Koordinasi Tim",
        "2026-09-13",
        "5 Jam",
      ],

      [
        "Penyusunan Rekap Operasional Nasional",
        "Rekap seluruh aktivitas operasional.",
        "Tinggi",
        "Pelaporan",
        "2026-09-14",
        "6 Jam",
      ],
      [
        "Audit Kepatuhan Administrasi Cabang",
        "Audit administrasi operasional cabang regional.",
        "Tinggi",
        "Audit",
        "2026-09-14",
        "5 Jam",
      ],

      [
        "Monitoring Distribusi Wilayah Barat",
        "Monitoring pengiriman wilayah barat.",
        "Sedang",
        "Monitoring",
        "2026-09-14",
        "4 Jam",
      ],

      [
        "Analisis Efisiensi Gudang",
        "Analisis efisiensi penggunaan gudang.",
        "Sedang",
        "Analisis Data",
        "2026-09-15",
        "5 Jam",
      ],

      [
        "Penyusunan Rekap Audit Internal",
        "Menyusun rekap hasil audit internal.",
        "Tinggi",
        "Pelaporan",
        "2026-09-15",
        "4 Jam",
      ],

      [
        "Verifikasi Dokumen Kontrak Vendor",
        "Pemeriksaan dokumen kontrak vendor.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-09-15",
        "3 Jam",
      ],

      [
        "Monitoring Implementasi SOP",
        "Monitoring implementasi SOP operasional.",
        "Sedang",
        "Monitoring",
        "2026-09-16",
        "4 Jam",
      ],

      [
        "Evaluasi Efektivitas Audit",
        "Evaluasi hasil audit semester.",
        "Tinggi",
        "Evaluasi",
        "2026-09-16",
        "5 Jam",
      ],

      [
        "Analisis Waktu Distribusi",
        "Analisis rata-rata waktu distribusi barang.",
        "Sedang",
        "Analisis Data",
        "2026-09-16",
        "4 Jam",
      ],

      [
        "Pembuatan Dashboard Audit",
        "Dashboard monitoring audit perusahaan.",
        "Sedang",
        "Excel",
        "2026-09-17",
        "5 Jam",
      ],

      [
        "Koordinasi Meeting Operasional",
        "Koordinasi meeting evaluasi mingguan.",
        "Sedang",
        "Koordinasi Tim",
        "2026-09-17",
        "3 Jam",
      ],

      [
        "Validasi Dokumen Pengiriman Nasional",
        "Validasi dokumen seluruh cabang.",
        "Sedang",
        "Validasi Data",
        "2026-09-17",
        "3 Jam",
      ],

      [
        "Audit Persediaan Regional Timur",
        "Audit stok cabang regional timur.",
        "Tinggi",
        "Audit",
        "2026-09-18",
        "6 Jam",
      ],

      [
        "Monitoring SLA Vendor",
        "Monitoring SLA vendor logistik.",
        "Sedang",
        "Monitoring",
        "2026-09-18",
        "4 Jam",
      ],

      [
        "Analisis Produktivitas Cabang",
        "Analisis produktivitas seluruh cabang.",
        "Sedang",
        "Analisis Data",
        "2026-09-18",
        "5 Jam",
      ],

      [
        "Penyusunan Rekap Pengiriman Nasional",
        "Rekap pengiriman seluruh Indonesia.",
        "Tinggi",
        "Pelaporan",
        "2026-09-19",
        "5 Jam",
      ],

      [
        "Verifikasi Data Purchase Order",
        "Verifikasi data purchase order.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-09-19",
        "3 Jam",
      ],

      [
        "Evaluasi Efektivitas Gudang",
        "Evaluasi penggunaan gudang.",
        "Sedang",
        "Evaluasi",
        "2026-09-19",
        "4 Jam",
      ],

      [
        "Monitoring Cabang Sumatera",
        "Monitoring aktivitas cabang Sumatera.",
        "Sedang",
        "Monitoring",
        "2026-09-20",
        "4 Jam",
      ],

      [
        "Analisis Persediaan Bulanan",
        "Analisis persediaan bulan Juli.",
        "Sedang",
        "Analisis Data",
        "2026-09-20",
        "5 Jam",
      ],

      [
        "Penyusunan Laporan Audit Gudang",
        "Laporan hasil audit gudang.",
        "Tinggi",
        "Pelaporan",
        "2026-09-20",
        "5 Jam",
      ],

      [
        "Koordinasi Penyelesaian Vendor",
        "Koordinasi penyelesaian vendor.",
        "Sedang",
        "Koordinasi Tim",
        "2026-09-21",
        "4 Jam",
      ],

      [
        "Monitoring Pengiriman Prioritas",
        "Monitoring pengiriman prioritas nasional.",
        "Tinggi",
        "Monitoring",
        "2026-09-21",
        "5 Jam",
      ],

      [
        "Audit Kepatuhan Dokumen",
        "Audit kepatuhan dokumen operasional.",
        "Tinggi",
        "Audit",
        "2026-09-21",
        "6 Jam",
      ],

      [
        "Verifikasi Data Cabang Jawa",
        "Validasi data operasional Jawa.",
        "Sedang",
        "Validasi Data",
        "2026-09-22",
        "3 Jam",
      ],

      [
        "Analisis Efektivitas SDM",
        "Analisis produktivitas SDM operasional.",
        "Sedang",
        "Analisis Data",
        "2026-09-22",
        "5 Jam",
      ],

      [
        "Penyusunan Dashboard Monitoring",
        "Dashboard monitoring operasional.",
        "Sedang",
        "Excel",
        "2026-09-22",
        "4 Jam",
      ],

      [
        "Monitoring KPI Cabang",
        "Monitoring KPI seluruh cabang.",
        "Sedang",
        "Monitoring",
        "2026-09-23",
        "4 Jam",
      ],

      [
        "Evaluasi Distribusi Nasional",
        "Evaluasi distribusi nasional.",
        "Tinggi",
        "Evaluasi",
        "2026-09-23",
        "5 Jam",
      ],

      [
        "Koordinasi Persiapan Presentasi",
        "Koordinasi presentasi bulanan.",
        "Sedang",
        "Koordinasi Tim",
        "2026-09-23",
        "3 Jam",
      ],

      [
        "Verifikasi Dokumen Pengadaan Barang",
        "Pemeriksaan dokumen pengadaan.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-09-24",
        "3 Jam",
      ],

      [
        "Audit Operasional Cabang Selatan",
        "Audit operasional cabang selatan.",
        "Tinggi",
        "Audit",
        "2026-09-24",
        "6 Jam",
      ],

      [
        "Monitoring Persediaan Regional",
        "Monitoring persediaan regional.",
        "Sedang",
        "Monitoring",
        "2026-09-24",
        "4 Jam",
      ],

      [
        "Penyusunan Rekap KPI Semester",
        "Rekap KPI semester pertama.",
        "Tinggi",
        "Pelaporan",
        "2026-09-25",
        "5 Jam",
      ],

      [
        "Analisis Efektivitas Vendor",
        "Analisis efektivitas vendor logistik.",
        "Sedang",
        "Analisis Data",
        "2026-09-25",
        "5 Jam",
      ],

      [
        "Validasi Data Pengiriman Ekspor",
        "Validasi data ekspor.",
        "Sedang",
        "Validasi Data",
        "2026-09-25",
        "3 Jam",
      ],

      [
        "Monitoring Distribusi Nasional",
        "Monitoring distribusi nasional.",
        "Tinggi",
        "Monitoring",
        "2026-09-26",
        "5 Jam",
      ],

      [
        "Evaluasi SLA Cabang",
        "Evaluasi SLA seluruh cabang.",
        "Sedang",
        "Evaluasi",
        "2026-09-26",
        "4 Jam",
      ],

      [
        "Pembuatan Dashboard Produktivitas",
        "Dashboard produktivitas operasional.",
        "Sedang",
        "Excel",
        "2026-09-26",
        "5 Jam",
      ],

      [
        "Koordinasi Penyelesaian Audit",
        "Koordinasi tindak lanjut audit.",
        "Tinggi",
        "Koordinasi Tim",
        "2026-09-27",
        "5 Jam",
      ],

      [
        "Penyusunan Laporan Akhir Bulan",
        "Laporan operasional akhir bulan.",
        "Tinggi",
        "Pelaporan",
        "2026-09-27",
        "6 Jam",
      ],
      [
        "Audit Kepatuhan Cabang Barat",
        "Melakukan audit kepatuhan operasional cabang wilayah barat.",
        "Tinggi",
        "Audit",
        "2026-09-28",
        "6 Jam",
      ],

      [
        "Monitoring Realisasi KPI Bulanan",
        "Monitoring pencapaian KPI seluruh divisi.",
        "Tinggi",
        "Monitoring",
        "2026-09-28",
        "5 Jam",
      ],

      [
        "Analisis Efektivitas Distribusi Nasional",
        "Analisis efektivitas distribusi nasional.",
        "Sedang",
        "Analisis Data",
        "2026-09-28",
        "5 Jam",
      ],

      [
        "Penyusunan Laporan Monitoring Bulanan",
        "Menyusun laporan monitoring operasional.",
        "Tinggi",
        "Pelaporan",
        "2026-09-29",
        "5 Jam",
      ],

      [
        "Validasi Data Pengiriman Cabang Timur",
        "Memastikan data pengiriman cabang timur sesuai.",
        "Sedang",
        "Validasi Data",
        "2026-09-29",
        "3 Jam",
      ],

      [
        "Verifikasi Dokumen Pembelian",
        "Memverifikasi dokumen pembelian barang.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-09-29",
        "3 Jam",
      ],

      [
        "Evaluasi Efektivitas Operasional Cabang",
        "Evaluasi efektivitas operasional cabang.",
        "Sedang",
        "Evaluasi",
        "2026-09-30",
        "5 Jam",
      ],

      [
        "Monitoring Persediaan Gudang Pusat",
        "Monitoring persediaan gudang pusat.",
        "Sedang",
        "Monitoring",
        "2026-09-30",
        "4 Jam",
      ],

      [
        "Analisis Risiko Operasional",
        "Analisis risiko operasional perusahaan.",
        "Tinggi",
        "Analisis Data",
        "2026-09-30",
        "6 Jam",
      ],

      [
        "Penyusunan Rekap Evaluasi Bulanan",
        "Menyusun rekap evaluasi bulanan.",
        "Tinggi",
        "Pelaporan",
        "2026-09-30",
        "5 Jam",
      ],

      [
        "Koordinasi Perbaikan SOP",
        "Koordinasi revisi SOP operasional.",
        "Sedang",
        "Koordinasi Tim",
        "2026-09-30",
        "4 Jam",
      ],

      [
        "Audit Pengelolaan Dokumen",
        "Audit pengelolaan dokumen perusahaan.",
        "Tinggi",
        "Audit",
        "2026-09-30",
        "5 Jam",
      ],

      [
        "Monitoring Target Pengiriman",
        "Monitoring pencapaian target pengiriman.",
        "Sedang",
        "Monitoring",
        "2026-09-01",
        "4 Jam",
      ],

      [
        "Analisis Produktivitas Gudang",
        "Analisis produktivitas gudang pusat.",
        "Sedang",
        "Analisis Data",
        "2026-09-01",
        "5 Jam",
      ],

      [
        "Penyusunan Dashboard KPI Operasional",
        "Dashboard KPI operasional bulanan.",
        "Sedang",
        "Excel",
        "2026-09-01",
        "4 Jam",
      ],

      [
        "Validasi Data Audit Internal",
        "Validasi hasil audit internal.",
        "Sedang",
        "Validasi Data",
        "2026-09-02",
        "3 Jam",
      ],

      [
        "Evaluasi Kinerja Vendor",
        "Evaluasi performa vendor logistik.",
        "Tinggi",
        "Evaluasi",
        "2026-09-02",
        "5 Jam",
      ],

      [
        "Monitoring SLA Cabang Regional",
        "Monitoring SLA cabang regional.",
        "Sedang",
        "Monitoring",
        "2026-09-02",
        "4 Jam",
      ],

      [
        "Audit Pengiriman Barang Prioritas",
        "Audit proses pengiriman prioritas.",
        "Tinggi",
        "Audit",
        "2026-09-03",
        "6 Jam",
      ],

      [
        "Penyusunan Rekap Monitoring Nasional",
        "Rekap monitoring nasional.",
        "Tinggi",
        "Pelaporan",
        "2026-09-03",
        "5 Jam",
      ],

      [
        "Analisis Efektivitas Cabang Regional",
        "Analisis efektivitas cabang regional.",
        "Sedang",
        "Analisis Data",
        "2026-09-03",
        "5 Jam",
      ],

      [
        "Koordinasi Evaluasi Vendor",
        "Koordinasi evaluasi vendor logistik.",
        "Sedang",
        "Koordinasi Tim",
        "2026-09-04",
        "4 Jam",
      ],

      [
        "Monitoring Target Audit",
        "Monitoring penyelesaian target audit.",
        "Sedang",
        "Monitoring",
        "2026-09-04",
        "4 Jam",
      ],

      [
        "Verifikasi Laporan Cabang",
        "Verifikasi laporan operasional cabang.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-09-04",
        "3 Jam",
      ],

      [
        "Evaluasi Produktivitas Operasional",
        "Evaluasi produktivitas operasional bulanan.",
        "Tinggi",
        "Evaluasi",
        "2026-09-05",
        "5 Jam",
      ],

      [
        "Audit Persediaan Gudang Pusat",
        "Audit persediaan gudang pusat.",
        "Tinggi",
        "Audit",
        "2026-09-05",
        "6 Jam",
      ],

      [
        "Monitoring Implementasi Perbaikan",
        "Monitoring implementasi hasil evaluasi.",
        "Sedang",
        "Monitoring",
        "2026-09-05",
        "4 Jam",
      ],

      [
        "Analisis Beban Kerja Divisi",
        "Analisis pemerataan beban kerja divisi.",
        "Sedang",
        "Analisis Data",
        "2026-09-06",
        "5 Jam",
      ],

      [
        "Penyusunan Laporan Akhir Evaluasi",
        "Laporan akhir evaluasi operasional.",
        "Tinggi",
        "Pelaporan",
        "2026-09-06",
        "5 Jam",
      ],

      [
        "Validasi Data Monitoring",
        "Validasi data monitoring operasional.",
        "Sedang",
        "Validasi Data",
        "2026-09-06",
        "3 Jam",
      ],

      [
        "Koordinasi Penyelesaian Temuan Audit",
        "Koordinasi penyelesaian temuan audit.",
        "Tinggi",
        "Koordinasi Tim",
        "2026-09-07",
        "5 Jam",
      ],

      [
        "Monitoring Kinerja Cabang Nasional",
        "Monitoring kinerja seluruh cabang.",
        "Tinggi",
        "Monitoring",
        "2026-09-07",
        "5 Jam",
      ],

      [
        "Audit Kepatuhan Akhir Periode",
        "Audit kepatuhan akhir periode operasional.",
        "Tinggi",
        "Audit",
        "2026-09-07",
        "6 Jam",
      ],

      [
        "Analisis Kinerja Distribusi Nasional",
        "Analisis kinerja distribusi nasional.",
        "Sedang",
        "Analisis Data",
        "2026-09-08",
        "5 Jam",
      ],

      [
        "Penyusunan Laporan Operasional Nasional",
        "Penyusunan laporan operasional nasional.",
        "Tinggi",
        "Pelaporan",
        "2026-09-08",
        "6 Jam",
      ],

      [
        "Evaluasi Pencapaian Target Operasional",
        "Evaluasi pencapaian target operasional perusahaan.",
        "Tinggi",
        "Evaluasi",
        "2026-09-08",
        "5 Jam",
      ],

      [
        "Monitoring Penyelesaian Seluruh Tugas",
        "Monitoring penyelesaian seluruh tugas operasional.",
        "Sedang",
        "Monitoring",
        "2026-09-09",
        "4 Jam",
      ],

      [
        "Verifikasi Dokumen Laporan Nasional",
        "Verifikasi dokumen laporan nasional.",
        "Sedang",
        "Verifikasi Dokumen",
        "2026-09-09",
        "3 Jam",
      ],

      [
        "Penyusunan Rekap Operasional Akhir Periode",
        "Rekap operasional akhir periode.",
        "Tinggi",
        "Pelaporan",
        "2026-09-09",
        "5 Jam",
      ],

      [
        "Analisis Hasil Evaluasi Operasional",
        "Analisis hasil evaluasi operasional perusahaan.",
        "Tinggi",
        "Analisis Data",
        "2026-09-10",
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
