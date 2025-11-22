import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/event.dart';

class OrganizerEvents extends StatefulWidget{
  const OrganizerEvents({super.key});

  @override
  State<OrganizerEvents> createState() => _OrganizerEventsState();
}

class _OrganizerEventsState extends State<OrganizerEvents>{
  String? userId;
  List<Event> events = [];

  @override
  void initState(){
    super.initState();
    loadUserData();
  }

  Future<void> loadUserData() async{
    final prefs = await SharedPreferences.getInstance();

    setState((){
      userId = prefs.getString('userId');
    });

    getEvents();
  }

  Future<void> getEvents() async{
    http.Response response = await http.get(Uri.parse('https://cop4331project.dev/api/events/?organizerId=${Uri.encodeComponent(userId!)}'));

    if(response.statusCode == 200){
      final body = jsonDecode(response.body);
      final List data = body['data'];

      setState((){
        events
          ..clear()
          ..addAll(data.map((e) => Event.fromJson(e)).toList());
      });
    }
    else{
      print('error getting organizers events: $response.statusCode');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Your Events"),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: events.isEmpty
            ? const Center(
                child: Text(
                  "You haven't created any events.",
                  style: TextStyle(fontSize: 18),
                ),
              )
            : ListView.builder(
                itemCount: events.length,
                itemBuilder: (context, index) {
                  return EventCard(event: events[index]);
                },
              ),
      ),
    );
  }
}

class EventCard extends StatelessWidget {
  final Event event;

  const EventCard({super.key, required this.event});

  @override
  Widget build(BuildContext context){
    return Card(
      color: Colors.white,
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              event.title ?? "Untitled Event",
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Text(event.description ?? "No description."),

            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.location_on, size: 18, color: Colors.blue),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    event.address ?? "No address",
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.people, size: 18, color: Colors.blue),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    "Capacity: ${event.capacity}",
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),

            IconButton(
              icon: const Icon(Icons.camera_alt),
              onPressed: (){
                Navigator.pushNamed(context, '/checkin', arguments: event.id);
              },
            ),
          ],
        ),
      ),
    );
  }
}
