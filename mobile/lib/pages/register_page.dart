import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';
import 'package:mobile/pages/onboarding_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

class RegisterPage extends StatelessWidget {
  RegisterPage({super.key});

  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final passwordAgainController = TextEditingController();

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
      Uri.parse('http://64.23.213.176:5000/api/users/register/user'),
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
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(height: 40),
                Icon(
                  Icons.account_circle,
                  size: 100,
                  color: Colors.blue,
                ),

                SizedBox(height: 50),

                Text(
                  "Welcome to the Event Organizer App",
                  style: TextStyle(
                    color: Colors.grey[700],
                    fontSize: 18,
                  ),
                ),

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
                // password textfield
                AuthTextFields(
                  controller: passwordController,
                  hintText: 'Password',
                  obscureText: true,
                  icon: Icons.lock,
                ),

                SizedBox(height: 10),
                // password textfield
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

                Divider(),

                SizedBox(height: 50),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Already have an account?',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 16,
                      ),
                    ),

                    const SizedBox(width: 4),

                    GestureDetector(
                      onTap: (){
                        Navigator.pushNamed(context, '/login');
                      },
                      child: Text(
                        'Sign In instead',
                        style: TextStyle(
                          color: Colors.blue,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 4),
                    // temporary routing back to onbaording
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context, 
                      MaterialPageRoute(
                        builder: (context) {
                          return OnBoardingScreen();
                        },
                      ),
                    );
                  },
                  child: Text('back to onboarding')
                ),
            ]),
          ),
        ),
      ),
    );
  }
}
