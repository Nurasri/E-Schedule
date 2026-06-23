function getPriorityValue(prioritas) {
  switch (prioritas?.toLowerCase()) {
    case "tinggi":
      return 3;

    case "sedang":
      return 2;

    case "rendah":
      return 1;

    default:
      return 0;
  }
}

function getSkillScore(skillKaryawan, skillTugas) {
  if (!skillKaryawan || !skillTugas) {
    return 0;
  }

  /*
    Mendukung multi-skill.

    Contoh:
    skill_karyawan:
    "Frontend,UI/UX,Testing"

    skill_tugas:
    "Frontend"
  */

  const daftarSkillKaryawan = skillKaryawan
    .split(",")
    .map((skill) => skill.trim().toLowerCase());

  const daftarSkillTugas = skillTugas
    .split(",")
    .map((skill) => skill.trim().toLowerCase());

  const cocok = daftarSkillTugas.some((skill) =>
    daftarSkillKaryawan.includes(skill),
  );

  return cocok ? 1 : 0;
}

function getWorkloadValue(jumlahTugas, maksimalTugas) {
  if (!maksimalTugas || maksimalTugas <= 0) {
    return 1;
  }

  return jumlahTugas / maksimalTugas;
}

function calculateGreedyScore({
  prioritas,
  skillKaryawan,
  skillTugas,
  jumlahTugas,
  maksimalTugas,
}) {
  const P = getPriorityValue(prioritas);

  const S = getSkillScore(skillKaryawan, skillTugas);

  const A = 1;

  const B = getWorkloadValue(jumlahTugas, maksimalTugas);

  /*
    Rumus BAB III

    Score =
    (0.4 × P)
    + (0.3 × S)
    + (0.2 × A)
    − (0.1 × B)
  */

  const score = 0.4 * P + 0.3 * S + 0.2 * A - 0.1 * B;

  return Number(score.toFixed(2));
}

module.exports = {
  getPriorityValue,
  getSkillScore,
  getWorkloadValue,
  calculateGreedyScore,
};
