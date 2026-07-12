import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../models/jadwal_model.dart';
import '../../services/api_service.dart';
import '../../widgets/custom_dialog.dart';

class DetailTugasScreen extends StatefulWidget {
  final JadwalModel tugas;

  const DetailTugasScreen({
    super.key,
    required this.tugas,
  });

  @override
  State<DetailTugasScreen> createState() => _DetailTugasScreenState();
}

String formatTanggal(String tanggal) {
  return DateFormat(
    "dd MMMM yyyy",
    "id_ID",
  ).format(DateTime.parse(tanggal));
}

class _DetailTugasScreenState extends State<DetailTugasScreen> {
  final ApiService apiService = ApiService();
  Future<void> showUpdateStatusDialog(BuildContext context) async {
    final TextEditingController catatanController = TextEditingController(
      text: widget.tugas.catatanTugas,
    );

    String selectedStatus = widget.tugas.statusTugas;

    await showDialog(
      context: context,
      builder: (context) {
        bool isLoading = false;
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              insetPadding: const EdgeInsets.symmetric(
                horizontal: 24,
                vertical: 24,
              ),
              title: const Text("Perbarui Status"),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.tugas.namaTugas,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    DropdownButtonFormField<String>(
                      value: selectedStatus,
                      decoration: const InputDecoration(
                        labelText: "Status",
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(
                          value: "Belum Dikerjakan",
                          child: Text("Belum Dikerjakan"),
                        ),
                        DropdownMenuItem(
                          value: "Proses",
                          child: Text("Proses"),
                        ),
                        DropdownMenuItem(
                          value: "Selesai",
                          child: Text("Selesai"),
                        ),
                        DropdownMenuItem(
                          value: "Tertunda",
                          child: Text("Tertunda"),
                        ),
                      ],
                      onChanged: (value) {
                        setDialogState(() {
                          selectedStatus = value!;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: catatanController,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        labelText: "Catatan (Opsional)",
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Text("Batalkan"),
                ),
                ElevatedButton(
                  onPressed: isLoading
                      ? null
                      : () async {
                          setDialogState(() {
                            isLoading = true;
                          });

                          final result = await apiService.updateStatus(
                            idJadwal: widget.tugas.idJadwal,
                            status: selectedStatus,
                            catatan: catatanController.text,
                          );

                          setDialogState(() {
                            isLoading = false;
                          });

                          if (!mounted) return;

                          if (result["statusCode"] == 200) {
                            widget.tugas.statusTugas = selectedStatus;
                            widget.tugas.catatanTugas = catatanController.text;

                            // tutup dialog update status
                            Navigator.pop(context);

                            // kembali ke halaman daftar
                            Navigator.pop(
                              this.context,
                              result["data"]["message"],
                            );
                          }

                          if (result["statusCode"] != 200) {
                            setDialogState(() {
                              isLoading = false;
                            });

                            await CustomDialog.error(
                              context,
                              result["data"]["message"],
                            );
                          }
                        },
                  child: isLoading
                      ? const SizedBox(
                          height: 18,
                          width: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text("Perbarui Status"),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Detail Tugas"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Nama Tugas",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      widget.tugas.namaTugas,
                      style: const TextStyle(
                        fontSize: 18,
                      ),
                    ),
                    const Divider(height: 30),
                    buildItem(
                      "Deskripsi",
                      widget.tugas.deskripsi,
                    ),
                    buildItem(
                      "Prioritas",
                      widget.tugas.prioritas,
                    ),
                    buildItem(
                      "Tanggal Mulai",
                      formatTanggal(
                        widget.tugas.tanggalTugas,
                      ),
                    ),
                    buildItem(
                      "Deadline",
                      formatTanggal(
                        widget.tugas.deadline,
                      ),
                    ),
                    // buildItem(
                    //   "Durasi",
                    //   widget.tugas.durasi,
                    // ),
                    buildItem(
                      "Jam Kerja",
                      "${widget.tugas.jamMulai.substring(0, 5)} - ${widget.tugas.jamSelesai.substring(0, 5)}",
                    ),
                    buildItem(
                      "Status",
                      widget.tugas.statusTugas,
                    ),

                    const SizedBox(height: 16),
                    const Text(
                      "Catatan",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        widget.tugas.catatanTugas.isEmpty
                            ? "-"
                            : widget.tugas.catatanTugas,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  showUpdateStatusDialog(context);
                },
                child: const Text(
                  "Update Status",
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget buildItem(
    String title,
    String value,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
