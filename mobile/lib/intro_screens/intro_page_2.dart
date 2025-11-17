import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class IntroPage2 extends StatelessWidget {
  const IntroPage2({super.key});
  @override
  Widget build(BuildContext context){
    return Container(
      color: const Color(0xFFEAF3EC),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "See What's Happening Around UCF",
              textAlign: TextAlign.center,
              style:TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.blue[900],
              )
            ),
            Lottie.asset(
              'assets/phone_location_tracking.json'
            ),
            Text(
              'Find meetups, events, and other experiences tailored to your interests',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 21,
                color: Colors.blue[900],
                fontWeight: FontWeight.bold
              ),
            ),
          ],
        ),
      ),
    );
  }
}