import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

class ResetEmailPage extends StatefulWidget {
  const ResetEmailPage({super.key});

  @override
  State<ResetEmailPage> createState() => _ResetEmailPageState();
}

class _ResetEmailPageState extends State<ResetEmailPage> {
  final backupEmailController = TextEditingController();
  final newEmailController = TextEditingController();
  String message = '';

  Future<void> resetEmail(BuildContext context) async {
    if (backupEmailController.text.trim().isEmpty || 
        newEmailController.text.trim().isEmpty) {
      setState(() {
        message = 'All fields are required';
      });
      return;
    }

    try {
      final response = await http.post(
        Uri.parse('https://cop4331project.dev/api/users/reset-email'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'backupEmail': backupEmailController.text.trim(),
          'newEmail': newEmailController.text.trim()
        })
      );

      if (!context.mounted) return;

      if (response.statusCode == 200) {
        setState(() {
          message = 'Email changed successfully!';
        });
        debugPrint('Email reset successful');

        // Navigate to login after 1.5 seconds
        Timer(const Duration(milliseconds: 1500), () {
          if (context.mounted) {
            Navigator.pushNamed(context, '/login');
          }
        });
      } else {
        setState(() {
          message = 'Error resetting email. Make sure you verified the link from backup email.';
        });
        debugPrint('Error: ${response.body}');
      }
    } catch (error) {
      setState(() {
        message = 'Error resetting email. Make sure you verified the link from backup email.';
      });
      debugPrint('Error resetting email: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text('Reset Primary Email'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),

              const Icon(
                Icons.mark_email_read_outlined,
                size: 100,
                color: Colors.blue,
              ),

              const SizedBox(height: 20),

              const Text(
                'Reset Primary Email',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 20),

              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 10),
                child: Text(
                  'Enter your backup email and the new primary email you want to use. '
                  'Make sure you have already clicked the verification link sent to your backup email.',
                  style: TextStyle(fontSize: 16, color: Colors.grey),
                  textAlign: TextAlign.center,
                ),
              ),

              const SizedBox(height: 30),

              AuthTextFields(
                controller: backupEmailController,
                hintText: 'Backup email',
                obscureText: false,
                icon: Icons.email,
              ),

              const SizedBox(height: 10),

              AuthTextFields(
                controller: newEmailController,
                hintText: 'New primary email',
                obscureText: false,
                icon: Icons.email_outlined,
              ),

              const SizedBox(height: 30),

              AuthButton(
                onTap: () => resetEmail(context),
                label: 'Reset Email',
              ),

              const SizedBox(height: 20),

              if (message.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: message.contains('successfully') 
                        ? Colors.green.shade50 
                        : Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: message.contains('successfully') 
                          ? Colors.green 
                          : Colors.red,
                      width: 1,
                    ),
                  ),
                  child: Text(
                    message,
                    style: TextStyle(
                      color: message.contains('successfully') 
                          ? Colors.green.shade900 
                          : Colors.red.shade900,
                      fontSize: 14,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    backupEmailController.dispose();
    newEmailController.dispose();
    super.dispose();
  }
}