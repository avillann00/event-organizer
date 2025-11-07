import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class IntroPage3 extends StatelessWidget {
  const IntroPage3({super.key});
  @override
  Widget build(BuildContext context){
    return Container(
      color: Colors.blue[100],
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Connect and Join our Community",
              textAlign: TextAlign.center,
              style:TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.blue[900],
              )
            ),
            Lottie.asset(
              'assets/woman_tracked_on_phone.json'
            ),
            Text(
              'Attend events and make lasting connections with people who share your interests',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
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