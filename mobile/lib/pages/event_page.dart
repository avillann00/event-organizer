import 'package:flutter/material.dart';
import '../models/event.dart';
import 'package:intl/intl.dart';

class EventPage extends StatefulWidget {
  final List<Event> events;

  const EventPage({required this.events, super.key});

  @override
  State<EventPage> createState() => _EventPageState();
}

class _EventPageState extends State<EventPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xff2c3e50), Color(0xff000000)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: widget.events.isEmpty 
          ? const Center(child: Text('No events available yet', style: TextStyle(color: Colors.white, fontSize: 16))) : ListView.builder(
            itemCount: widget.events.length,
            itemBuilder: (context, index) {
              final event = widget.events[index];
              
              return GestureDetector(
                  onTap: (){
                    Navigator.pushNamed(context, '/eventDetails', arguments: event);
                  },
                  child: Container(
                    margin: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black26,
                          blurRadius: 8,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // styling for the event's image
                            ClipRRect(
                              borderRadius: BorderRadius.only(
                                // this adds borders to the top corners only
                                topLeft: Radius.circular(16),
                                topRight: Radius.circular(16),
                              ),
                              child: event.media.isNotEmpty 
                                ? Image.network(
                                    event.media[0],
                                    height: 150,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                  ) 
                                : Container(
                                    height: 150,
                                    width: double.infinity,
                                    color: Colors.grey.shade300,
                                    child: const Icon(Icons.image_not_supported, size: 50, color: Colors.grey),
                                  ),
                            ),
                        Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // referencing https://api.flutter.dev/flutter/package-intl_intl/DateFormat-class.html to use intl package
                              Text(
                                '${DateFormat('EEEE, d MMMM').format(event.startTime)} | ${DateFormat('h:mm a').format(event.startTime)}',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey.shade500,
                                ),
                              ),
                              SizedBox(height: 8),

                              Text(
                                event.title,
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(height: 8),

                              // Location
                              Row(
                                children: [
                                  Icon(Icons.location_on, size: 16, color: Colors.grey.shade400),
                                  SizedBox(width: 4),
                                  Text(
                                    event.address ??
                                            'No address provided',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade500,
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 16),

                              Row(
                                children: [
                                  // Keywords
                                  Expanded(
                                    child: Wrap(
                                      spacing: 8,
                                      children: event.keywords.map((keyword) {
                                        return Container(
                                          padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                          decoration: BoxDecoration(
                                            color: Colors.grey.shade100,
                                            borderRadius: BorderRadius.circular(16),
                                          ),
                                          child: Text(
                                            '#$keyword',
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey.shade600,
                                            ),
                                          ),
                                        );
                                      }).toList(),
                                    ),
                                  ),
                                  // Price
                                  Container(
                                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: Colors.blue,
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      // if the price is 0 just mark it as free
                                      (event.ticketPrice == null ||
                                                event.ticketPrice == 0)
                                            ? 'Free'
                                            : '\$${event.ticketPrice!.toStringAsFixed(0)}',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
              );
            },
        ),
      ),
    );
  }
}
