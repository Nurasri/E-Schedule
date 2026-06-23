const db = require("../config/db");

const getRiwayatBeban = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT
                rb.id_riwayat_beban,
                k.id_karyawan,
                k.nama_karyawan,
                rb.total_tugas,
                rb.tugas_selesai,
                rb.tugas_aktif,
                rb.nilai_beban,
                rb.tanggal_update
            FROM riwayat_beban rb
            JOIN karyawan k
                ON rb.id_karyawan = k.id_karyawan
            ORDER BY rb.tanggal_update DESC
            `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getRiwayatBeban,
};
