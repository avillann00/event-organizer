import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class IntroPage1 extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return Container(
      color: Colors.pink[100],
      child: Center(
        child: Lottie.asset(
          'assets/online-appointment.json'
        )
      )
    );
  }
}