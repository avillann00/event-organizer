import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';

Future<bool> _requestPermission() async{
  LocationPermission permission = await Geolocator.checkPermission();
  if(permission == LocationPermission.denied){
    permission = await Geolocator.requestPermission();
  }
  return permission == LocationPermission.whileInUse || permission == LocationPermission.always;
}

Future<Position?> getCurrentPosition() async{
  final hasPermission = await _requestPermission();
  if(!hasPermission){
    return null;
  }

  final serviceEnabled = await Geolocator.isLocationServiceEnabled();
  if(!serviceEnabled){
    return null;
  }

  return await Geolocator.getCurrentPosition(
    desiredAccuracy: LocationAccuracy.high,
  );
}

class UserHomePage extends StatefulWidget {
  const UserHomePage({super.key});

  @override
  State<UserHomePage> createState() => _UserHomePageState();
}

class _UserHomePageState extends State<UserHomePage> {
  Position? _position;

  @override
  void initState(){
    super.initState();
    _fetchLocation();
  }

  void _fetchLocation() async{
    final pos = await getCurrentPosition();
    setState(() => _position = pos);
  }

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

      body: _position == null
        ? Center(child: CircularProgressIndicator())
        : GoogleMap(
            initialCameraPosition: CameraPosition(
              target: LatLng(_position!.latitude, _position!.longitude),
            zoom: 15,
            ),
            myLocationEnabled: true,
            myLocationButtonEnabled: true
          ),
    );
  }
}
