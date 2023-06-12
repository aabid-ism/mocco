import "package:cached_network_image/cached_network_image.dart";
import "package:flutter/material.dart";
import "package:mocco/models/news_card.dart";
import "package:mocco/news_provider_state.dart";
import "package:provider/provider.dart";
import "package:tiktoklikescroller/tiktoklikescroller.dart";

class NewsScreenContainer extends StatefulWidget {
  const NewsScreenContainer({super.key});

  @override
  State<NewsScreenContainer> createState() => _NewsScreenContainerState();
}

class _NewsScreenContainerState extends State<NewsScreenContainer> {
  List<NewsCard> newsList = [];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) async {
      await Provider.of<NewsProvider>(context, listen: false)
          .fetchNewsFromService();
      // newsList =
      //     Provider.of<NewsProvider>(context, listen: false).newsModelsList;
    });
  }

  @override
  Widget build(BuildContext context) {
    //  subscribing to the nearest newsprovider in widget tree
    var appState = context.watch<NewsProvider>();

    // get a reference to the newsCards inside the provider

    var newsCards = appState.newsModelsList;
    // controller for debugging purposes

    var controller = Controller();
    return Scaffold(
      body: TikTokStyleFullPageScroller(
        contentSize: newsCards.length,
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
                        imageUrl: newsCards[index].imageUrl.toString()),
                    Text(
                      '${newsCards[index].title}',
                      key: Key('$index-title'),
                      style: const TextStyle(fontSize: 22, color: Colors.white),
                    ),
                    Text(
                      '${newsCards[index].description}',
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
                            ...Iterable<int>.generate(newsCards.length)
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
                            ...Iterable<int>.generate(newsCards.length)
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
  } // build
}
