import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/event.dart';

class RSVPModal extends StatefulWidget {
  final Event event;
  final Function(Event) onConfirm;

  const RSVPModal({
    required this.event,
    required this.onConfirm,
    super.key,
});

  @override
  State<RSVPModal> createState() => _RSVPModalState();
}

class _RSVPModalState extends State<RSVPModal> {
  bool isLoading = false;

  Future<void> handleConfirmRSVP() async {
    setState(() {
      isLoading = true;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      
      final response = await http.post(
        Uri.parse('https://cop4331project.dev/api/rsvp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'token': token,
          'eventId': widget.event.id,
          'status': 'going',
        }),
      );

      if (!mounted){
        return; 
      }
      
      final data = jsonDecode(response.body);

      if(data['success'] == true) {
        final updatedEvent = Event(
          id: widget.event.id,
          title: widget.event.title,
          description: widget.event.description,
          startTime: widget.event.startTime,
          endTime: widget.event.endTime,
          address: widget.event.address,
          location: widget.event.location,
          media: widget.event.media,
          ticketPrice: widget.event.ticketPrice,
          rsvpCount: widget.event.rsvpCount + 1,
          capacity: widget.event.capacity != null ? widget.event.capacity! - 1 : null,
          keywords: widget.event.keywords,
          organizerId: widget.event.organizerId,
          createdAt: widget.event.createdAt,
          updatedAt: widget.event.updatedAt
        );

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('RSVP successful!')),
        );

        widget.onConfirm(updatedEvent);
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'] ?? 'RSVP failed')),
        );
      }
    } catch (error) {
      debugPrint('RSVP error: $error');
      if (!mounted){
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error creating RSVP')),
      );
   } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }
  @override
  Widget build(BuildContext context){
    return AlertDialog(
      title: Text('Confirm RSVP for ${widget.event.title}'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Price: ${widget.event.ticketPrice == null || widget.event.ticketPrice == 0 ? 'Free' : '\$${widget.event.ticketPrice}'}',
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 8),
          Text(
            'Capacity: ${widget.event.capacity ?? 'Unlimited'}',
            style: const TextStyle(fontSize: 14, color: Colors.grey),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: isLoading ? null : () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: isLoading ? null : handleConfirmRSVP,
          child: isLoading
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Confirm RSVP'),
        ),
      ],
    );
  }
}