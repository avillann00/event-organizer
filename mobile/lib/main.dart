import 'package:flutter/material.dart';
import 'package:mobile/pages/register_page.dart';
import 'package:mobile/pages/user_homepage.dart';
import 'package:mobile/pages/onboarding_screen.dart';
import 'pages/login_page.dart';
import 'pages/event_details.dart';
import 'models/event.dart';
import 'pages/create_event_page.dart';
import 'pages/password_reset.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Event Organizer',
      debugShowCheckedModeBanner: false,
      home: OnBoardingScreen(),
      routes: {
        '/onBoardingPage': (context) => OnBoardingScreen(),
        '/userHomePage': (context) => UserHomePage(),
        '/login': (context) => LoginPage(),
        '/register': (context) => RegisterPage(),
        '/createEvent': (context) => CreateEventPage(),
        '/resetPassword': (context) => PasswordReset(),
      },
      onGenerateRoute: (settings){
        if(settings.name == '/eventDetails'){
          final event = settings.arguments as Event;
          return MaterialPageRoute(
            builder: (context) => EventDetailsPage(event: event)
          );
        }
        return null;
      }
    );
  }
}
