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
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(70),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: SearchBar(
              controller: SearchController(),
              leading: const Icon(Icons.search),
              hintText: 'Search',
              backgroundColor: WidgetStateProperty.all(const Color.fromARGB(255, 187, 224, 254)),
              shadowColor: WidgetStateProperty.all(Colors.black),
              elevation: WidgetStateProperty.all(4.0),
              shape: WidgetStateProperty.all(
                RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20.0)
                ),
              ),
              padding: WidgetStateProperty.all(
                EdgeInsets.symmetric(horizontal: 16.0),
              ),
            ),
          ),
        )
      ),

      

      body: GoogleMap(initialCameraPosition: CameraPosition(
        target: LatLng(28.6024, -81.2001),
        zoom: 15,
        )
      ),
    );
  }
}