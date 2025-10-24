import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class IntroPage1 extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return Container(
      color: Colors.pink[100],
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "RSVP to Events You'll Love",
              textAlign: TextAlign.center,
              style:TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.pink[900],
              )
            ),
            Lottie.asset(
              'assets/online-appointment.json'
            ),
            Text(
              'Explore upcoming events on our interactive map and secure your spot',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                color: Colors.pink[900],
                fontWeight: FontWeight.bold
              ),
            ),
          ],
        ),
      ),
    );
  }
}