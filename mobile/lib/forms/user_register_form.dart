import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';
import 'package:mobile/pages/onboarding_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

class UserRegistrationForm extends StatefulWidget{
  const UserRegistrationForm({Key? key}) : super(key: key);

  @override
  State<UserRegistrationForm> createState() => _UserRegistrationFormState();
}

class _UserRegistrationFormState extends State<UserRegistrationForm>{

  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final passwordAgainController = TextEditingController();

  @override
  void dispose(){
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    passwordAgainController.dispose();

    super.dispose();
  }

  Future<void> signUpUser(BuildContext context) async{
    if(nameController.text == '' || emailController.text == '' || passwordController.text == '' || passwordAgainController.text == ''){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please fill in all fields"))
      );
      debugPrint('missing fields');
      return;
    }

    if(passwordController.text != passwordAgainController.text){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Passwords do not match, please try again"))
      );
      debugPrint('passwords do not match');
      return;
    }

    final response = await http.post(
      Uri.parse('http://127.0.0.1:5000/api/users/register/user'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': nameController.text,
        'email': emailController.text,
        'password': passwordController.text,
        'confirmPassword': passwordAgainController.text
      })
    );

    if (!context.mounted) return;
    
    if(response.statusCode == 200 || response.statusCode == 201){
      debugPrint('user registered: ${response.body}');
      Navigator.pushNamed(context, '/userHomePage');
    }
    else{
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Registration failed"))
      );
      debugPrint('registration failed: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context){
    return SingleChildScrollView(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: 35),
        
            AuthTextFields(
              controller: nameController,
              hintText: 'Full Name',
              obscureText: false,
              icon: Icons.person,
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

            SizedBox(height: 10),
            AuthTextFields(
              controller: passwordAgainController,
              hintText: 'Confirm Password',
              obscureText: true,
              icon: Icons.lock,
            ),
        
            SizedBox(height: 60),
            AuthButton(
              onTap: () => signUpUser(context),
              label: 'Sign Up',
            ),

            SizedBox(height: 25),
        ]),
      ),
    );
  }
}


