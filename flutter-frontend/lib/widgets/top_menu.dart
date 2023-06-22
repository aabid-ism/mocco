import 'package:flutter/material.dart';

class TopMenu extends StatelessWidget {
  final int currentPageIndex;
  const TopMenu({Key? key, required this.currentPageIndex});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _TopMenuText(
            text: 'News',
            isActive: currentPageIndex == 0,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 8),
            child: Text(
              "|",
              style: TextStyle(
                color: Colors.white,
                fontSize: 35  ,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          _TopMenuText(
            text: 'Lifestyle',
            isActive: currentPageIndex == 1,
          ),
        ],
      ),
    );
  }
}

class _TopMenuText extends StatelessWidget {
  final String text;
  final bool isActive;
  const _TopMenuText({required this.text, required this.isActive});

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: TextStyle(
        color:
            isActive ? Colors.white : const Color.fromARGB(255, 209, 209, 209),
        fontSize: 20,
        fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
      ),
    );
  }
}
