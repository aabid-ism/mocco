import 'package:flutter/material.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  static const items = [
    "Economy",
    "Politics",
    "Sports",
    "Media",
    "Technology",
    "War & Conflict",
    "Humanitarian",
    "Environment",
    "Health",
    "Road Safety"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(27, 70, 27, 27),
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3, // Number of columns in the grid
            ),
            itemCount: items.length,
            itemBuilder: (context, index) {
              return GridTile(
                child: Padding(
                  padding: const EdgeInsets.all(9),
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 217, 217, 217),
                      borderRadius: BorderRadius.circular(18.0),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Center(
                          child: Image.asset(
                            'assets/icons/$index.png',
                            scale: 1.3,
                          ),
                        ),
                        SizedBox(height: 10),
                        Text(
                          items[index],
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
