import 'package:flutter/material.dart';

class TopMenu extends StatelessWidget {
  final int currentPageIndex;
  const TopMenu({Key? key, required this.currentPageIndex});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Stack(
        children: [
          Container(
            height: MediaQuery.of(context).size.height / 8,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: const Alignment(0, .2),
                colors: [
                  Colors.black
                      .withOpacity(0.5), // starting color (20% transparent)
                  Colors.black.withOpacity(0.0), // endinrent)
                ],
              ),
            ),
          ),
          Positioned(
            child: Padding(
              padding: const EdgeInsets.all(6.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  _TopMenuText(
                    text: 'Explore',
                    isActive: currentPageIndex == 0,
                  ),
                  _TopMenuSeparator(
                      isActive: currentPageIndex == 0 || currentPageIndex == 1),
                  _TopMenuText(
                    text: 'News',
                    isActive: currentPageIndex == 1,
                  ),
                  _TopMenuSeparator(
                      isActive: currentPageIndex == 1 || currentPageIndex == 2),
                  _TopMenuText(
                    text: 'Lifestyle',
                    isActive: currentPageIndex == 2,
                  ),
                ],
              ),
            ),
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
        color: isActive ? Colors.white : const Color.fromARGB(195, 139, 139, 139),
        fontSize: 20,
        fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }
}

class _TopMenuSeparator extends StatelessWidget {
  final bool isActive;
  const _TopMenuSeparator({required this.isActive});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 8),
      child: Text(
        "|",
        style: TextStyle(
          color: isActive
              ? Colors.white
              : const Color.fromARGB(205, 114, 114, 114),
          fontSize: 35,
          fontWeight: isActive ? FontWeight.w900 : FontWeight.w600,
        ),
      ),
    );
  }
}
