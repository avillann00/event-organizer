import 'package:flutter/material.dart';
import '../models/event.dart';

class EventDetailsPage extends StatelessWidget{
  final Event event;
  const EventDetailsPage({required this.event});

  @override 
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(event.title),
        backgroundColor: Colors.blue
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center, 
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(event.title),

              SizedBox(height: 20),

              Text(event.description),
            ]
          )
        )
      )
    );
  }
}
