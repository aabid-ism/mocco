// import 'package:flutter/material.dart';
// import 'package:mocco/news_provider_state.dart';
// import 'package:mocco/news_screen.dart';
// import 'package:provider/provider.dart';

// void main() {
//   runApp(const MyApp());
// }

// class MyApp extends StatelessWidget {
//   const MyApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return ChangeNotifierProvider(
//       create: (context) => NewsProvider(),
//       child: MaterialApp(
//         title: 'Mocco',
//         theme: ThemeData(
//           useMaterial3: true,
//           colorScheme: ColorScheme.fromSeed(seedColor: Colors.white),
//         ),
//         home: const ScreensHolder(),
//       ),
//     );
//   }
// }

// // Show the main News Page or Lifestyle Page or Saved news page
// class ScreensHolder extends StatefulWidget {
//   const ScreensHolder({super.key});

//   @override
//   State<ScreensHolder> createState() => _ScreensHolderState();
// }

// class _ScreensHolderState extends State<ScreensHolder> {
//   @override
//   Widget build(BuildContext context) {
//     return const NewsScreenContainer();
//   }
// }

// -------------------

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mocco/models/news_card.dart';
import 'package:tiktoklikescroller/tiktoklikescroller.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final List<NewsCard> _newsCards = <NewsCard>[
      NewsCard(
          id: 1,
          title: "Economy down the sink",
          description:
              "Lorem ipsum heloi latra meriut ipsal loroem. muit ers ioper ui, ertui lower. moiutra hi. ",
          imageUrl: "http://picsum.photos/200"),
      NewsCard(
          id: 2,
          title: "Matheesha Pathirana Out of the Squad",
          description:
              "Lorem ipsum heloi latra meriut ipsal loroem. muit ers ioper ui, ertui lower. moiutra hi."),
      NewsCard(
          id: 3,
          title: "Matheesha Pathirana Out of the Squad",
          description:
              "Lorem ipsum heloi latra meriut ipsal loroem. muit ers ioper ui, ertui lower. moiutra hi."),
    ];

    return MaterialApp(
      home: HomeWidget(
        newsCards: _newsCards,
      ),
    );
  }
}

class HomeWidget extends StatefulWidget {
  const HomeWidget({
    required this.newsCards,
    this.testingController,
  });

// This is a parameter to support testing in this repo
  final Controller? testingController;
  final List<NewsCard> newsCards;

  @override
  State<HomeWidget> createState() => _HomeWidgetState();
}

class _HomeWidgetState extends State<HomeWidget> {
  late Controller controller;

  @override
  initState() {
    controller = widget.testingController ?? Controller()
      ..addListener((event) {
        _handleCallbackEvent(event.direction, event.success);
      });

    // controller.jumpToPosition(4);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: TikTokStyleFullPageScroller(
        contentSize: widget.newsCards.length,
        swipePositionThreshold: 0.2,
        // ^ the fraction of the screen needed to scroll
        swipeVelocityThreshold: 2000,
        // ^ the velocity threshold for smaller scrolls
        animationDuration: const Duration(milliseconds: 400),
        // ^ how long the animation will take
        controller: controller,
        // ^ registering our own function to listen to page changes
        builder: (BuildContext context, int index) {
          return Container(
            color: Colors.grey,
            child: Stack(children: [
              SafeArea(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    CachedNetworkImage(
                        placeholder: (context, url) =>
                            const CircularProgressIndicator(),
                        imageUrl: widget.newsCards[index].imageUrl.toString()),
                    Text(
                      '${widget.newsCards[index].title}',
                      key: Key('$index-title'),
                      style: const TextStyle(fontSize: 22, color: Colors.white),
                    ),
                    Text(
                      '${widget.newsCards[index].description}',
                      key: Key('$index-description'),
                      style: const TextStyle(fontSize: 18, color: Colors.white),
                    ),
                  ],
                ),
              ),
              Positioned(
                bottom: 30,
                left: 0,
                right: 0,
                child: Container(
                  padding: EdgeInsets.only(top: 8, bottom: 8),
                  color: Colors.white.withAlpha(125),
                  child: Column(
                    children: [
                      Text("--- Buttons For Testing Controller Functions ---"),
                      SizedBox(
                        height: 8,
                      ),
                      Text("Jump To:"),
                      Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            ...Iterable<int>.generate(widget.newsCards.length)
                                .toList()
                                .map(
                                  (e) => MaterialButton(
                                    color: Colors.white.withAlpha(125),
                                    child: Text(
                                      "$e",
                                      key: Key('$e-jump'),
                                    ),
                                    onPressed: () =>
                                        controller.jumpToPosition(e),
                                  ),
                                )
                                .toList(),
                          ]),
                      Text("Animate To:"),
                      Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            ...Iterable<int>.generate(widget.newsCards.length)
                                .toList()
                                .map(
                                  (e) => MaterialButton(
                                    color: Colors.white.withAlpha(125),
                                    child: Text(
                                      "$e",
                                      key: Key('$e-animate'),
                                    ),
                                    onPressed: () =>
                                        controller.animateToPosition(e),
                                  ),
                                )
                                .toList(),
                          ]),
                    ],
                  ),
                ),
              ),
            ]),
          );
        },
      ),
    );
  }

  void _handleCallbackEvent(ScrollDirection direction, ScrollSuccess success,
      {int? currentIndex}) {
    print(
        "Scroll callback received with data: {direction: $direction, success: $success and index: ${currentIndex ?? 'not given'}}");
  }
}
