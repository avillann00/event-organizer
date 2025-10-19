import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';

class RegisterPage extends StatelessWidget {
  RegisterPage({super.key});

  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final passwordAgainController = TextEditingController();

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.grey[300],
      body: SafeArea(
        child: Center(
          child: Column(
            children: [
              SizedBox(height: 50),
              Icon(
                Icons.lock,
                size: 100,
              ),

              SizedBox(height: 50),

              Text(
                "Welcome to the Event Organizer App",
                style: TextStyle(
                  color: Colors.grey[700],
                  fontSize: 18,
                ),
              ),

              SizedBox(height: 25),
          
              AuthTextFields(
                controller: nameController,
                hintText: 'Full Name',
                obscureText: false,
              ),

              SizedBox(height: 10),
              AuthTextFields(
                controller: emailController,
                hintText: 'Email',
                obscureText: false,
              ),

              SizedBox(height: 10),
              // password textfield
              AuthTextFields(
                controller: passwordController,
                hintText: 'Password',
                obscureText: true,
              ),

              SizedBox(height: 10),
              // password textfield
              AuthTextFields(
                controller: passwordAgainController,
                hintText: 'Confirm Password',
                obscureText: true,
              ),
          
              SizedBox(height: 25),
              // Placing signup button here

              SizedBox(height: 10),
              Text(
                'Sign In instead',
                style: TextStyle(color: Colors.blue),
              )
          ]),
        ),
      )
    );
  }
}