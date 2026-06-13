const db = require("../config/db");
const bcrypt = require("bcrypt");

const registerAdmin = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    const [existing] = await db.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO admin (nama, email, password)
            VALUES (?, ?, ?)`,
      [nama, email, hashedPassword],
    );

    res.status(201).json({
      message: "Admin berhasil dibuat",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cek admin
    let [users] = await db.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

    let role = "admin";

    // jika tidak ada di admin, cek karyawan
    if (users.length === 0) {
      [users] = await db.query("SELECT * FROM karyawan WHERE email = ?", [
        email,
      ]);

      role = "karyawan";
    }

    if (users.length === 0) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(
      {
        id: role === "admin" ? user.id_admin : user.id_karyawan,
        role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login berhasil",
      token,
      role,
      nama: role === "admin" ? user.nama : user.nama_karyawan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const [rows] = await db.query(
        "SELECT id_admin, nama, email FROM admin WHERE id_admin = ?",
        [req.user.id],
      );

      return res.json(rows[0]);
    }

    const [rows] = await db.query(
      `SELECT
         id_karyawan,
         nama_karyawan,
         email,
         jabatan
       FROM karyawan
       WHERE id_karyawan = ?`,
      [req.user.id],
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  login,
  getProfile,
};
