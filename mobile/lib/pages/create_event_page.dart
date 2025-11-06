import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:geocoding/geocoding.dart';

class CreateEventPage extends StatefulWidget{
  const CreateEventPage({super.key});

  @override
  State<CreateEventPage> createState() => _CreateEventPageState();
}

class _CreateEventPageState extends State<CreateEventPage>{
  final TextEditingController titleController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController addressController = TextEditingController();

  final List<String> categories = ['Music', 'Sports', 'Food', 'Tech'];
  List<String> selectedCategories = [];

  TimeOfDay? startTime;
  TimeOfDay? endTime;

  double? latitude;
  double? longitude;

  bool isLoading = false;

  Future<void> getCoordinates(String address) async{
    try{
      final locations = await locationFromAddress(address);
      if(locations.isNotEmpty){
        setState((){
          latitude = locations.first.latitude;
          longitude = locations.first.longitude;
        });
      }
    }
    catch(error){
      print('error getting coordinates: $error');
    }
  }

  Future<void> pickTime(bool isStart) async{
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now()
    );

    if(picked != null){
      setState((){
        if(isStart){
          startTime = picked;
        }
        else{
          endTime = picked;
        }
      });
    }
  }

  Future<void> createEvent(BuildContext context) async{
    setState((){
      isLoading = true;
    });

    if(titleController.text == '' || descriptionController.text == '' || addressController.text == ''){
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill out all required fields')),
      );

      setState((){
        isLoading = false;
      });
     
      return;
    }

    if(latitude == null || longitude == null){
      await getCoordinates(addressController.text);
    }

    final response = await http.post(
      Uri.parse('http://127.0.0.1:5000/api/events'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'title': titleController.text,
        'description': descriptionController.text,
        'address': addressController.text,
        'latitude': latitude,
        'longitude': longitude,
        'keywords': selectedCategories,
        'startTime': startTime?.format(context),
        'endTime': endTime?.format(context)
      })
    );

    setState((){
      isLoading = false;
    });

    if(response.statusCode == 200 || response.statusCode == 201){
      print('event created');
      Navigator.pushNamed(context, '/userHomePage');
    }
    else{
      print('error creating event');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to create event')),
      );
    }
  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('Create Event'),
        backgroundColor: Colors.white
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              const SizedBox(height: 50),

              TextField(
                controller: titleController,
                decoration: InputDecoration(
                  labelText: 'Event Title',
                  border: OutlineInputBorder(),
                )
              ),

              const SizedBox(height: 20),

              TextField(
                controller: descriptionController,
                decoration: InputDecoration(
                  labelText: 'Event Description',
                  border: OutlineInputBorder(),
                )
              ),

              const SizedBox(height: 20),

              TextField(
                controller: addressController,
                decoration: InputDecoration(
                  labelText: 'Address',
                  border: const OutlineInputBorder(),
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.location_searching),
                    onPressed: () async{
                      await getCoordinates(addressController.text);
                    },
                  ),
                ),
              ),

              const SizedBox(height: 10),

              if(latitude != null && longitude != null)
              Text(
                'Coordinates: (${latitude!.toStringAsFixed(5)}, ${longitude!.toStringAsFixed(5)})',
                style: const TextStyle(fontSize: 14, color: Colors.grey),
              ),

              const SizedBox(height: 10),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton.icon(
                    onPressed: () => pickTime(true),
                    icon: const Icon(Icons.access_time),
                    label: Text(startTime == null
                        ? 'Pick Start Time'
                        : 'Start: ${startTime!.format(context)}'),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => pickTime(false),
                    icon: const Icon(Icons.access_time),
                    label: Text(endTime == null
                        ? 'Pick End Time'
                        : 'End: ${endTime!.format(context)}'),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),

              Align(
                alignment: Alignment.centerLeft,
                child: Wrap(
                  spacing: 8,
                  children: categories.map((tag) {
                    final isSelected = selectedCategories.contains(tag);
                    return FilterChip(
                      label: Text(tag),
                      selected: isSelected,
                      onSelected: (selected){
                        setState((){
                          if(selected){
                            selectedCategories.add(tag);
                          } 
                          else{
                            selectedCategories.remove(tag);
                          }
                        });
                      },
                    );
                  }).toList(),
                ),
              ),

              const SizedBox(height: 30),

              ElevatedButton(
                child: isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('Create Event'),
                onPressed: isLoading ? null : () async{ createEvent(context); }
              )
            ]
          )
        )
      )
    );
  }
}
