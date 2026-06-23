const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");
const tugasRoutes = require("./routes/tugasRoutes");
const jadwalRoutes = require("./routes/jadwalRoutes");
const riwayatBebanRoutes = require("./routes/riwayatBebanRoutes");
const generateRoutes = require("./routes/generateRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/karyawan", karyawanRoutes);
app.use("/tugas", tugasRoutes);
app.use("/jadwal", jadwalRoutes);
app.use("/riwayat-beban", riwayatBebanRoutes);
app.use("/jadwal", generateRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend Penjadwalan Tugas Berjalan",
  });
});

const jwt = require("jsonwebtoken");

module.exports = app;
