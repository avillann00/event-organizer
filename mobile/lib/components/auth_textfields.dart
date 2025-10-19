import 'package:flutter/material.dart';

class AuthTextFields extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final bool obscureText;

  const AuthTextFields({
    super.key,
    required this.controller, // this is what we use to access what user typed into the text field
    required this.hintText, // placeholder text
    required this.obscureText, // obscures text ex. password
  });
    
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25.0),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        decoration: InputDecoration(
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.white),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.grey.shade400),
          ),
            fillColor: Colors.grey.shade200,
            filled: true,
            hintText: hintText,
            hintStyle: TextStyle(color: Colors.grey[500])
        ),
      ),
    );
  }
}