class JadwalModel {
  final int idJadwal;
  final String namaTugas;
  final String deskripsi;
  final String prioritas;
  final String deadline;
  final String durasi;
  final String tanggalTugas;
  final String jamMulai;
  final String jamSelesai;
  final String statusTugas;

  JadwalModel({
    required this.idJadwal,
    required this.namaTugas,
    required this.deskripsi,
    required this.prioritas,
    required this.deadline,
    required this.durasi,
    required this.tanggalTugas,
    required this.jamMulai,
    required this.jamSelesai,
    required this.statusTugas,
  });

  factory JadwalModel.fromJson(Map<String, dynamic> json) {
    return JadwalModel(
      idJadwal: json["id_jadwal"],
      namaTugas: json["nama_tugas"],
      deskripsi: json["deskripsi"],
      prioritas: json["prioritas"],
      deadline: json["deadline"],
      durasi: json["durasi"],
      tanggalTugas: json["tanggal_tugas"],
      jamMulai: json["jam_mulai"],
      jamSelesai: json["jam_selesai"],
      statusTugas: json["status_tugas"],
    );
  }
}
