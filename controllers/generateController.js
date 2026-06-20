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
