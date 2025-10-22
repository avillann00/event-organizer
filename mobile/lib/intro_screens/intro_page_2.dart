import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class IntroPage2 extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return Container(
      color: Colors.purple[100],
      child: Center(
        child: Lottie.asset(
          'assets/phone_location_tracking.json'
        )
      )
    );
  }
}