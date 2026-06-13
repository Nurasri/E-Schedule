const db = require("../config/db");

// CREATE
const createTugas = async (req, res) => {
  try {
    const {
      nama_tugas,
      deskripsi,
      prioritas,
      skill_dibutuhkan,
      deadline,
      durasi,
      catatan_tugas,
    } = req.body;

    await db.query(
      `
      INSERT INTO tugas (
        nama_tugas,
        deskripsi,
        prioritas,
        skill_dibutuhkan,
        deadline,
        durasi,
        catatan_tugas
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nama_tugas,
        deskripsi,
        prioritas,
        skill_dibutuhkan,
        deadline,
        durasi,
        catatan_tugas,
      ],
    );

    res.status(201).json({
      message: "Tugas berhasil ditambahkan",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL
const getAllTugas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM tugas
      ORDER BY deadline ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET BY ID
const getTugasById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM tugas
      WHERE id_tugas = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Tugas tidak ditemukan",
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
const updateTugas = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nama_tugas,
      deskripsi,
      prioritas,
      skill_dibutuhkan,
      deadline,
      durasi,
      catatan_tugas,
    } = req.body;

    const [result] = await db.query(
      `
      UPDATE tugas
      SET
        nama_tugas = ?,
        deskripsi = ?,
        prioritas = ?,
        skill_dibutuhkan = ?,
        deadline = ?,
        durasi = ?,
        catatan_tugas = ?
      WHERE id_tugas = ?
      `,
      [
        nama_tugas,
        deskripsi,
        prioritas,
        skill_dibutuhkan,
        deadline,
        durasi,
        catatan_tugas,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Tugas tidak ditemukan",
      });
    }

    res.json({
      message: "Tugas berhasil diperbarui",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE
const deleteTugas = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM tugas WHERE id_tugas = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Tugas tidak ditemukan",
      });
    }

    res.json({
      message: "Tugas berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTugas,
  getAllTugas,
  getTugasById,
  updateTugas,
  deleteTugas,
};
