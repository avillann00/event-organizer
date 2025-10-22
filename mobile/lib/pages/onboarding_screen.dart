import 'package:flutter/material.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../intro_screens/intro_page_1.dart';
import '../intro_screens/intro_page_2.dart';
import '../intro_screens/intro_page_3.dart';


class OnBoardingScreen extends StatefulWidget {
  const OnBoardingScreen({super.key});

  @override
  State<OnBoardingScreen> createState() => _OnBoardingScreenState();
}

class _OnBoardingScreenState extends State<OnBoardingScreen> {

  // this controller keeps track of what page we're on
  PageController _controller = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          PageView(
            controller: _controller,
            children: [
              IntroPage1(),
              IntroPage2(),
              IntroPage3(),
            ]
          ),
          Container(
            alignment: Alignment(0,0.75), // note to self: alignment 0,0 is in the middle
            child: SmoothPageIndicator(controller: _controller, count: 3)
            )
        ],
      ),
    );
  }
}