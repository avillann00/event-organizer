import 'package:flutter/material.dart';
import 'user_homepage.dart';

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

   @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.blue[100],
      appBar: AppBar(
        title: Center(
          child: Text(
            "Event Organizer",
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        leading: Icon(
          Icons.menu,
          color: Colors.white,
        ),
        actions: [
          IconButton(
            onPressed: () {}, 
            icon: Icon(
              Icons.logout,
              color: Colors.white,
            ),
          )
        ],
        backgroundColor: Colors.blueAccent,
      ),
      body: Center(
        child: Container(
          height: 300,
          width: 300,
          decoration: BoxDecoration(
            color: Colors.blueAccent,
            borderRadius: BorderRadius.circular(20),
          ),
          padding: EdgeInsets.all(25),
            child: Column(
              children: [
                Text(
                  "Event Organizer",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                ElevatedButton(
                  // navigating to the user's home page after registering
                  onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => UserHomePage(),
                      ),
                    );
                  },
                  child: Text("Go To Home Page"),
                ),
              ],
            ),
        ),
      ),
    );
  }
}