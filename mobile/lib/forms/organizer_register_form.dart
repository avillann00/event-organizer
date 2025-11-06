import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';
import 'package:mobile/pages/onboarding_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

class OrganizerRegistrationForm extends StatefulWidget{
  const OrganizerRegistrationForm({Key? key}) : super(key: key);

  @override
  State<OrganizerRegistrationForm> createState() => _OrganizerRegistrationFormState();
}

class _OrganizerRegistrationFormState extends State<OrganizerRegistrationForm>{
  final organizationNameController = TextEditingController();
  final organizationEmailController = TextEditingController();
  final passwordController = TextEditingController();
  final passwordConfirmController = TextEditingController();

  Future<void> signUpUser(BuildContext context) async{
    if(organizationNameController.text == '' || organizationEmailController.text == '' || passwordController.text == '' || passwordConfirmController.text == ''){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please fill in all fields"))
      );
      debugPrint('missing fields');
      return;
    }

    if(passwordController.text != passwordConfirmController.text){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Passwords do not match, please try again"))
      );
      debugPrint('passwords do not match');
      return;
    }

    final response = await http.post(
      Uri.parse('http://localhost:5000/api/users/register/organizer'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'organizationName': organizationNameController.text,
        'email': organizationEmailController.text,
        'password': passwordController.text,
        'confirmPassword': passwordConfirmController.text
      })
    );

    if (!context.mounted) return;
    
    if(response.statusCode == 200 || response.statusCode == 201){
      debugPrint('user registered: ${response.body}');

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
              controller: organizationNameController,
              hintText: 'Organization Name',
              obscureText: false,
              icon: Icons.person,
            ),

            SizedBox(height: 10),

            AuthTextFields(
              controller: organizationEmailController,
              hintText: 'Organization Email',
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
              controller: passwordConfirmController,
              hintText: 'Confirm Password',
              obscureText: true,
              icon: Icons.lock,
            ),
        
            SizedBox(height: 60),

            AuthButton(
              onTap: () => signUpUser(context),
              label: 'Sign Up',
            ),
          ]
        )
      )
    );
  }
}
