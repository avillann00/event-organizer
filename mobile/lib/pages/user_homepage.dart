import 'package:flutter/material.dart';
import './map_page.dart';
import './profile_page.dart';
import './event_page.dart';
import '../components/nav_button.dart';
import '../models/event.dart';
import 'package:shared_preferences/shared_preferences.dart';
import './create_event_page.dart';

class UserHomePage extends StatefulWidget {
  const UserHomePage({super.key});

  @override
  State<UserHomePage> createState() => _UserHomePageState();
}

class _UserHomePageState extends State<UserHomePage> {
  int _selectedIndex = 0;
  List<Event> _events = [];

  void _updateEvents(List<Event> newEvents){
    setState((){
      _events = newEvents;
    });
  }

  String? name;
  String? email;
  String? role;

  @override
  void initState(){
    super.initState();
    loadUserData();
  }

  Future<void> loadUserData() async{
    final prefs = await SharedPreferences.getInstance();

    setState((){
      name = prefs.getString('userName');
      email = prefs.getString('userEmail');
      role = prefs.getString('userRole');
    });
  }

  // switch statement instead of final List <Widget> 
  Widget _getPage() {
    switch (_selectedIndex) {
      case 0:
        return MapPage(
          events: _events,
          onEventsUpdated: _updateEvents
        );
      case 1:
        return const ProfilePage();
      case 2:
        return role == 'user' ? EventPage(events: _events) : CreateEventPage();
      default:
        return MapPage(
          events: _events,
          onEventsUpdated: _updateEvents
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    if(role == null){
      return const Scaffold(
        body: Center(child: CircularProgressIndicator())
      );
    }

    return Scaffold(
      body: Stack(
        children: [
          _getPage(),

          Positioned(
            left: 0,
            right: 0,
            bottom: 20, 
            child: Center(
              child: Material(
                elevation: 8,
                borderRadius: BorderRadius.circular(25),
                color: Colors.white.withValues(alpha: 0.95),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      NavButton(
                        index: 0,
                        icon: Icons.home,
                        isSelected: _selectedIndex == 0,
                        onTap: () => setState(() => _selectedIndex = 0),
                      ),

                      SizedBox(width: 20),

                      NavButton(
                        index: 1,
                        icon: Icons.person,
                        isSelected: _selectedIndex == 1,
                        onTap: () => setState(() => _selectedIndex = 1),
                      ),

                      SizedBox(width: 20),

                      NavButton(
                        index: 2,
                        icon: role == 'user' ? Icons.menu : Icons.create,
                        isSelected: _selectedIndex == 2,
                        onTap: () {
                          setState(() => _selectedIndex = 2);
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
