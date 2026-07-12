import 'package:flutter/material.dart';

import '../../models/jadwal_model.dart';
import '../../services/api_service.dart';
import '../../services/session_services.dart';
import '../login/login_screen.dart';
import '../task/tugas_screen.dart';

class HomeScreen extends StatefulWidget {
  final String nama;

  const HomeScreen({
    super.key,
    required this.nama,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService apiService = ApiService();

  late Future<List<JadwalModel>> futureTugas;

  @override
  void initState() {
    super.initState();
    futureTugas = apiService.getTugasSaya();
  }

  int jumlahStatus(List<JadwalModel> data, String status) {
    return data.where((e) => e.statusTugas == status).length;
  }

  Widget buildStatusCard({
    required String title,
    required int total,
    required Color color,
    required IconData icon,
  }) {
    return Expanded(
      child: Card(
        elevation: 3,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            vertical: 18,
            horizontal: 12,
          ),
          child: Column(
            children: [
              CircleAvatar(
                backgroundColor: color.withOpacity(.15),
                child: Icon(
                  icon,
                  color: color,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                "$total",
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                title,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Dashboard",
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          // Center(
          //   child: Padding(
          //     padding: const EdgeInsets.only(right: 8),
          //     child: Text(
          //       widget.nama,
          //       style: const TextStyle(
          //         fontWeight: FontWeight.w600,
          //       ),
          //     ),
          //   ),
          // ),
          PopupMenuButton<String>(
            onSelected: (value) async {
              if (value == "logout") {
                await SessionService().logout();

                if (context.mounted) {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const LoginScreen(),
                    ),
                    (route) => false,
                  );
                }
              }
            },
            itemBuilder: (context) => const [
              PopupMenuItem(
                value: "logout",
                child: Text("Logout"),
              ),
            ],
          ),
        ],
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

          final tugas = snapshot.data ?? [];

          final belum = jumlahStatus(
            tugas,
            "Belum Dikerjakan",
          );

          final proses = jumlahStatus(
            tugas,
            "Proses",
          );

          final selesai = jumlahStatus(
            tugas,
            "Selesai",
          );

          final tertunda = jumlahStatus(
            tugas,
            "Tertunda",
          );

          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                futureTugas = apiService.getTugasSaya();
              });

              await futureTugas;
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Selamat Datang",
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.nama,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  // const SizedBox(height: 6),
                  // Text(
                  //   "Semoga pekerjaan hari ini berjalan lancar.",
                  //   style: TextStyle(
                  //     color: Colors.grey,
                  //   ),
                  // ),
                  const SizedBox(height: 30),
                  const Text(
                    "Ringkasan Tugas",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 15),
                  Row(
                    children: [
                      buildStatusCard(
                        title: "Belum",
                        total: belum,
                        color: Colors.grey,
                        icon: Icons.pending_actions,
                      ),
                      const SizedBox(width: 12),
                      buildStatusCard(
                        title: "Proses",
                        total: proses,
                        color: Colors.orange,
                        icon: Icons.autorenew,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      buildStatusCard(
                        title: "Selesai",
                        total: selesai,
                        color: Colors.green,
                        icon: Icons.check_circle,
                      ),
                      const SizedBox(width: 12),
                      buildStatusCard(
                        title: "Tertunda",
                        total: tertunda,
                        color: Colors.red,
                        icon: Icons.warning,
                      ),
                    ],
                  ),
                  const SizedBox(height: 30),
                  const Text(
                    "Menu",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 15),
                  Card(
                    elevation: 3,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 10,
                      ),
                      leading: CircleAvatar(
                        radius: 24,
                        backgroundColor: Colors.blue.shade100,
                        child: const Icon(
                          Icons.assignment,
                          color: Colors.blue,
                        ),
                      ),
                      title: const Text(
                        "Tugas Saya",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      subtitle: Text(
                        "$belum Belum • $proses Proses • $selesai Selesai",
                      ),
                      trailing: const Icon(
                        Icons.arrow_forward_ios,
                        size: 18,
                      ),
                      onTap: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const TugasScreen(),
                          ),
                        );

                        setState(() {
                          futureTugas = apiService.getTugasSaya();
                        });
                      },
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
