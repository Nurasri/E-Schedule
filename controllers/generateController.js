const { generateGreedySchedule } = require("../services/greedyService");

async function generateSchedule(req, res) {
  try {
    const hasil = await generateGreedySchedule();

    return res.status(200).json({
      success: true,
      message: "Generate jadwal Greedy berhasil",
      total_tugas: hasil.total_tugas,
      berhasil: hasil.berhasil,
      gagal: hasil.gagal,
      data: hasil.hasil,
    });
  } catch (error) {
    console.error("Generate Greedy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat generate jadwal Greedy",
      error: error.message,
    });
  }
}

module.exports = {
  generateSchedule,
};
