import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/jadwal_model.dart';
import 'session_services.dart';

class ApiService {
  // Ganti sesuai IP backend Anda
  static const String baseUrl = "http://10.0.2.2:5000";

  Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    final response = await http.post(
      Uri.parse("$baseUrl/auth/login"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "email": email,
        "password": password,
      }),
    );

    return {
      "statusCode": response.statusCode,
      "data": jsonDecode(response.body),
    };
  }

  Future<List<JadwalModel>> getTugasSaya() async {
    final token = await SessionService().getToken();

    final response = await http.get(
      Uri.parse("$baseUrl/jadwal/saya"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    // print(response.statusCode);
    // print(response.body);

    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);

      return data.map((e) => JadwalModel.fromJson(e)).toList();
    }

    throw Exception("Gagal mengambil data tugas");
  }
}
