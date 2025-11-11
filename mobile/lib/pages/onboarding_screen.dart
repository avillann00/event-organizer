import 'package:flutter/material.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../intro_screens/intro_page_1.dart';
import '../intro_screens/intro_page_2.dart';
import '../intro_screens/intro_page_3.dart';
import 'package:mobile/pages/register_page.dart';


class OnBoardingScreen extends StatefulWidget {
  const OnBoardingScreen({super.key});

  @override
  State<OnBoardingScreen> createState() => _OnBoardingScreenState();
}

class _OnBoardingScreenState extends State<OnBoardingScreen> {

  // this controller keeps track of what page we're on
  final PageController _controller = PageController();

  bool onLastPage = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          PageView(
            controller: _controller,
            onPageChanged: (index) {
              setState(() {
                onLastPage = (index == 2); // returns true if we're on the last page
              });
            },
            children: [
              IntroPage2(),
              IntroPage1(),
              IntroPage3(),
            ]
          ),
          Container(
            alignment: Alignment(0,0.75), // note to self: alignment 0,0 is in the middle
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // skip button
                GestureDetector(
                  onTap: () {
                    _controller.jumpToPage(2);
                  },
                  child: Text('skip')
                ),
                SmoothPageIndicator(controller: _controller, count: 3),

                // next or done if it's the 3rd page
                onLastPage ?
                GestureDetector(
                   onTap: () {
                    Navigator.push(
                      context, 
                      MaterialPageRoute(
                        builder: (context) {
                          return RegisterPage();
                        },
                      ),
                    );
                  },
                  child: Text('done')
                ) :
                
                GestureDetector(
                   onTap: () {
                    _controller.nextPage(
                      duration: Duration(milliseconds: 500),
                      curve: Curves.easeIn,
                    );
                  },
                  child: Text('next')
                )
              ], 
            )
            )
        ],
      ),
    );
  }
}