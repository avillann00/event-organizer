import 'package:flutter/material.dart';

class FilterBar extends StatefulWidget{
  final void Function(String? radius, String? category)? onApply;

  const FilterBar({Key? key, this.onApply}) : super(key: key);

  @override
  State<FilterBar> createState() => _FilterBarState();
}

class _FilterBarState extends State<FilterBar>{
  String? selectedRadius;
  String? selectedCategory;

  @override
  Widget build(BuildContext context){
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Filters',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 20),

          DropdownButtonFormField<String>(
            decoration: const InputDecoration(
              labelText: 'Radius',
              border: OutlineInputBorder(),
            ),
            dropdownColor: Colors.white,
            value: selectedRadius,
            items: ['1', '5', '10', '25']
                .map((radius) => DropdownMenuItem(
                      value: radius,
                      child: Text(radius),
                    ))
                .toList(),
            onChanged: (value) => setState(() => selectedRadius = value),
          ),

          const SizedBox(height: 20),

          DropdownButtonFormField<String>(
            decoration: const InputDecoration(
              labelText: 'Category',
              border: OutlineInputBorder(),
            ),
            dropdownColor: Colors.white,
            value: selectedCategory,
            items: ['Food', 'Music', 'Sports', 'Tech', 'All']
                .map((category) => DropdownMenuItem(
                      value: category,
                      child: Text(category),
                    ))
                .toList(),
            onChanged: (value) => setState(() => selectedCategory = value),
          ),
          const SizedBox(height: 30),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: (){
                widget.onApply?.call(selectedRadius, selectedCategory);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blueAccent,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Apply Filters',
                style: TextStyle(fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
