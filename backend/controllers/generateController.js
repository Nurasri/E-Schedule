const db = require("../config/db");
const { processBacktracking } = require("../services/backtrackingService");

/*
=================================================
GENERATE JADWAL OTOMATIS
Greedy + Backtracking
=================================================

Alur:
1. Greedy menghasilkan solusi awal.
2. Backtracking memvalidasi constraint.
3. Backtracking mencari alternatif jika diperlukan.
4. Jadwal valid disimpan ke database.
*/

async function generateSchedule(req, res) {
  try {
    // ==========================
    // CEK KARYAWAN TERSEDIA
    // ==========================

    const [karyawan] = await db.query(`
  SELECT *
  FROM karyawan
  WHERE status_ketersediaan = 'Tersedia'
`);

    if (karyawan.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada karyawan tersedia",
      });
    }

    // ==========================
    // CEK TUGAS BELUM DIJADWALKAN
    // ==========================

    const [tugas] = await db.query(`
  SELECT t.*
  FROM tugas t
  LEFT JOIN jadwal j
    ON t.id_tugas = j.id_tugas
  WHERE j.id_tugas IS NULL
`);

    if (tugas.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Semua tugas sudah dijadwalkan",
      });
    }

    // Proses Generate
    const hasil = await processBacktracking();

    return res.status(200).json({
      success: true,
      algoritma: "Greedy + Backtracking",
      message: "Generate jadwal berhasil",
      total_tugas: hasil.total_tugas,
      berhasil: hasil.berhasil,
      gagal: hasil.gagal,
      data: hasil.hasil,
    });
  } catch (error) {
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat generate jadwal",
      error: error.message,
    });
  }
}

module.exports = {
  generateSchedule,
};
