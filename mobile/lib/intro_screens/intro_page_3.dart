import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class IntroPage3 extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return Container(
      color: Colors.blue[100],
      child: Lottie.asset(
          'assets/woman_tracked_on_phone.json'
      )
    );
  }
}