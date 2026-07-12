import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'screens/login/login_screen.dart';
import 'screens/home/home_screen.dart';
import 'services/session_services.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await initializeDateFormatting('id_ID', null);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Capstone Mobile',
      home: CheckLogin(),
    );
  }
}

class CheckLogin extends StatelessWidget {
  const CheckLogin({super.key});

  @override
  Widget build(BuildContext context) {
    final session = SessionService();

    return FutureBuilder(
      future: Future.wait([
        session.getToken(),
        session.getNama(),
      ]),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        final token = snapshot.data![0];
        final nama = snapshot.data![1];

        if (token != null) {
          return HomeScreen(
            nama: nama ?? "",
            tampilkanWelcome: false,
          );
        }

        return const LoginScreen();
      },
    );
  }
}
