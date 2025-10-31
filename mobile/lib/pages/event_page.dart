import 'package:flutter/material.dart';

class EventPage extends StatefulWidget{
  const EventPage({super.key});

  @override
  State<EventPage> createState() => _EventPageState();
}

class _EventPageState extends State<EventPage> {
  List<String> events = [];
  @override
  Widget build(BuildContext context) {
    debugPrint('🎯 EventPage building');
    return Scaffold(
      backgroundColor: Colors.amber,
      body: Column(
        children: [
          SizedBox(height: 40),

          Text('This is the Event Page'),

          ElevatedButton(
            child: Text('Create event'),
            onPressed: (){
              Navigator.pushNamed(context, '/createEvent');
            }
          ),
        ]
      ),
    );
  }
}
