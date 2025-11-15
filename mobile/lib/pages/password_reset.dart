import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

class PasswordReset extends StatefulWidget{
  const PasswordReset({super.key});

  @override
  State<PasswordReset> createState() => _PasswordResetState();
}

class _PasswordResetState extends State<PasswordReset>{
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController passwordConfirmController = TextEditingController();

  bool verified = false;
  String inputEmail = '';

  Future<void> SendResetEmail(BuildContext context) async{
    if(emailController.text.trim() == ''){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please fill in all fields'))
      );

      return;
    }

    final response = await http.post(
      Uri.parse('https://cop4331project.dev/api/users/forgot-password'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': emailController.text.trim(),
      })
    );

    if(response.statusCode == 200){
      setState((){
        inputEmail = emailController.text.trim();
        verified = true;
      });
    }
    else{
       ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('There was an error sending the email'))
      );
    }
  }

  Future<void> ResetPassword(BuildContext context) async{
    if(passwordController.text.trim() == '' || passwordConfirmController.text.trim() == ''){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please fill in all fields'))
      );

      return;
    }

    if(passwordController.text.trim() != passwordConfirmController.text.trim()){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Passwords do not match'))
      );

      return;
    }
    final response = await http.post(
      Uri.parse('https://cop4331project.dev/api/users/reset-password'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': inputEmail,
        'newPassword': passwordController.text.trim(),
        'confirmPassword': passwordConfirmController.text.trim()
      })
    );

    if(response.statusCode == 200){
       ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Password has been reset'))
      );
      Navigator.pushNamed(context, '/login');
    }
    else{
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('There was an error resetting the password. Ensure that you have followed the email instructions'))
      );
    }
  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Text('Password Reset')
      ),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if(verified)...[
                Text('Email sent! Follow the instructions then enter a new password and confirm'),

                const SizedBox(height: 20),

                AuthTextFields(
                  controller: passwordController,
                  hintText: 'Password',
                  obscureText: true,
                  icon: Icons.lock,
                ),

                const SizedBox(height: 20),

                AuthTextFields(
                  controller: passwordConfirmController,
                  hintText: 'Confirm Password',
                  obscureText: true,
                  icon: Icons.lock,
                ),

                const SizedBox(height: 20),

                AuthButton(
                  onTap: () => ResetPassword(context),
                  label: 'Reset'
                ),

              ] 
              else...[
                Text('Enter your email to reset your password'),

                const SizedBox(height: 20),

                AuthTextFields(
                  controller: emailController,
                  hintText: 'Email',
                  obscureText: false, 
                  icon: Icons.email,
                ),

                const SizedBox(height: 20),

                AuthButton(
                  onTap: () => SendResetEmail(context),
                  label: 'Send Email'
                ),
              ],
            ],
          )
        )
      )
    );
  }
}
