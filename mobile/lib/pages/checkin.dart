import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

class Checkin extends StatefulWidget{
  final String eventId;
  const Checkin({required this.eventId, super.key});

  @override
  State<Checkin> createState() => _CheckinState();
}

class _CheckinState extends State<Checkin>{
  late String currentEventId;
  bool isProcessing = false; 

  @override
  void initState(){
    super.initState();
    currentEventId = widget.eventId;
  }

  Future<void> verify(String rsvpId) async{
    if(isProcessing){
      return;
    }

    setState(() => isProcessing = true);

    try{
      final response = await http.post(
        Uri.parse('https://cop4331project.dev/api/rsvp/checkin'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'rsvpId': rsvpId,
          'eventId': currentEventId,
        }),
      );

      if(!mounted){
        return;
      }

      String message = 'Error verifying QR code';

      if(response.statusCode == 200){
        message = 'QR code valid. User checked in';
      } 
      else{
        final decoded = jsonDecode(response.body);

        if(decoded['message'] != null){
          message = decoded['message'];

          if(message.contains('already')){
            message = 'User already checked in';
          }
        }
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: response.statusCode == 200
              ? Colors.green
              : Colors.red,
          duration: const Duration(seconds: 2),
        ),
      );
    }
    catch(e){
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Network error')),
      );
    }
    finally{
      await Future.delayed(const Duration(seconds: 2));
      if(mounted){
        setState(() => isProcessing = false);
      }
    }
  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 2,
        title: const Text('Check In'),
        backgroundColor: Colors.blueAccent
      ),
      body: Column(
        children: [
          SizedBox(
            height: 400,
            child: MobileScanner(
              onDetect: (capture){
                final barcode = capture.barcodes.first;
                print('QR: ${barcode.rawValue}');
                if (barcode.rawValue != null) {
                  verify(barcode.rawValue!);
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
