import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../models/rsvp.dart';
import 'package:intl/intl.dart'; 

class RsvpDetails extends StatefulWidget{
  final Rsvp rsvp;
  const RsvpDetails({required this.rsvp, super.key});

  @override
  State<RsvpDetails> createState() => _RsvpDetailsState();
}

class _RsvpDetailsState extends State<RsvpDetails>{
  late Rsvp currentRsvp;

  @override
  void initState(){
    super.initState();
    currentRsvp = widget.rsvp;
  }

  String _formatDateRange(DateTime start, DateTime end) {
    final formatter = DateFormat('EEE, MMM d • h:mm a');
    return '${formatter.format(start)} - ${DateFormat('h:mm a').format(end)}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dateRange = _formatDateRange(currentRsvp.eventId.startTime, currentRsvp.eventId.endTime);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(currentRsvp.eventId.title),
        backgroundColor: Colors.blueAccent,
        elevation: 2,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),

            Center(
              child: QrImageView(
                data: currentRsvp.id,
                version: QrVersions.auto,
                size: 300.0
              )
            ),

            const SizedBox(height: 20),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    currentRsvp.eventId.title,
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
                          currentRsvp.eventId.address ?? 'No address provided',
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
                    currentRsvp.eventId.description ?? 'No description available.',
                    style: const TextStyle(fontSize: 15, height: 1.4),
                  ),
                  
                  const SizedBox(height: 20),

                  if (currentRsvp.eventId.keywords.isNotEmpty) ...[
                    Text(
                      "Tags",
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: currentRsvp.eventId.keywords
                          .map((tag) => Chip(
                                label: Text(tag),
                                backgroundColor: Colors.blue.shade50,
                                labelStyle: const TextStyle(color: Colors.black87),
                              ))
                          .toList(),
                    ),
                  ],

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
