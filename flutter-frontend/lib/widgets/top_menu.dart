import 'package:flutter/material.dart';

class TopMenu extends StatelessWidget {
  final int currentPageIndex;
  const TopMenu({super.key, required this.currentPageIndex});

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
              padding: const EdgeInsets.fromLTRB(6, 14, 6, 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  _TopMenuText(
                    text: 'Explore',
                    isActive: currentPageIndex == 0,
                  ),
                  const SizedBox(width: 16),
                  _TopMenuText(
                    text: 'News',
                    isActive: currentPageIndex == 1,
                  ),
                  const SizedBox(width: 16),
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
    return Column(
      children: [
        Text(
          text,
          style: TextStyle(
            color: isActive
                ? Colors.white
                : const Color.fromARGB(195, 139, 139, 139),
            fontSize: 20,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        Visibility(
          visible: isActive,
          child: Container(
            height: 4,
            width: 40,
            decoration: BoxDecoration(
                border: Border.all(
                  color: isActive
                      ? Colors.white
                      : const Color.fromARGB(195, 139, 139, 139),
                ),
                color: isActive
                    ? Colors.white
                    : const Color.fromARGB(195, 139, 139, 139),
                borderRadius: const BorderRadius.all(Radius.circular(10))),
          ),
        )
      ],
    );
  }
}
