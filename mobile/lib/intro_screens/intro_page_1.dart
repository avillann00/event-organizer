import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class IntroPage1 extends StatelessWidget {
  const IntroPage1({super.key});
  @override
  Widget build(BuildContext context){
    return Container(
      color: Color(0xFFb3debf),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "RSVP to Events You'll Love",
              textAlign: TextAlign.center,
              style:TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: const Color.fromARGB(255, 11, 41, 85),
              )
            ),
            Lottie.asset(
              'assets/online-appointment.json'
            ),
            Text(
              'Explore upcoming events on our interactive map and secure your spot',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 21,
                color: const Color.fromARGB(255, 11, 41, 85),
                fontWeight: FontWeight.bold
              ),
            ),
          ],
        ),
      ),
    );
  }
}