const { generateGreedySchedule } = require("../services/greedyService");

const generateJadwal = async (req, res) => {
  try {
    const hasil = await generateGreedySchedule();

    res.json({
      message: "Generate jadwal Greedy berhasil",
      total: hasil.length,
      data: hasil,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  generateJadwal,
};
