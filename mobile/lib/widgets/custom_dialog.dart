import 'package:flutter/material.dart';

class CustomDialog {
  static Future<void> success(
    BuildContext context,
    String message,
  ) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        title: const Text("Berhasil"),
        content: Text(message),
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
  }

  static Future<void> error(
    BuildContext context,
    String message,
  ) {
    return showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Gagal"),
        content: Text(message),
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
  }

  static Future<void> loading(BuildContext context) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
