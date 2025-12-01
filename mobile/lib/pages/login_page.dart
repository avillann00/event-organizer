import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  Future<void> loginUser(BuildContext context) async{
    if(emailController.text.trim() == '' || passwordController.text.trim() == ''){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please fill in all fields"))
      );
      debugPrint('missing fields');
      return;
    }

    final response = await http.post(
      Uri.parse('https://cop4331project.dev/api/users/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': emailController.text.trim(),
        'password': passwordController.text.trim()
      })
    );
    
    if (!context.mounted) return;

    if(response.statusCode == 200 || response.statusCode == 201){
      debugPrint('login successful: ${response.body}');

      final responseData = jsonDecode(response.body);
      final userData = responseData['data']['user'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('isLoggedIn', true);
      await prefs.setString('userId', userData['id']);
      await prefs.setString('userName', userData['name']);
      await prefs.setString('userEmail', userData['email']);
      await prefs.setString('userRole', userData['role']);
      await prefs.setString('token', responseData['data']['token']);

      Navigator.pushNamed(context, '/userHomePage');
    }
    else{
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("There was an error logging in"))
      );
      debugPrint('login error: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Text('Login')
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),

              const Icon(
                Icons.account_circle,
                size: 100,
                color: Colors.blue,
              ),

              const SizedBox(height: 10),

              AuthTextFields(
                controller: emailController,
                hintText: 'Email',
                obscureText: false,
                icon: Icons.email,
              ),

              const SizedBox(height: 10),

              AuthTextFields(
                controller: passwordController,
                hintText: 'Password',
                obscureText: true,
                icon: Icons.lock,
              ),

              const SizedBox(height: 60),

              AuthButton(
                onTap: () => loginUser(context),
                label: 'Login',
              ),

              const SizedBox(height: 35),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Need an account?',
                    style: TextStyle(color: Colors.black, fontSize: 16),
                  ),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushNamed(context, '/register');
                    },
                    child: const Text(
                      'Register instead',
                      style: TextStyle(color: Colors.blue, fontSize: 16),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 10),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Forgot your password?',
                    style: TextStyle(color: Colors.black, fontSize: 16),
                  ),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushNamed(context, '/resetPassword');
                    },
                    child: const Text(
                      'Reset Password',
                      style: TextStyle(color: Colors.blue, fontSize: 16),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 10),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Forgot your email?',
                    style: TextStyle(color: Colors.black, fontSize: 16),
                  ),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushNamed(context, '/recoverEmail');
                    },
                    child: const Text(
                      'Recover Email',
                      style: TextStyle(color: Colors.blue, fontSize: 16),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
