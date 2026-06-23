const pool = require("../config/db");
const { calculateGreedyScore } = require("../helpers/scoringHelpers");

async function generateGreedySchedule() {
  const hasilGreedy = [];

  /*
        workloadMap:
        Menyimpan simulasi jumlah tugas selama proses generate.
        Key   : id_karyawan
        Value : jumlah tugas sementara
    */
  const workloadMap = new Map();

  /*
        STEP 1
        Ambil tugas yang belum dijadwalkan
    */
  const [tugasList] = await pool.query(`
        SELECT *
        FROM tugas
        WHERE id_tugas NOT IN (
            SELECT id_tugas
            FROM jadwal
        )
    `);

  /*
        Tidak ada tugas
    */
  if (tugasList.length === 0) {
    return hasilGreedy;
  }

  /*
        STEP 2
        Urutkan prioritas
    */
  const priorityMap = {
    tinggi: 3,
    sedang: 2,
    rendah: 1,
  };

  tugasList.sort((a, b) => {
    const nilaiA = priorityMap[a.prioritas?.toLowerCase()] || 0;

    const nilaiB = priorityMap[b.prioritas?.toLowerCase()] || 0;

    /*
            Prioritas lebih tinggi didahulukan
        */
    if (nilaiB !== nilaiA) {
      return nilaiB - nilaiA;
    }

    /*
            Jika prioritas sama,
            deadline terdekat didahulukan
        */
    return new Date(a.deadline) - new Date(b.deadline);
  });

  /*
        STEP 3
        Ambil seluruh kandidat
    */
  const [karyawanList] = await pool.query(`
        SELECT *
        FROM karyawan
        WHERE status_ketersediaan = 'Tersedia'
          AND jumlah_tugas < maksimal_tugas
    `);

  /*
        Tidak ada kandidat
    */
  if (karyawanList.length === 0) {
    return hasilGreedy;
  }

  /*
        STEP 4
        Inisialisasi workload sementara
    */
  for (const karyawan of karyawanList) {
    workloadMap.set(karyawan.id_karyawan, karyawan.jumlah_tugas);
  }

  /*
        STEP 5
        Proses setiap tugas
    */
  for (const tugas of tugasList) {
    let kandidatTerbaik = null;
    let scoreTertinggi = -Infinity;

    /*
            Cari kandidat terbaik
        */
    for (const karyawan of karyawanList) {
      const bebanSementara = workloadMap.get(karyawan.id_karyawan);

      /*
                Lewati jika sudah penuh
            */
      if (bebanSementara >= karyawan.maksimal_tugas) {
        continue;
      }

      /*
                Hitung score Greedy
            */
      const score = calculateGreedyScore({
        prioritas: tugas.prioritas,

        skillKaryawan: karyawan.skill,

        skillTugas: tugas.skill_dibutuhkan,

        jumlahTugas: bebanSementara,

        maksimalTugas: karyawan.maksimal_tugas,
      });

      /*
                Pilih score tertinggi
            */
      if (score > scoreTertinggi) {
        scoreTertinggi = score;

        kandidatTerbaik = karyawan;
      }
    }

    /*
            Tidak ada kandidat
        */
    if (!kandidatTerbaik) {
      hasilGreedy.push({
        id_tugas: tugas.id_tugas,

        nama_tugas: tugas.nama_tugas,

        prioritas: tugas.prioritas,

        deadline: tugas.deadline,

        durasi: tugas.durasi,

        status_generate: "GAGAL",

        alasan: "Tidak ada karyawan tersedia",
      });

      continue;
    }

    /*
            STEP 6
            Simpan hasil sementara
        */
    hasilGreedy.push({
      id_tugas: tugas.id_tugas,

      nama_tugas: tugas.nama_tugas,

      prioritas: tugas.prioritas,

      deadline: tugas.deadline,

      durasi: tugas.durasi,

      id_karyawan: kandidatTerbaik.id_karyawan,

      nama_karyawan: kandidatTerbaik.nama_karyawan,

      score: scoreTertinggi,

      status_generate: "BERHASIL",
    });

    /*
            STEP 7
            Update beban sementara
        */
    workloadMap.set(
      kandidatTerbaik.id_karyawan,

      workloadMap.get(kandidatTerbaik.id_karyawan) + 1,
    );
  }

  /*
      STEP 8
      Hitung metadata hasil generate
  */
  const total_tugas = tugasList.length;

  const berhasil = hasilGreedy.filter(
    (item) => item.status_generate === "BERHASIL",
  ).length;

  const gagal = hasilGreedy.filter(
    (item) => item.status_generate === "GAGAL",
  ).length;

  /*
      STEP 9
      Return preview Greedy beserta metadata
  */
  return {
    hasil: hasilGreedy,
    total_tugas,
    berhasil,
    gagal,
  };
}

module.exports = {
  generateGreedySchedule,
};
