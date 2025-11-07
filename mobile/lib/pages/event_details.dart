import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // for date formatting
import '../models/event.dart';

class EventDetailsPage extends StatelessWidget {
  final Event event;
  const EventDetailsPage({required this.event});

  String _formatDateRange(DateTime start, DateTime end) {
    final formatter = DateFormat('EEE, MMM d • h:mm a');
    return '${formatter.format(start)} - ${DateFormat('h:mm a').format(end)}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dateRange = _formatDateRange(event.startTime, event.endTime);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(event.title),
        backgroundColor: Colors.blueAccent,
        elevation: 2,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (event.media.isNotEmpty)
              Image.network(
                event.media.first,
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
                    event.title,
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
                          event.address ?? 'No address provided',
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
                    event.description ?? 'No description available.',
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
                              event.capacity != null ? "${event.capacity} people" : "Not specified"),
                          const Divider(),
                          _detailRow(Icons.confirmation_number, "Tickets",
                              event.ticketPrice == null || event.ticketPrice == 0
                                  ? "Free"
                                  : "\$${event.ticketPrice!.toStringAsFixed(2)}"),
                          _detailRow(Icons.person, "Organizer", event.organizerId),
                          const Divider(),
                          _detailRow(Icons.check_circle, "RSVPs", "${event.rsvpCount} attending"),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  if (event.keywords.isNotEmpty) ...[
                    Text(
                      "Tags",
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: event.keywords
                          .map((tag) => Chip(
                                label: Text(tag),
                                backgroundColor: Colors.blue.shade50,
                                labelStyle: const TextStyle(color: Colors.black87),
                              ))
                          .toList(),
                    ),
                  ],
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
