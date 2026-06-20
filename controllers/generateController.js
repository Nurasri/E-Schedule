const { generateGreedySchedule } = require("../services/greedyService");

const { processBacktracking } = require("../services/backtrackingService");

/*
=================================================
PREVIEW GREEDY
Tidak menyimpan ke database
=================================================
*/

async function generateGreedy(req, res) {
  try {
    const hasil = await generateGreedySchedule();

    return res.status(200).json({
      success: true,
      algoritma: "Greedy",
      message: "Generate preview Greedy berhasil",
      total_tugas: hasil.total_tugas,
      berhasil: hasil.berhasil,
      gagal: hasil.gagal,
      data: hasil.hasil,
    });
  } catch (error) {
    console.error("Generate Greedy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat generate Greedy",
      error: error.message,
    });
  }
}

/*
=================================================
GENERATE FINAL
Greedy + Backtracking
=================================================
*/

async function generateFinal(req, res) {
  try {
    const hasil = await processBacktracking();

    return res.status(200).json({
      success: true,
      algoritma: "Greedy + Backtracking",
      message: "Generate jadwal final berhasil",
      total_tugas: hasil.total_tugas,
      berhasil: hasil.berhasil,
      gagal: hasil.gagal,
      data: hasil.hasil,
    });
  } catch (error) {
    console.error("Generate Final Error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat generate final",
      error: error.message,
    });
  }
}

module.exports = {
  generateGreedy,
  generateFinal,
};
