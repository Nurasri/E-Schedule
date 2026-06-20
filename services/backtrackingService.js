const pool = require("../config/db");

const { generateGreedySchedule } = require("./greedyService");

const { calculateGreedyScore } = require("../helpers/scoringHelpers");

/*
=================================================
CEK KONFLIK WAKTU
=================================================

Ji ∩ Jj = ∅

PROJECT MODE:
jam_mulai dan jam_selesai masih NULL,
sehingga dianggap tidak konflik.

RUTIN MODE:
akan melakukan pengecekan overlap waktu.
*/

function checkTimeConflict(jamMulaiBaru, jamSelesaiBaru, jadwalLama = []) {
  /*
    PROJECT MODE
  */
  if (!jamMulaiBaru || !jamSelesaiBaru) {
    return false;
  }

  for (const jadwal of jadwalLama) {
    /*
      Lewati jika jadwal lama belum memiliki slot waktu
    */
    if (!jadwal.jam_mulai || !jadwal.jam_selesai) {
      continue;
    }

    /*
      Ji ∩ Jj ≠ ∅
    */
    if (
      jamMulaiBaru < jadwal.jam_selesai &&
      jamSelesaiBaru > jadwal.jam_mulai
    ) {
      return true;
    }
  }

  /*
    Ji ∩ Jj = ∅
  */
  return false;
}

/*
=================================================
VALIDASI CONSTRAINT
=================================================

1. Karyawan tersedia
2. Jumlah tugas tidak melebihi batas
3. Distribusi beban menggunakan workload sementara
4. Konflik waktu (disiapkan untuk mode rutin)
*/

async function validateConstraint(
  kandidat,
  tugas,
  workloadMap,
  scheduleMap = new Map(),
) {
  /*
    Constraint 1
    Karyawan harus tersedia
  */
  if (kandidat.status_ketersediaan !== "Tersedia") {
    return false;
  }

  /*
    Constraint 2
    Jumlah tugas maksimal

    Tk ≤ M
  */
  const totalTugasSementara =
    workloadMap.get(kandidat.id_karyawan) ?? kandidat.jumlah_tugas ?? 0;

  if (totalTugasSementara >= kandidat.maksimal_tugas) {
    return false;
  }

  /*
  Constraint 3

  Ji ∩ Jj = ∅
*/

  const jadwalLama = scheduleMap.get(kandidat.id_karyawan) || [];

  const konflik = checkTimeConflict(
    tugas.jam_mulai,
    tugas.jam_selesai,
    jadwalLama,
  );

  if (konflik) {
    return false;
  }

  return true;
}

/*
=================================================
MENCARI KANDIDAT ALTERNATIF
=================================================

- Membatalkan kandidat bermasalah
- Mencari kandidat lain
- Validasi ulang
*/

async function findAlternativeCandidate(
  tugas,
  kandidatAwal,
  workloadMap,
  scheduleMap = new Map(),
) {
  /*
    Ambil seluruh kandidat tersedia
  */
  const [kandidatList] = await pool.query(`
    SELECT *
    FROM karyawan
    WHERE status_ketersediaan = 'Tersedia'
  `);

  let kandidatTerbaik = null;

  let scoreTertinggi = -Infinity;

  for (const kandidat of kandidatList) {
    /*
      Lewati kandidat awal Greedy
    */
    if (kandidatAwal && kandidat.id_karyawan === kandidatAwal.id_karyawan) {
      continue;
    }

    /*
      Validasi constraint
    */
    const isValid = await validateConstraint(
      kandidat,
      tugas,
      workloadMap,
      scheduleMap,
    );

    if (!isValid) {
      continue;
    }

    /*
      Beban sementara
    */
    const jumlahTugas =
      workloadMap.get(kandidat.id_karyawan) ?? kandidat.jumlah_tugas;

    /*
      Hitung ulang score Greedy

      Menggunakan rumus BAB III
    */
    const score = calculateGreedyScore({
      prioritas: tugas.prioritas,

      skillKaryawan: kandidat.skill,

      /*
        Jika skill_dibutuhkan tidak ada,
        score skill menjadi 0.
      */
      skillTugas: tugas.skill_dibutuhkan,

      jumlahTugas,

      maksimalTugas: kandidat.maksimal_tugas,
    });

    /*
      Ambil kandidat terbaik
    */
    if (score > scoreTertinggi) {
      scoreTertinggi = score;

      kandidatTerbaik = {
        ...kandidat,

        score,
      };
    }
  }

  return kandidatTerbaik;
}

/*
=================================================
MENYIMPAN JADWAL VALID
=================================================

7. Menyimpan jadwal yang memenuhi seluruh aturan.
*/

