class Event {
  // event field declarations
  final String id;
  final String title;
  final String description;
  final List<String> keywords;
  final DateTime startTime;
  final DateTime endTime;
  final Map<String, dynamic> location;  // or create a Location class
  final String address;
  final String organizerId;
  final int capacity;
  final double ticketPrice;
  final List<String> media;
  final int rsvpCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  // this is the constructor
  Event({
    required this.id,
    required this.title,
    required this.description,
    required this.keywords,
    required this.startTime,
    required this.endTime,
    required this.location,
    required this.address,
    required this.organizerId,
    required this.capacity,
    required this.ticketPrice,
    required this.media,
    required this.rsvpCount,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Event.fromJson(Map<String, dynamic> json){
    return Event(
      id: json['_id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      keywords: List<String>.from(json['keywords'] ?? []), 
      startTime: DateTime.parse(json['startTime']),
      endTime: DateTime.parse(json['endTime']),
      location: json['location'] as Map<String, dynamic>,
      address: json['address'] as String,
      organizerId: json['organizerId'] as String,
      capacity: json['capacity'] as int,
      ticketPrice: (json['ticketPrice'] as num).toDouble(),
      media: List<String>.from(json['media'] ?? []),
      rsvpCount: json['rsvpCount'] as int,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

    Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'keywords': keywords,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime.toIso8601String(),
      'location': location,
      'address': address,
      'organizerId': organizerId,
      'capacity': capacity,
      'ticketPrice': ticketPrice,
      'media': media,
      'rsvpCount': rsvpCount,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

}



