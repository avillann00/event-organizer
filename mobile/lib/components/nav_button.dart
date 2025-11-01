import 'package:flutter/material.dart';

class NavButton extends StatelessWidget{
  final int index;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const NavButton({ super.key, required this.index, required this.icon, required this.isSelected, required this.onTap });

  @override
  Widget build(BuildContext context){
    return InkWell(
      borderRadius: BorderRadius.circular(20),
      onTap: onTap,
      child: Icon(
        icon,
        size: 30,
        color: isSelected ? Colors.blueAccent : Colors.grey,
      ),
    );
  }
}
