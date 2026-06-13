const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/karyawan", karyawanRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend Penjadwalan Tugas Berjalan",
  });
});

const jwt = require("jsonwebtoken");

module.exports = app;
