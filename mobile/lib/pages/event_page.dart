import 'package:flutter/material.dart';
import '../models/event.dart';
import 'package:intl/intl.dart';

class EventPage extends StatefulWidget {
  @override
  State<EventPage> createState() => _EventPageState();
}

class _EventPageState extends State<EventPage> {
  final List<Event> events = [
    Event(
      id: '1',
      title: 'HAPCO Jazz Clinic Ocoee',
      description: 'Jazz clinic for middle & high school students with UF and UCF jazz studies professors',
      keywords: ['Music'],
      startTime: DateTime(2025, 1, 24, 9, 30),
      endTime: DateTime(2025, 1, 24, 15, 30),
      location: {'address': '1925 Ocoee Crown Pt Pkwy'},
      address: '1925 Ocoee Crown Point Parkway, Orlando, FL',
      organizerId: 'org123',
      capacity: 100,
      ticketPrice: 0.0,
      media: ['https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F979051893%2F38818007190%2F1%2Foriginal.20250309-144721?w=940&auto=format%2Ccompress&q=75&sharp=10&s=5aacae6bc350f96bb1cd6bef9a3917f8'],
      rsvpCount: 45,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    ),
    Event(
      id: '2',
      title: 'Network Nite',
      description: 'Dive into tech with other professionals'!,
      keywords: ['Tech', 'Food'],
      startTime: DateTime(2025, 11, 15, 18, 0),
      endTime: DateTime(2025, 11, 15, 21, 0),
      location: {'address': '2100 North Greenville Ave.'},
      address: '2100 North Greenville Ave, Orlando, FL',
      organizerId: 'org456',
      capacity: 50,
      ticketPrice: 0.0,
      media: ['https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F457826739%2F209499566848%2F1%2Foriginal.jpg?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=a8544aa170b290127e4afaa6d6c1b7e8'],
      rsvpCount: 20,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    ),
  ];

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
          child: ListView.builder(
            itemCount: events.length,
            itemBuilder: (context, index) {
              final event = events[index];
              
              return Container(
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
                          child: Image.network(
                            event.media[0],
                            height: 150,
                            width: double.infinity,
                            fit: BoxFit.cover,
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
                                event.address,
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
                                  event.ticketPrice > 0 
                                      ? '\$${event.ticketPrice.toStringAsFixed(0)}' 
                                      : 'Free',
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
              );
            },
        ),
      ),
    );
  }
}