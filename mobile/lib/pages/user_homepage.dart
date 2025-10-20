import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class UserHomePage extends StatefulWidget {
  const UserHomePage({super.key});

  @override
  State<UserHomePage> createState() => _UserHomePageState();
}

class _UserHomePageState extends State<UserHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Event Organizer"),
        backgroundColor: Colors.blueAccent,
      ),
      body: GoogleMap(initialCameraPosition: CameraPosition(
        target: LatLng(28.6024, -81.2001),
        zoom: 15,
        )
      ),
    );
  }
}