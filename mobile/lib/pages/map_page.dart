import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import '../components/filter_bar.dart';
import '../models/event.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

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
  final Function(List<Event>) onEventsUpdated;
  final List<Event> events;

  const MapPage({required this.events, required this.onEventsUpdated, super.key});

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage>{
  Position? _position;
  bool _isMapReady = false;
  GoogleMapController? _mapController;

  final Set<Marker> _markers = {};
  final List<Event> _events = [];


  @override
  void initState(){
    super.initState();
    _fetchLocation();
  }

  void _fetchLocation() async{
    final pos = await getCurrentPosition();
    if (mounted){
      setState(() => _position = pos);
      fetchEvents(10.0, 'All');
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

  void _loadMarkers(){
    for(var event in _events){
      _markers.add(
        Marker(
          markerId: MarkerId(event.id),
          position: LatLng(event.location['latitude'] ?? 0.0, event.location['longitude'] ?? 0.0),
          infoWindow: InfoWindow(
            title: event.title,
            snippet: event.description,
            onTap: (){
              Navigator.pushNamed(context, '/eventDetails', arguments: event);
            }
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange)
        )
      );
    }
  }

  Future<void> fetchEvents(double radius, String category) async{
    final response = await http.get(Uri.parse('http://127.0.0.1:5000/api/events?radius=$radius&category=$category'));

    if(response.statusCode == 200){
      final List data = jsonDecode(response.body);
      setState((){
        _events.clear();
        _events.addAll(data.map((e) => Event.fromJson(e)).toList());

        _markers.clear();
        _loadMarkers();
      });

      widget.onEventsUpdated(_events);
    }
    else{
      setState((){
        _events.clear();
        _markers.clear();
      });
      widget.onEventsUpdated(_events);

      print('failed to get events: ${response.statusCode}');
    }
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
                  markers: _markers,
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
                          backgroundColor: MaterialStateProperty.all(
                            Colors.white.withOpacity(0.9),
                          ),
                          shadowColor: MaterialStateProperty.all(Colors.black),
                          elevation: MaterialStateProperty.all(4.0),
                          shape: MaterialStateProperty.all(
                            RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20.0),
                            ),
                          ),
                          padding: MaterialStateProperty.all(
                            const EdgeInsets.symmetric(horizontal: 16.0),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Material(
                        color: Colors.white.withValues(alpha: 0.9),
                        shape: const CircleBorder(),
                        elevation: 4,
                        child: IconButton(
                          icon: const Icon(Icons.filter_list, color: Colors.black87),
                          onPressed: (){
                            showModalBottomSheet(
                              context: context,
                              backgroundColor: Colors.white,
                              shape: const RoundedRectangleBorder(
                                borderRadius: BorderRadius.vertical(top: Radius.circular(20))
                              ),
                              builder: (context) => FilterBar(
                                onApply: (radius, category){
                                  fetchEvents(double.parse(radius ?? '0'), category ?? '');
                                }
                              )
                            );
                          }
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
