import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';
import 'package:mobile/pages/onboarding_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import '../forms/user_register_form.dart';
import '../forms/organizer_register_form.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  bool isOrganizer = false;

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          const SizedBox(height: 20),

          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ToggleButtons(
              borderRadius: BorderRadius.circular(20),
              fillColor: Colors.blue,
              selectedColor: Colors.white,
              isSelected: [!isOrganizer, isOrganizer],
              onPressed: (index){
                setState((){
                  isOrganizer = index == 1;
                });
              },
              children: const [
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: Text('User      ')
                ),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: Text('Organizer')
                )
              ]
            )
          ),

          const SizedBox(height: 10),

          Icon(
            Icons.account_circle,
            size: 100,
            color: Colors.blue,
          ),

          const SizedBox(height: 50),

          Text(
            "Welcome to the Event Organizer App",
            style: TextStyle(
              color: Colors.grey[700],
              fontSize: 18,
            ),
          ),

          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 400),
              transitionBuilder: (Widget child, Animation<double> animation){
                final offsetAnimation = Tween<Offset>(
                  begin: const Offset(1.0, 0.0),
                  end: Offset.zero
                ).animate(animation);

                return SlideTransition(
                  position: offsetAnimation,
                  child: child
                );
              },
              child: isOrganizer
                ? const OrganizerRegistrationForm(key: ValueKey('organizer'))
                : const UserRegistrationForm(key: ValueKey('user'))
            )
          ),

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
        ]
      )
    );
  }
}

