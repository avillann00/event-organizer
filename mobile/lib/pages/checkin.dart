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

  Future<void> verify() async{
    if (isProcessing) return; 
    setState(() => isProcessing = true);

    try{
      http.Response response = await http.get(Uri.parse('https://cop4331project.dev/'));

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(
          response.statusCode == 200
            ? 'QR code valid. User checked in'
            : 'Error verifying QR code'
        ))
      );
    }
    finally{
      await Future.delayed(const Duration(seconds: 2));
      if (mounted) setState(() => isProcessing = false);
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
                verify(); 
              },
            ),
          ),
        ],
      ),
    );
  }
}
