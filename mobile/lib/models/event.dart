class Event {
  // event field declarations
  final String id;
  final String title;
  final String? description;
  final List<String> keywords;
  final DateTime startTime;
  final DateTime endTime;
  final Map<String, dynamic> location;  // or create a Location class
  final String? address;
  final String organizerId;
  final int? capacity;
  final double? ticketPrice;
  final List<String> media;
  final int rsvpCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  // this is the constructor
  Event({
    required this.id,
    required this.title,
    this.description,
    required this.keywords,
    required this.startTime,
    required this.endTime,
    required this.location,
    this.address,
    required this.organizerId,
    this.capacity,
    this.ticketPrice,
    required this.media,
    required this.rsvpCount,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
  return Event(
    id: json['_id']?.toString() ?? '',
    title: json['title']?.toString() ?? 'Untitled Event',
    description: json['description']?.toString(),
    keywords: List<String>.from(json['keywords'] ?? []),
    startTime: DateTime.tryParse(json['startTime'] ?? '') ?? DateTime.now(),
    endTime: DateTime.tryParse(json['endTime'] ?? '') ?? DateTime.now(),
    location: (json['location'] != null && json['location'] is Map)
        ? Map<String, dynamic>.from(json['location'])
        : {},
    address: json['address']?.toString(),
    organizerId: json['organizerId']?.toString() ?? '',
    capacity: json['capacity'] is int
        ? json['capacity']
        : int.tryParse(json['capacity']?.toString() ?? ''),
    ticketPrice: json['ticketPrice'] != null
        ? (json['ticketPrice'] as num).toDouble()
        : 0.0, // defaults to free
    media: List<String>.from(json['media'] ?? []),
    rsvpCount: json['rsvpCount'] ?? 0,
    createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    updatedAt: DateTime.tryParse(json['updatedAt'] ?? '') ?? DateTime.now(),
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



