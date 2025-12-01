import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:geocoding/geocoding.dart';
import 'dart:core';
import '../models/event.dart';

class EditEventPage extends StatefulWidget {
  const EditEventPage({super.key});

  @override
  State<EditEventPage> createState() => _EditEventPageState();
}

class _EditEventPageState extends State<EditEventPage> {
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();
  final addressController = TextEditingController();
  final capacityController = TextEditingController();
  final ticketPriceController = TextEditingController();

  final List<String> categories = ['Music', 'Sports', 'Food', 'Tech'];
  List<String> selectedCategories = [];

  TimeOfDay? startTime;
  TimeOfDay? endTime;

  double? latitude;
  double? longitude;

  File? selectedImage;
  String? uploadedImageUrl;

  bool isLoading = false;
  late Event event; 

  @override
  void didChangeDependencies(){
    super.didChangeDependencies();
    event = ModalRoute.of(context)!.settings.arguments as Event;

    titleController.text = event.title ?? '';
    descriptionController.text = event.description ?? '';
    addressController.text = event.address ?? '';
    capacityController.text = event.capacity?.toString() ?? '';
    ticketPriceController.text = event.ticketPrice?.toString() ?? '';

    selectedCategories = [...(event.keywords ?? [])];

    try{
      final startDT = DateTime.parse((event.startTime as String?) ?? DateTime.now().toIso8601String());
      final endDT = DateTime.parse((event.endTime as String?) ?? DateTime.now().toIso8601String());

      startTime = TimeOfDay(hour: startDT.hour, minute: startDT.minute);
      endTime = TimeOfDay(hour: endDT.hour, minute: endDT.minute);
    }
    catch(_){
      startTime = TimeOfDay.now();
      endTime = TimeOfDay.now();
    }

    uploadedImageUrl = (event.media != null && event.media!.isNotEmpty)
        ? event.media!.first
        : null;
  }

  Future<void> pickImage() async {
    final picker = ImagePicker();
    final file = await picker.pickImage(source: ImageSource.gallery);

    if (file != null) {
      setState(() {
        selectedImage = File(file.path);
      });
    }
  }

  Future<String?> uploadImage(File image) async {
    final uri = Uri.parse('https://cop4331project.dev/api/upload');
    final req = http.MultipartRequest('POST', uri);
    req.files.add(await http.MultipartFile.fromPath('image', image.path));

    final res = await req.send();
    if (res.statusCode == 200) {
      final body = await res.stream.bytesToString();
      final json = jsonDecode(body);
      return json['url'];
    }

    return null;
  }

  Future<void> updateEvent() async {
    setState(() => isLoading = true);

    if (selectedImage != null) {
      uploadedImageUrl = await uploadImage(selectedImage!);
    }

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (latitude == null || longitude == null) {
      final locs = await locationFromAddress(addressController.text);
      latitude = locs.first.latitude;
      longitude = locs.first.longitude;
    }

    final now = DateTime.now();
    final startDT = DateTime(now.year, now.month, now.day, startTime!.hour, startTime!.minute);
    final endDT = DateTime(now.year, now.month, now.day, endTime!.hour, endTime!.minute);

    final body = {
      'token': token,
      'title': titleController.text,
      'description': descriptionController.text,
      'address': addressController.text,
      'latitude': latitude,
      'longitude': longitude,
      'keywords': selectedCategories,
      'startTime': startDT.toIso8601String(),
      'endTime': endDT.toIso8601String(),
      'capacity': int.parse(capacityController.text),
      'ticketPrice': double.parse(ticketPriceController.text),
      'media': uploadedImageUrl != null ? [uploadedImageUrl] : [],
    };

    final res = await http.put(
      Uri.parse('https://cop4331project.dev/api/events/${event.id}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );

    setState(() => isLoading = false);

    if (res.statusCode == 200) {
      Navigator.pop(context); // return to previous page
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to update event')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(backgroundColor: Colors.blue, title: const Text('Edit Event')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: titleController,
              decoration: const InputDecoration(labelText: 'Title'),
            ),

            const SizedBox(height: 12),

            TextField(
              controller: descriptionController,
              decoration: const InputDecoration(labelText: 'Description'),
            ),

            const SizedBox(height: 12),

            TextField(
              controller: addressController,
              decoration: const InputDecoration(labelText: 'Address'),
            ),

            const SizedBox(height: 12),

            TextField(
              controller: capacityController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Capacity'),
            ),

            const SizedBox(height: 12),

            TextField(
              controller: ticketPriceController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Ticket Price'),
            ),

            const SizedBox(height: 18),

            ElevatedButton.icon(
              onPressed: pickImage,
              icon: const Icon(Icons.image),
              label: const Text('Change Image'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black
              ),
            ),

            if (uploadedImageUrl != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text('Current image: $uploadedImageUrl'),
              ),

            const SizedBox(height: 20),

            ElevatedButton(
              onPressed: isLoading ? null : updateEvent,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black
              ),
              child: isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Update Event'),
            ),
          ],
        ),
      ),
    );
  }
}
