import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RecoverEmailPage extends StatefulWidget {
  const RecoverEmailPage({super.key});

  @override
  State<RecoverEmailPage> createState() => _RecoverEmailPageState();
}

class _RecoverEmailPageState extends State<RecoverEmailPage> {
  final backupEmailController = TextEditingController();
  final passwordController = TextEditingController();
  String message = '';
  bool sent = false;

  Future<void> sendRecoveryLink(BuildContext context) async {
    if (backupEmailController.text.trim().isEmpty || 
        passwordController.text.trim().isEmpty) {
      setState(() {
        message = 'All fields are required';
      });
      return;
    }

    try {
      final response = await http.post(
        Uri.parse('https://cop4331project.dev/api/users/forgot-email'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'backupEmail': backupEmailController.text.trim(),
          'password': passwordController.text.trim()
        })
      );

      if (!context.mounted) return;

      if (response.statusCode == 200) {
        setState(() {
          sent = true;
          message = 'Email recovery link sent! Check your backup email';
        });
        debugPrint('Recovery link sent successfully');
      } else {
        setState(() {
          message = 'Error sending recovery link';
        });
        debugPrint('Error: ${response.body}');
      }
    } catch (error) {
      setState(() {
        message = 'Error sending recovery link';
      });
      debugPrint('Error sending email recovery: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text('Recover Primary Email'),
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
                Icons.email_outlined,
                size: 100,
                color: Colors.blue,
              ),

              const SizedBox(height: 20),

              if (!sent) ...[
                // Initial form
                const Text(
                  'Recover Primary Email',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 20),

                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: Text(
                    'Enter your backup email and your account password. '
                    'We\'ll send a secure recovery link to your backup email '
                    'so you can update your primary email.',
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
                  controller: passwordController,
                  hintText: 'Account password',
                  obscureText: true,
                  icon: Icons.lock,
                ),

                const SizedBox(height: 30),

                AuthButton(
                  onTap: () => sendRecoveryLink(context),
                  label: 'Send Recovery Link',
                ),
              ] else ...[
                // Success message
                const Text(
                  'Verification Sent!',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),

                const SizedBox(height: 20),

                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: Text(
                    'Check your backup email for the recovery link. '
                    'After verifying, you can continue to reset your primary email.',
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                    textAlign: TextAlign.center,
                  ),
                ),

                const SizedBox(height: 30),

                AuthButton(
                  onTap: () {
                    Navigator.pushNamed(context, '/resetEmail');
                  },
                  label: 'Continue',
                ),
              ],

              const SizedBox(height: 20),

              if (message.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: sent ? Colors.green.shade50 : Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: sent ? Colors.green : Colors.red,
                      width: 1,
                    ),
                  ),
                  child: Text(
                    message,
                    style: TextStyle(
                      color: sent ? Colors.green.shade900 : Colors.red.shade900,
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
    passwordController.dispose();
    super.dispose();
  }
}