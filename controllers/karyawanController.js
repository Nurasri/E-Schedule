const db = require("../config/db");

const bcrypt = require("bcrypt");

// CREATE
const createKaryawan = async (req, res) => {
  try {
    const {
      nama_karyawan,
      email,
      password,
      jabatan,
      no_hp,
      skill,
      maksimal_tugas,
    } = req.body;
    const [existing] = await db.query(
      "SELECT * FROM karyawan WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO karyawan
            (
            nama_karyawan,
            email,
            password,
            jabatan,
            no_hp,
            skill,
            maksimal_tugas
        )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nama_karyawan,
        email,
        hashedPassword,
        jabatan,
        no_hp,
        skill,
        maksimal_tugas || 5,
      ],
    );

    res.status(201).json({
      message: "Karyawan berhasil ditambahkan",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL
const getAllKaryawan = async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT
            id_karyawan,
            nama_karyawan,
            email,
            jabatan,
            no_hp,
            skill,
            status_ketersediaan,
            jumlah_tugas,
            maksimal_tugas,
            created_at
        FROM karyawan
        ORDER BY id_karyawan ASC
        `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getKaryawanById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT
            id_karyawan,
            nama_karyawan,
            email,
            jabatan,
            no_hp,
            skill,
            status_ketersediaan,
            jumlah_tugas,
            maksimal_tugas,
            created_at
        FROM karyawan
        WHERE id_karyawan = ?
        `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Karyawan tidak ditemukan",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE
const updateKaryawan = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nama_karyawan,
      email,
      jabatan,
      no_hp,
      skill,
      status_ketersediaan,
      maksimal_tugas,
    } = req.body;

    const [result] = await db.query(
      `
            UPDATE karyawan
            SET
                nama_karyawan = ?,
                email = ?,
                jabatan = ?,
                no_hp = ?,
                skill = ?,
                status_ketersediaan = ?,
                maksimal_tugas = ?
            WHERE id_karyawan = ?
            `,
      [
        nama_karyawan,
        email,
        jabatan,
        no_hp,
        skill,
        status_ketersediaan,
        maksimal_tugas,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Karyawan tidak ditemukan",
      });
    }

    res.json({
      message: "Karyawan berhasil diperbarui",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE
const deleteKaryawan = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM karyawan WHERE id_karyawan = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Karyawan tidak ditemukan",
      });
    }

    res.json({
      message: "Karyawan berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createKaryawan,
  getAllKaryawan,
  getKaryawanById,
  updateKaryawan,
  deleteKaryawan,
};
