import 'package:flutter/material.dart';
import 'package:mobile/pages/register_page.dart';
import 'package:mobile/pages/user_homepage.dart';
import 'package:mobile/pages/onboarding_screen.dart';
import 'pages/login_page.dart';
import 'pages/event_details.dart';
import 'models/event.dart';
import 'pages/create_event_page.dart';
import 'pages/password_reset.dart';
import 'pages/user_rsvps.dart';
import 'pages/organizer_events.dart';
import 'pages/rsvp_details.dart';
import 'models/rsvp.dart';
import 'pages/checkin.dart';
import 'pages/recover_email_page.dart';
import 'pages/reset_email_page.dart';
import 'pages/edit_event_page.dart';

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
        '/recoverEmail': (context) => RecoverEmailPage(),
        '/resetEmail': (context) => ResetEmailPage(),
        '/userRsvps': (context) => UserRsvps(),
        '/orgEvents': (context) => OrganizerEvents(),
        '/editEvent': (context) => EditEventPage(),
      },
      onGenerateRoute: (settings){
        if(settings.name == '/eventDetails'){
          final event = settings.arguments as Event;
          return MaterialPageRoute(
            builder: (context) => EventDetailsPage(event: event)
          );
        }
        if(settings.name == '/rsvpDetails'){
          final rsvp = settings.arguments as Rsvp;
          return MaterialPageRoute(
            builder: (context) => RsvpDetails(rsvp: rsvp)
          );
        }
        if(settings.name == '/checkin'){
          final eventId = settings.arguments as String;
          return MaterialPageRoute(
            builder: (context) => Checkin(eventId: eventId)
          );
        }
        return null;
      }
    );
  }
}
