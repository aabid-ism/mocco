import 'package:flutter/material.dart';

class TopMenu extends StatefulWidget {
  final int currentPageIndex;
  final Function(int) changeTab;
  const TopMenu(
      {super.key, required this.currentPageIndex, required this.changeTab});

  @override
  State<TopMenu> createState() => _TopMenuState();
}

class _TopMenuState extends State<TopMenu> {
  var posistion = 0.0;
  final GlobalKey internationalWidgetKey = GlobalKey();
  final GlobalKey exploreWidgetKey = GlobalKey();
  @override
  void initState() {
    // Fetch news data before LocalScreen build
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      setState(() {
        posistion = ((internationalWidgetKey.currentContext?.findRenderObject()
                    as RenderBox)
                .size
                .width -
            (exploreWidgetKey.currentContext?.findRenderObject() as RenderBox)
                .size
                .width);
      });
    });
  }

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
                      .withOpacity(0.5), // starting color (50% transparent)
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
                  SizedBox(
                    width: posistion
                  ),
                  GestureDetector(
                    onTap: () => widget.changeTab(0),
                    child: _TopMenuText(
                      text: 'Explore',
                      isActive: widget.currentPageIndex == 0,
                      widKey: exploreWidgetKey,
                    ),
                  ),
                  const SizedBox(width: 16),
                  GestureDetector(
                    onTap: () => widget.changeTab(1),
                    child: _TopMenuText(
                      text: 'Local',
                      isActive: widget.currentPageIndex == 1,
                    ),
                  ),
                  const SizedBox(width: 16),
                  GestureDetector(
                    onTap: () => widget.changeTab(2),
                    child: _TopMenuText(
                      text: 'International',
                      isActive: widget.currentPageIndex == 2,
                      widKey: internationalWidgetKey,
                    ),
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
  final GlobalKey? widKey;
  const _TopMenuText({required this.text, required this.isActive, this.widKey});

  @override
  Widget build(BuildContext context) {
    return Column(
      key: widKey,
      children: [
        Text(
          text,
          style: TextStyle(
            color: isActive
                ? Colors.white
                : const Color.fromARGB(255, 226, 226, 226),
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
                      : const Color.fromARGB(255, 226, 226, 226),
                ),
                color: isActive
                    ? Colors.white
                    : const Color.fromARGB(255, 226, 226, 226),
                borderRadius: const BorderRadius.all(Radius.circular(10))),
          ),
        )
      ],
    );
  }
}
