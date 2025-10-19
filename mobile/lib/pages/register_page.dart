import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

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
          
          // user name textfield
          AuthTextFields(),
          // password textfield
          
          // password again
          
          // sign up
          ]),
        ),
      )
    );
  }
}