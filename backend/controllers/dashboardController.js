const db = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const [
      [[karyawan]],
      [[tugas]],
      [[jadwal]],
      [[selesai]],
      [statusTugas],
      [[rendah]],
      [[sedang]],
      [[tinggi]],
      [topBeban],
    ] = await Promise.all([
      db.query(`
        SELECT COUNT(*) AS total_karyawan
        FROM karyawan
      `),

      db.query(`
        SELECT COUNT(*) AS total_tugas
        FROM tugas
      `),

      db.query(`
        SELECT COUNT(*) AS total_jadwal
        FROM jadwal
      `),

      db.query(`
        SELECT COUNT(*) AS tugas_selesai
        FROM jadwal
        WHERE status_tugas = 'Selesai'
      `),

      db.query(`
        SELECT
          status_tugas,
          COUNT(*) AS total
        FROM jadwal
        GROUP BY status_tugas
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM (
          SELECT *
          FROM riwayat_beban rb
          WHERE rb.id_riwayat_beban = (
            SELECT MAX(r2.id_riwayat_beban)
            FROM riwayat_beban r2
            WHERE r2.id_karyawan = rb.id_karyawan
          )
        ) x
        WHERE nilai_beban <= 2
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM (
          SELECT *
          FROM riwayat_beban rb
          WHERE rb.id_riwayat_beban = (
            SELECT MAX(r2.id_riwayat_beban)
            FROM riwayat_beban r2
            WHERE r2.id_karyawan = rb.id_karyawan
          )
        ) x
        WHERE nilai_beban = 3
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM (
          SELECT *
          FROM riwayat_beban rb
          WHERE rb.id_riwayat_beban = (
            SELECT MAX(r2.id_riwayat_beban)
            FROM riwayat_beban r2
            WHERE r2.id_karyawan = rb.id_karyawan
          )
        ) x
        WHERE nilai_beban >= 4
      `),

      db.query(`
        SELECT
          k.nama_karyawan,
          rb.nilai_beban,
          rb.tugas_aktif
        FROM riwayat_beban rb
        JOIN karyawan k
          ON rb.id_karyawan = k.id_karyawan
        WHERE rb.id_riwayat_beban = (
          SELECT MAX(r2.id_riwayat_beban)
          FROM riwayat_beban r2
          WHERE r2.id_karyawan = rb.id_karyawan
        )
        ORDER BY rb.nilai_beban DESC
        LIMIT 5
      `),
    ]);

    res.status(200).json({
      statistik: {
        total_karyawan: karyawan.total_karyawan,
        total_tugas: tugas.total_tugas,
        total_jadwal: jadwal.total_jadwal,
        tugas_selesai: selesai.tugas_selesai,
      },

      status_tugas: statusTugas,

      beban_kerja: {
        rendah: rendah.total,
        sedang: sedang.total,
        tinggi: tinggi.total,
      },

      top_beban: topBeban,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};
