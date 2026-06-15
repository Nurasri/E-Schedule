const db = require("../config/db");

// Create Jadwal
const createJadwal = async (req, res) => {
  try {
    const { id_karyawan, id_tugas, tanggal_tugas, jam_mulai, jam_selesai } =
      req.body;

    // cek karyawan
    const [karyawan] = await db.query(
      "SELECT * FROM karyawan WHERE id_karyawan = ?",
      [id_karyawan],
    );

    if (karyawan.length === 0) {
      return res.status(404).json({
        message: "Karyawan tidak ditemukan",
      });
    }

    // cek tugas
    const [tugas] = await db.query("SELECT * FROM tugas WHERE id_tugas = ?", [
      id_tugas,
    ]);

    if (tugas.length === 0) {
      return res.status(404).json({
        message: "Tugas tidak ditemukan",
      });
    }

    const [result] = await db.query(
      `
        INSERT INTO jadwal (
        id_karyawan,
        id_tugas,
        tanggal_tugas,
        jam_mulai,
        jam_selesai
    )
        VALUES (?, ?, ?, ?, ?)
        `,
      [id_karyawan, id_tugas, tanggal_tugas, jam_mulai, jam_selesai],
    );

    res.status(201).json({
      message: "Jadwal berhasil dibuat",
      id_jadwal: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Jadwal
const getAllJadwal = async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
            j.id_jadwal,
            k.nama_karyawan,
            t.nama_tugas,
            j.tanggal_tugas,
            j.jam_mulai,
            j.jam_selesai,
            j.status_tugas,
            j.score_greedy,
            j.hasil_validasi
        FROM jadwal j
        JOIN karyawan k
            ON j.id_karyawan = k.id_karyawan
        JOIN tugas t
            ON j.id_tugas = t.id_tugas
        ORDER BY j.tanggal_tugas ASC
        `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Jadwal By ID
const getJadwalById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT
            j.*,
            k.nama_karyawan,
            t.nama_tugas
        FROM jadwal j
        JOIN karyawan k
            ON j.id_karyawan = k.id_karyawan
        JOIN tugas t
            ON j.id_tugas = t.id_tugas
        WHERE j.id_jadwal = ?
        `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Jadwal tidak ditemukan",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Jadwal
const deleteJadwal = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM jadwal WHERE id_jadwal = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Jadwal tidak ditemukan",
      });
    }

    res.json({
      message: "Jadwal berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyJadwal = async (req, res) => {
  try {
    // hanya karyawan
    if (req.user.role !== "karyawan") {
      return res.status(403).json({
        message: "Fitur ini hanya untuk karyawan",
      });
    }

    const [rows] = await db.query(
      `
            SELECT 
                j.id_jadwal,
                t.nama_tugas,
                t.deskripsi,
                t.prioritas,
                t.deadline,
                t.durasi,
                j.tanggal_tugas,
                j.jam_mulai,
                j.jam_selesai,
                j.status_tugas
            FROM jadwal j
            JOIN tugas t
                ON j.id_tugas = t.id_tugas
            WHERE j.id_karyawan = ?
            ORDER BY j.tanggal_tugas ASC
            `,
      [req.user.id],
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateStatusTugas = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_tugas } = req.body;

    // hanya karyawan
    if (req.user.role !== "karyawan") {
      return res.status(403).json({
        message: "Fitur ini hanya untuk karyawan",
      });
    }

    // Validasi status
    const allowedStatus = ["Belum dikerjakan", "Proses", "Selesai", "Tertunda"];

    if (!allowedStatus.includes(status_tugas)) {
      return res.status(400).json({
        message: "Status tugas tidak valid",
      });
    }

    // pastikan jadwal milik karyawan yang login
    const [jadwal] = await db.query(
      `
           SELECT *
           FROM jadwal
           WHERE id_jadwal = ?
           AND id_karyawan = ? 
            `,
      [id, req.user.id],
    );

    if (jadwal.length === 0) {
      return res.status(404).json({
        message: "Jadwal tidak ditemukan atau bukan milik anda",
      });
    }

    await db.query(
      `
            UPDATE jadwal
            SET status_tugas = ?
            WHERE id_jadwal = ?
            `,
      [status_tugas, id],
    );

    res.json({
      message: "Status tugas berhasil diperbarui",
      status_tugas,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJadwal,
  getAllJadwal,
  getJadwalById,
  deleteJadwal,
  getMyJadwal,
  updateStatusTugas,
};
