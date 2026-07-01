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

    if (karyawan[0].jumlah_tugas >= karyawan[0].maksimal_tugas) {
      return res.status(400).json({
        message: "Karyawan telah mencapai batas maksimal tugas",
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

    await db.query(
      `
      UPDATE karyawan
      SET jumlah_tugas = jumlah_tugas + 1
      WHERE id_karyawan = ?
      `,
      [id_karyawan],
    );

    await db.query(
      `
      UPDATE karyawan
      SET status_ketersediaan =
        CASE
          WHEN jumlah_tugas >= maksimal_tugas
          THEN 'Sibuk'
          ELSE 'Tersedia'
        END
      WHERE id_karyawan = ?
      `,
      [id_karyawan],
    );

    // Integrasi Riwayat Beban
    const [riwayat] = await db.query(
      `
      SELECT * 
      FROM riwayat_beban
      WHERE id_karyawan = ?
      `,
      [id_karyawan],
    );

    if (riwayat.length === 0) {
      const maksimal = karyawan[0].maksimal_tugas;

      const nilaiBeban = (1 / maksimal) * 100;

      await db.query(
        `
          INSERT INTO riwayat_beban (
            id_karyawan,
            total_tugas,
            tugas_selesai,
            tugas_aktif,
            nilai_beban,
            tanggal_update
          )
          VALUES (?, ?, ?, ?, ?, CURDATE())
          `,
        [id_karyawan, 1, 0, 1, nilaiBeban],
      );
    } else {
      const data = riwayat[0];

      const total = data.total_tugas + 1;
      const aktif = data.tugas_aktif + 1;

      const maksimal = karyawan[0].maksimal_tugas;

      const nilai = (aktif / maksimal) * 100;

      await db.query(
        `
        UPDATE riwayat_beban
        SET
          total_tugas = ?,
          tugas_aktif = ?,
          nilai_beban = ?,
          tanggal_update = CURDATE()
        WHERE id_karyawan = ?
        `,
        [total, aktif, nilai, id_karyawan],
      );
    }

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

    // Ambil data jadwal yang akan dihapus
    const [jadwal] = await db.query(
      `
      SELECT j.*, k.maksimal_tugas
      FROM jadwal j
      JOIN karyawan k
        ON j.id_karyawan = k.id_karyawan
      WHERE j.id_jadwal = ?
      `,
      [id],
    );

    if (jadwal.length === 0) {
      return res.status(404).json({
        message: "Jadwal tidak ditemukan",
      });
    }

    const dataJadwal = jadwal[0];

    // Hapus jadwal
    await db.query("DELETE FROM jadwal WHERE id_jadwal = ?", [id]);

    // Jika tugas belum selesai
    if (dataJadwal.status_tugas !== "Selesai") {
      // Kurangi jumlah_tugas
      await db.query(
        `UPDATE karyawan
        SET jumlah_tugas = jumlah_tugas - 1
        WHERE id_karyawan = ?
        `,
        [dataJadwal.id_karyawan],
      );

      await db.query(
        `UPDATE karyawan
        SET status_ketersediaan = 
          CASE 
            WHEN jumlah_tugas >= maksimal_tugas
            THEN 'Sibuk'
            ELSE 'Tersedia'
          END
        WHERE id_karyawan = ?
        `,
        [dataJadwal.id_karyawan],
      );

      // Ambil riwayat beban
      const [riwayat] = await db.query(
        `
        SELECT * 
        FROM riwayat_beban
        WHERE id_karyawan = ?
        `,
        [dataJadwal.id_karyawan],
      );

      if (riwayat.length > 0) {
        const dataRiwayat = riwayat[0];

        const tugasAktifBaru = Math.max(dataRiwayat.tugas_aktif - 1, 0);

        const nilaiBebanBaru =
          (tugasAktifBaru / dataJadwal.maksimal_tugas) * 100;

        await db.query(
          `
          UPDATE riwayat_beban
          SET
            tugas_aktif = ?,
            nilai_beban = ?,
            tanggal_update = CURDATE()
          WHERE id_karyawan = ?
          `,
          [tugasAktifBaru, nilaiBebanBaru, dataJadwal.id_karyawan],
        );
      }
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
    const allowedStatus = ["Belum Dikerjakan", "Proses", "Selesai", "Tertunda"];

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

    const statusLama = jadwal[0].status_tugas;

    if (statusLama === "Selesai" && status_tugas !== "Selesai") {
      return res.status(400).json({
        message: "Tugas yang sudah selesai tidak dapat diubah kembali",
      });
    }

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

    if (statusLama !== "Selesai" && status_tugas === "Selesai") {
      // Jumlah tugas
      await db.query(
        `
        UPDATE karyawan
        SET jumlah_tugas = jumlah_tugas - 1
        WHERE id_karyawan = ?
        `,
        [req.user.id],
      );

      // Status_ketersediaan
      await db.query(
        `
        UPDATE karyawan
        SET status_ketersediaan =
          CASE
            WHEN jumlah_tugas >= maksimal_tugas
            THEN 'Sibuk'
            ELSE 'Tersedia'
          END
        WHERE id_karyawan = ?
        `,
        [req.user.id],
      );

      // riwayat_beban
      const [riwayat] = await db.query(
        `
          SELECT
          rb.*,
          k.maksimal_tugas
          FROM riwayat_beban rb
          JOIN karyawan k
          ON rb.id_karyawan=k.id_karyawan
          WHERE rb.id_karyawan=?
          ORDER BY rb.id_riwayat_beban DESC
          LIMIT 1
          `,
        [req.user.id],
      );

      if (riwayat.length > 0) {
        const data = riwayat[0];

        const tugasAktifBaru = Math.max(data.tugas_aktif - 1, 0);

        const tugasSelesaiBaru = data.tugas_selesai + 1;

        const nilaiBebanBaru = tugasAktifBaru;
        // const nilaiBebanBaru = (tugasAktifBaru / data.maksimal_tugas) * 100;

        await db.query(
          `
          UPDATE riwayat_beban
          SET
            tugas_aktif = ?,
            tugas_selesai = ?,
            nilai_beban = ?,
            tanggal_update = CURDATE()
          WHERE id_karyawan = ?
          `,
          [tugasAktifBaru, tugasSelesaiBaru, nilaiBebanBaru, req.user.id],
        );
      }
    }

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
