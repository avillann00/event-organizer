import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class IntroPage2 extends StatelessWidget {
  const IntroPage2({super.key});
  @override
  Widget build(BuildContext context){
    return Container(
      color: Colors.purple[100],
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "See What's Happening Around UCF",
              textAlign: TextAlign.center,
              style:TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.purple[900],
              )
            ),
            Lottie.asset(
              'assets/phone_location_tracking.json'
            ),
            Text(
              'Find meetups, events, and other experiences tailored to your interests',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                color: Colors.purple[900],
                fontWeight: FontWeight.bold
              ),
            ),
          ],
        ),
      ),
    );
  }
}