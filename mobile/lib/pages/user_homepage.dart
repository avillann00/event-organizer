import 'package:flutter/material.dart';
import 'register_page.dart';

class UserHomePage extends StatelessWidget {
  const UserHomePage({super.key});

  @override
  Widget build(BuildContext context){
    return Scaffold(
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
                "This is the user's hompage",
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 28,
                )
                ),
              ElevatedButton(
                    // navigating to the user's home page after registering
                    onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => RegisterPage(),
                        ),
                      );
                    },
                    child: Text(
                        "Go To Authentication",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 28,
                        )
                      ),
                ),
            ],
          ),
        ),
        
      ),
    );
  }
}