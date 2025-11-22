import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/rsvp.dart';

class UserRsvps extends StatefulWidget{
  const UserRsvps({super.key});

  @override
  State<UserRsvps> createState() => _UserRsvpsState();
}

class _UserRsvpsState extends State<UserRsvps>{
  String? userId;
  final List<Rsvp> rsvps = [];
  
  @override
  void initState(){
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async{
    final prefs = await SharedPreferences.getInstance();
    setState((){
      userId = prefs.getString('userId') ?? '';
    });

    getRsvps();
  }

  Future<void> getRsvps() async{
    http.Response response = await http.get(Uri.parse('https://cop4331project.dev/api/rsvp/?userId=$userId'));

    if(response.statusCode == 200){
      final body = jsonDecode(response.body);
      final List data = body['data'];

      setState((){
        rsvps
          ..clear()
          ..addAll(data.map((r) => Rsvp.fromJson(r)).toList());
      });
    }
    else{
      print('error getting rsvps: ${response.statusCode}');
    }
  }
  
  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Your RSVP\'s'),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
        child: Column(
          children: [
          rsvps.isEmpty 
            ? const Text('You have not RSVP\'d to any events yet')
            : Expanded(
                child: ListView.builder(
                  itemCount: rsvps.length,
                  itemBuilder: (context, index) {
                    final rsvp = rsvps[index];
                    return RsvpCard(rsvp: rsvp);
                  },
                ),
              )
          ]
        )
      )
    );
  }
}

class RsvpCard extends StatelessWidget{
  final Rsvp rsvp;
  final VoidCallback? onNavigateBack;

  const RsvpCard({
    super.key,
    required this.rsvp,
    this.onNavigateBack,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: (){
        Navigator.pushNamed(context, '/rsvpDetails', arguments: rsvp).then((_) {
          onNavigateBack?.call();
        });
      },

      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),

        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                (rsvp.eventId.media != null &&
                        rsvp.eventId.media.isNotEmpty &&
                        rsvp.eventId.media[0] != null)
                    ? rsvp.eventId.media[0]
                    : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg', 
                width: 70,      
                height: 70,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    width: 70,
                    height: 70,
                    color: Colors.grey.shade200,
                    child: const Icon(Icons.event, size: 32, color: Colors.grey),
                  );
                },
              ),
            ),

            const SizedBox(width: 16),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  Text(
                    rsvp.eventId.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 6),

                  Text(
                    rsvp.eventId.address ?? 'Unknown location',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey.shade600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 6),

                  Text(
                    'Status: ${rsvp.status}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: Colors.blueAccent,
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
