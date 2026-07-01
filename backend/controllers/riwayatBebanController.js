const db = require("../config/db");

/*
====================================================
GET ALL MONITORING KINERJA
====================================================
*/

const getRiwayatBeban = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
          k.id_karyawan,
          k.nama_karyawan,

          rb.total_tugas,
          rb.tugas_aktif,
          rb.tugas_selesai,
          rb.nilai_beban

      FROM riwayat_beban rb

      INNER JOIN karyawan k
          ON rb.id_karyawan = k.id_karyawan

      WHERE rb.id_riwayat_beban = (
          SELECT MAX(r2.id_riwayat_beban)
          FROM riwayat_beban r2
          WHERE r2.id_karyawan = rb.id_karyawan
      )

      ORDER BY k.nama_karyawan ASC
    `);

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
====================================================
GET MONITORING BERDASARKAN ID KARYAWAN
====================================================
*/

const getRiwayatBebanById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT

          j.id_jadwal,

          k.id_karyawan,
          k.nama_karyawan,

          t.id_tugas,
          t.nama_tugas,

          j.tanggal_tugas,
          j.jam_mulai,
          j.jam_selesai,

          j.status_tugas,

          CASE
              WHEN j.status_tugas='Belum Dikerjakan' THEN 0
              WHEN j.status_tugas='Proses' THEN 50
              WHEN j.status_tugas='Selesai' THEN 100
              WHEN j.status_tugas='Tertunda' THEN 25
          END AS progress,

          IFNULL(t.catatan_tugas,'-') AS catatan_tugas,

          rb.total_tugas,
          rb.tugas_selesai,
          rb.tugas_aktif,
          rb.nilai_beban

      FROM jadwal j

      INNER JOIN karyawan k
          ON j.id_karyawan=k.id_karyawan

      INNER JOIN tugas t
          ON j.id_tugas=t.id_tugas

      LEFT JOIN riwayat_beban rb
          ON rb.id_karyawan=k.id_karyawan

      WHERE
          k.id_karyawan=?

      AND rb.id_riwayat_beban=(
          SELECT MAX(r2.id_riwayat_beban)
          FROM riwayat_beban r2
          WHERE r2.id_karyawan=k.id_karyawan
      )

      ORDER BY
          j.tanggal_tugas ASC
      `,
      [id],
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getRiwayatBeban,
  getRiwayatBebanById,
};
