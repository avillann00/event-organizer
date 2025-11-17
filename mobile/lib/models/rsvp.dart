import './event.dart';

class Rsvp{
  final String id;
  final Event eventId;
  final String userId;
  final String? status;

  Rsvp({
    required this.id,
    required this.eventId,
    required this.userId,
    this.status
  });

  factory Rsvp.fromJson(Map<String, dynamic> json){
    return Rsvp(
      id: json['_id']?.toString() ?? '',
      eventId: Event.fromJson(json['eventId']),
      userId: json['userId']?.toString() ?? '',
      status: json['status']?.toString() ?? ''
    );
  }

  Map<String, dynamic> toJson(){
    return{
      'id': id,
      'eventId': eventId,
      'userId': userId,
      'status': status
    };
  }
}
