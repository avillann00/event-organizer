import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  Future<void> loginUser(BuildContext context) async{
    if(emailController.text == '' || passwordController.text == ''){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please fill in all fields"))
      );
      debugPrint('missing fields');
      return;
    }

    final response = await http.post(
      Uri.parse('http://127.0.0.1:5000/api/users/login/user'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': emailController.text,
        'password': passwordController.text
      })
    );
    
    if (!context.mounted) return;

    if(response.statusCode == 200 || response.statusCode == 201){
      debugPrint('login successful: ${response.body}');
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
        padding: EdgeInsets.all(20),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(height: 40),

              Icon(
                Icons.account_circle,
                size: 100,
                color: Colors.blue,
              ),

              SizedBox(height: 10),

              AuthTextFields(
                controller: emailController,
                hintText: 'Email',
                obscureText: false,
                icon: Icons.email,
              ),

              SizedBox(height: 10),

              AuthTextFields(
                controller: passwordController,
                hintText: 'Password',
                obscureText: true,
                icon: Icons.lock,
              ),

              SizedBox(
                height: 60
              ),

              AuthButton(
                onTap: () => loginUser(context),
                label: 'Login'
              ),

              SizedBox(height: 35),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Need an account?',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                    ),
                  ),

                  const SizedBox(width: 4),

                  GestureDetector(
                    onTap: (){
                      Navigator.pushNamed(context, '/register');
                    },
                    child: Text(
                      'Register instead',
                      style: TextStyle(
                        color: Colors.blue,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ],
              )
            ],
          )
        )
      ),
    );
  }
}
