import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfilePage extends StatefulWidget{
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}
// this is a state object, linking the stateful object to the widget
class _ProfilePageState extends State<ProfilePage>{
  String? userName;
  String? userEmail;

  @override
  void initState() {
  super.initState();
    _loadUserData();
}

// this is Future void meaning that this function doesn't return a value and it's also async
Future<void> _loadUserData() async {
  final prefs = await SharedPreferences.getInstance();
  setState(() {
    userName = prefs.getString('userName') ?? 'User';
    userEmail = prefs.getString('userEmail') ?? '';
  });
}

Future<void> _logout(BuildContext context) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.clear(); 

  Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
}

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Profile'),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
       body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
        child: Column(
          children: [
            
            const CircleAvatar(
              radius: 60,
              backgroundColor: Colors.blueAccent,
              child: Icon(
                Icons.person,
                color: Colors.white,
                size: 60,
              ),
            ),
            const SizedBox(height: 20),

            Text(
              userName ?? 'User',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 10),

            Text(
              userEmail ?? '',
              style: const TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),

           const SizedBox(height: 40),
           const Divider(thickness: 1, indent: 20, endIndent: 20),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.event_note, color: Colors.blueAccent),
                SizedBox(width: 10),
                Text(
                  'Your Events',
                  style: TextStyle(fontSize: 18, color: Colors.black87),
                ),
              ],
            ),

            const SizedBox(height: 250),


            ElevatedButton(
              child: Text('Logout'),
              onPressed: (){
                Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.black
              )
            )
          ]
        )
      )
    );
  }
}