async function saveSchedule(connection, hasilPenjadwalan, workloadMap) {
  /*
    Simpan ke tabel jadwal
  */
  await connection.query(
    `
      INSERT INTO jadwal (
        id_karyawan,
        id_tugas,
        tanggal_tugas,
        jam_mulai,
        jam_selesai,
        status_tugas,
        score_greedy,
        hasil_validasi,
        metode_penjadwalan
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      hasilPenjadwalan.id_karyawan,
      hasilPenjadwalan.id_tugas,

      /*
        PROJECT MODE:
        tanggal tugas menggunakan deadline.
      */
      hasilPenjadwalan.deadline,

      /*
        Belum digunakan pada PROJECT MODE.
      */
      null,
      null,

      "Belum Dikerjakan",

      hasilPenjadwalan.score,

      "Valid",

      "Greedy-Bactracking",
    ],
  );

  /*
    Update jumlah tugas karyawan
  */
  await connection.query(
    `
      UPDATE karyawan
      SET jumlah_tugas = jumlah_tugas + 1
      WHERE id_karyawan = ?
    `,
    [hasilPenjadwalan.id_karyawan],
  );

  /*
    Update workload sementara
  */
  workloadMap.set(
    hasilPenjadwalan.id_karyawan,

    (workloadMap.get(hasilPenjadwalan.id_karyawan) || 0) + 1,
  );

  /*
    Ambil data terbaru karyawan
  */
  const [karyawanRows] = await connection.query(
    `
      SELECT jumlah_tugas
      FROM karyawan
      WHERE id_karyawan = ?
    `,
    [hasilPenjadwalan.id_karyawan],
  );

  const totalTugas = karyawanRows[0]?.jumlah_tugas || 0;

  /*
    Simpan riwayat beban
  */
  await connection.query(
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
    [
      hasilPenjadwalan.id_karyawan,

      totalTugas,

      /*
        Tugas selesai belum dihitung
      */
      0,

      /*
        Semua tugas baru dianggap aktif
      */
      totalTugas,

      /*
        Nilai beban sederhana
      */
      Number(totalTugas.toFixed(2)),
    ],
  );
}

/*
=================================================
PROSES UTAMA BACKTRACKING
=================================================

1. Mengambil hasil penjadwalan awal dari Greedy
2. Pemeriksaan constraint
3. Identifikasi konflik
4. Membatalkan penempatan bermasalah
5. Memilih kandidat alternatif
6. Validasi ulang
7. Menyimpan jadwal valid
*/

async function processBacktracking() {
  /*
    STEP 1
    Generate jadwal sementara Greedy
  */
  const greedyResult = await generateGreedySchedule();

  /*
    Tidak ada tugas
  */
  if (!greedyResult || !greedyResult.hasil || greedyResult.hasil.length === 0) {
    return {
      total_tugas: 0,
      berhasil: 0,
      gagal: 0,
      hasil: [],
    };
  }

  /*
    Hasil final
  */
  const hasilFinal = [];

  /*
    Workload sementara
  */
  const workloadMap = new Map();

  /*
    Schedule sementara
    (persiapan mode rutin)
  */
  const scheduleMap = new Map();

  /*
    Ambil jumlah tugas awal karyawan
  */
  const [karyawanRows] = await pool.query(`
    SELECT id_karyawan, jumlah_tugas
    FROM karyawan
  `);

  for (const karyawan of karyawanRows) {
    workloadMap.set(karyawan.id_karyawan, karyawan.jumlah_tugas);
  }

  /*
    Transaction
  */
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    /*
      STEP 2
      Proses hasil Greedy satu per satu
    */
    for (const item of greedyResult.hasil) {
      /*
        Jika Greedy gagal
      */
      if (item.status_generate === "GAGAL") {
        const alternatif = await findAlternativeCandidate(
          item,
          null,
          workloadMap,
          scheduleMap,
        );

        if (!alternatif) {
          hasilFinal.push({
            ...item,
            metode: "Backtracking",
            alasan: "Tidak ditemukan kandidat alternatif",
          });

          continue;
        }

        const hasilAlternatif = {
          ...item,
          id_karyawan: alternatif.id_karyawan,
          nama_karyawan: alternatif.nama_karyawan,
          score: alternatif.score,
          status_generate: "BERHASIL",
        };

        await saveSchedule(connection, hasilAlternatif, workloadMap);

        hasilFinal.push({
          ...hasilAlternatif,
          metode: "Backtracking",
        });

        continue;
      }

      /*
        Ambil kandidat Greedy terbaru
      */
      const [kandidatRows] = await connection.query(
        `
          SELECT *
          FROM karyawan
          WHERE id_karyawan = ?
        `,
        [item.id_karyawan],
      );

      const kandidatGreedy = kandidatRows[0];

      /*
        STEP 3
        Validasi constraint
      */
      const valid = await validateConstraint(
        kandidatGreedy,
        item,
        workloadMap,
        scheduleMap,
      );

      /*
        Jika valid
      */
      if (valid) {
        await saveSchedule(connection, item, workloadMap);

        hasilFinal.push({
          ...item,

          metode: "Greedy",
        });

        continue;
      }

      /*
        STEP 4
        Cari kandidat alternatif
      */
      const alternatif = await findAlternativeCandidate(
        item,
        kandidatGreedy,
        workloadMap,
        scheduleMap,
      );

      /*
        Tidak ada alternatif
      */
      if (!alternatif) {
        hasilFinal.push({
          ...item,

          status_generate: "GAGAL",

          alasan: "Tidak ditemukan kandidat alternatif",

          metode: "Backtracking",
        });

        continue;
      }

      /*
        STEP 5
        Gunakan kandidat alternatif
      */
      const hasilAlternatif = {
        ...item,

        id_karyawan: alternatif.id_karyawan,

        nama_karyawan: alternatif.nama_karyawan,

        score: alternatif.score,

        status_generate: "BERHASIL",
      };

      await saveSchedule(connection, hasilAlternatif, workloadMap);

      hasilFinal.push({
        ...hasilAlternatif,

        metode: "Backtracking",
      });
    }

    /*
      Commit
    */
    await connection.commit();

    /*
      Metadata
    */
    const total_tugas = hasilFinal.length;

    const berhasil = hasilFinal.filter(
      (item) => item.status_generate === "BERHASIL",
    ).length;

    const gagal = hasilFinal.filter(
      (item) => item.status_generate === "GAGAL",
    ).length;

    return {
      total_tugas,

      berhasil,

      gagal,

      hasil: hasilFinal,
    };
  } catch (error) {
    /*
      Rollback jika gagal
    */
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
}

/*
=================================================
EXPORT
=================================================
*/

module.exports = {
  processBacktracking,
};
