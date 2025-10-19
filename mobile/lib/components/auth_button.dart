import 'package:flutter/material.dart';

class AuthButton extends StatelessWidget {
  const AuthButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(25), // adds height to the button
      margin: const EdgeInsets.symmetric(horizontal: 25),
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Center(
        child: Text(
          "Sign Up",
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          )
        )
      ),
    );
  }
}