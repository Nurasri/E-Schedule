import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api_service.dart';
import '../home/home_screen.dart';
import '../../services/session_services.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final apiService = ApiService();
  final _formKey = GlobalKey<FormState>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  final sessionService = SessionService();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> login() async {
    if (!_formKey.currentState!.validate()) return;

    final result = await apiService.login(
      emailController.text.trim(),
      passwordController.text.trim(),
    );

    // print("Status : ${result["statusCode"]}");
    // print("Body   : ${result["data"]}");

    if (!mounted) return;

    if (result["statusCode"] == 200) {
      await sessionService.saveLogin(
        token: result["data"]["token"],
        role: result["data"]["role"],
        nama: result["data"]["nama"],
      );
      // final prefs = await SharedPreferences.getInstance();

      // await prefs.setString(
      //   "token",
      //   result["data"]["token"],
      // );

      // await prefs.setString(
      //   "role",
      //   result["data"]["role"],
      // );

      // await prefs.setString(
      //   "nama",
      //   result["data"]["nama"],
      // );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Login Berhasil"),
        ),
      );
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => HomeScreen(
            nama: result["data"]["nama"],
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            result["data"]["message"] ?? "Login gagal",
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Login"),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 50),
                const Icon(
                  Icons.assignment,
                  size: 90,
                ),
                const SizedBox(height: 20),
                const Text(
                  "E-Schdule Karyawan",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  "Silakan login terlebih dahulu",
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 40),
                TextFormField(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: "Email",
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.email),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Email wajib diisi";
                    }

                    return null;
                  },
                ),
                const SizedBox(height: 20),
                TextFormField(
                  controller: passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: "Password",
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.lock),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Password wajib diisi";
                    }

                    return null;
                  },
                ),
                const SizedBox(height: 30),
                SizedBox(
                  height: 50,
                  child: ElevatedButton(
                    onPressed: login,
                    child: const Text(
                      "LOGIN",
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
