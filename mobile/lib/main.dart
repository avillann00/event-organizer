import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context){
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        backgroundColor: Colors.blue[100],
        appBar: AppBar(
          title: Center(
            child: Text(
              "Event Organizer",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              )
              ),
          ),
          leading: Icon(
            Icons.menu,
            color: Colors.white,
          ),
          actions: [IconButton(onPressed: () {}, 
          icon: Icon(
            Icons.logout,
            color: Colors.white,
            ))
          ],
          backgroundColor: Colors.blueAccent,
        ),
        body: Center(
          child: Container(
            height: 300,
            width: 300,
            decoration: BoxDecoration(
              color: Colors.blueAccent,
              borderRadius: BorderRadius.circular(20),
            ),
            padding: EdgeInsets.all(25),
            child: Text(
              "Event Organizer",
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
              )
            )
          ),
        ),
      )
    );
  }
}