import 'package:flutter/material.dart';
import '../../models/jadwal_model.dart';
import '../../services/api_service.dart';
import '../detail_tugas/detail_tugas_screen.dart';
import 'package:intl/intl.dart';

class TugasScreen extends StatefulWidget {
  const TugasScreen({super.key});

  @override
  State<TugasScreen> createState() => _TugasScreenState();
}

class _TugasScreenState extends State<TugasScreen> {
  Color _statusColor(String status) {
    switch (status) {
      case "Belum Dikerjakan":
        return Colors.grey;

      case "Proses":
        return Colors.orange;

      case "Selesai":
        return Colors.green;

      case "Tertunda":
        return Colors.red;

      default:
        return Colors.blue;
    }
  }

  String formatTanggal(String tanggal) {
    final date = DateTime.parse(tanggal);

    return DateFormat(
      "dd MMMM yyyy",
      "id_ID",
    ).format(date);
  }

  final ApiService apiService = ApiService();

  late Future<List<JadwalModel>> futureTugas;

  void loadTugas() {
    setState(() {
      futureTugas = apiService.getTugasSaya();
    });
  }

  @override
  void initState() {
    super.initState();

    loadTugas();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Tugas Saya"),
      ),
      body: FutureBuilder<List<JadwalModel>>(
        future: futureTugas,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Text(snapshot.error.toString()),
            );
          }

          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text("Belum ada tugas"),
            );
          }

          final tugas = snapshot.data!;

          return ListView.builder(
            itemCount: tugas.length,
            itemBuilder: (context, index) {
              final item = tugas[index];

              return InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () async {
                  final result = await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => DetailTugasScreen(
                        tugas: item,
                      ),
                    ),
                  );

                  if (result != null) {
                    loadTugas();

                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      showDialog(
                        context: context,
                        builder: (_) => AlertDialog(
                          title: const Text("Berhasil"),
                          content: Text(result),
                          actions: [
                            TextButton(
                              onPressed: () {
                                Navigator.pop(context);
                              },
                              child: const Text("OK"),
                            )
                          ],
                        ),
                      );
                    });
                  }
                },
                child: Card(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  elevation: 3,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.namaTugas,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Tanggal Tugas",
                              style: TextStyle(
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              formatTanggal(item.tanggalTugas),
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              "Jam Kerja",
                              style: TextStyle(
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              "${item.jamMulai.substring(0, 5)} - ${item.jamSelesai.substring(0, 5)}",
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Align(
                          alignment: Alignment.centerRight,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: _statusColor(item.statusTugas),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              item.statusTugas,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
