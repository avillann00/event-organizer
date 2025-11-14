import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // for date formatting
import '../models/event.dart';
import '../components/rsvpModal.dart';

class EventDetailsPage extends StatefulWidget {
  final Event event;
  const EventDetailsPage({required this.event});

  @override
  State<EventDetailsPage> createState() => _EventDetailsPageState();
}

class _EventDetailsPageState extends State<EventDetailsPage> {
  late Event currentEvent;

  @override
  void initState() {
    super.initState();
    currentEvent = widget.event;
  }

  String _formatDateRange(DateTime start, DateTime end) {
    final formatter = DateFormat('EEE, MMM d • h:mm a');
    return '${formatter.format(start)} - ${DateFormat('h:mm a').format(end)}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dateRange = _formatDateRange(currentEvent.startTime, currentEvent.endTime);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(currentEvent.title),
        backgroundColor: Colors.blueAccent,
        elevation: 2,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (currentEvent.media.isNotEmpty)
              Image.network(
                currentEvent.media.first,
                height: 220,
                width: double.infinity,
                fit: BoxFit.cover,
              )
            else
              Container(
                height: 220,
                width: double.infinity,
                color: Colors.blue[100],
                child: const Icon(
                  Icons.event,
                  color: Colors.white,
                  size: 100,
                ),
              ),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    currentEvent.title,
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.access_time, size: 20, color: Colors.grey),
                      const SizedBox(width: 8),
                      Text(
                        dateRange,
                        style: const TextStyle(fontSize: 15, color: Colors.black87),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.location_on, size: 20, color: Colors.grey),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          currentEvent.address ?? 'No address provided',
                          style: const TextStyle(fontSize: 15),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  Text(
                    "About this event",
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    currentEvent.description ?? 'No description available.',
                    style: const TextStyle(fontSize: 15, height: 1.4),
                  ),
                  
                  const SizedBox(height: 20),

                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          _detailRow(Icons.people, "Capacity",
                              currentEvent.capacity != null ? "${currentEvent.capacity} people" : "Not specified"),
                          const Divider(),
                          _detailRow(Icons.confirmation_number, "Tickets",
                              currentEvent.ticketPrice == null || currentEvent.ticketPrice == 0
                                  ? "Free"
                                  : "\$${currentEvent.ticketPrice!.toStringAsFixed(2)}"),
                          _detailRow(Icons.person, "Organizer", currentEvent.organizerId),
                          const Divider(),
                          _detailRow(Icons.check_circle, "RSVPs", "${currentEvent.rsvpCount} attending"),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  if (currentEvent.keywords.isNotEmpty) ...[
                    Text(
                      "Tags",
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: currentEvent.keywords
                          .map((tag) => Chip(
                                label: Text(tag),
                                backgroundColor: Colors.blue.shade50,
                                labelStyle: const TextStyle(color: Colors.black87),
                              ))
                          .toList(),
                    ),
                  ],
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) => RSVPModal(
                            event: currentEvent,
                            onConfirm: (updatedEvent) {
                              setState(() {
                                currentEvent = updatedEvent;
                              });
                            },
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blueAccent,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'RSVP TO THIS EVENT!',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 22, color: Colors.blueAccent),
        const SizedBox(width: 12),
        Expanded(
          child: Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
        ),
        Text(value, style: const TextStyle(color: Colors.black87)),
      ],
    );
  }
}