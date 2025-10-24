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

  return await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
}

class MapPage extends StatefulWidget{
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage>{
  Position? _position;
  bool _isMapReady = false;
  GoogleMapController? _mapController;

  @override
  void initState(){
    super.initState();
    _fetchLocation();
  }

  void _fetchLocation() async{
    final pos = await getCurrentPosition();
    if (mounted){
      setState(() => _position = pos);
    }
  }

  void _onMapCreated(GoogleMapController controller){
    _mapController = controller;

    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) {
        setState(() => _isMapReady = true);
      }
    });
  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      body: _position == null
          ? const Center(child: CircularProgressIndicator())
          : Stack(
              children: [
                GoogleMap(
                  onMapCreated: _onMapCreated,
                  initialCameraPosition: CameraPosition(
                    target: LatLng(_position!.latitude, _position!.longitude),
                    zoom: 15,
                  ),
                  myLocationEnabled: true,
                  myLocationButtonEnabled: true,
                ),
                Positioned(
                  top: 60,
                  left: 16,
                  right: 16,
                  child: Row(
                    children: [
                      Expanded(
                        child: SearchBar(
                          controller: SearchController(),
                          leading: const Icon(Icons.search),
                          hintText: 'Search',
                          backgroundColor: WidgetStateProperty.all(
                            Colors.white.withOpacity(0.9),
                          ),
                          shadowColor: WidgetStateProperty.all(Colors.black),
                          elevation: WidgetStateProperty.all(4.0),
                          shape: WidgetStateProperty.all(
                            RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20.0),
                            ),
                          ),
                          padding: WidgetStateProperty.all(
                            const EdgeInsets.symmetric(horizontal: 16.0),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Material(
                        color: Colors.white.withOpacity(0.9),
                        shape: const CircleBorder(),
                        elevation: 4,
                        child: IconButton(
                          icon: const Icon(Icons.filter_list, color: Colors.black87),
                          onPressed: (){

                          },
                        ),
                      ),
                    ],
                  ),
                ),
                if (!_isMapReady)
                  Container(
                    color: Colors.white,
                    child: const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.map, size: 80, color: Colors.blue),
                          SizedBox(height: 20),
                          CircularProgressIndicator(),
                          SizedBox(height: 16),
                          Text(
                            'Loading map...',
                            style: TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
    );
  }

  @override
  void dispose() {
    _mapController?.dispose();
    super.dispose();
  }
}