import 'package:shared_preferences/shared_preferences.dart';

class SessionService {
  Future<void> saveLogin({
    required String token,
    required String role,
    required String nama,
  }) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString("token", token);
    await prefs.setString("role", role);
    await prefs.setString("nama", nama);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("token");
  }

  Future<String?> getNama() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("nama");
  }

  Future<String?> getRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("role");
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
