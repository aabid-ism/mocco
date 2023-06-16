import "package:cached_network_image/cached_network_image.dart";
import "package:flutter/material.dart";
import "package:mocco/models/news_card.dart";
import "package:mocco/news_provider_state.dart";
import "package:mocco/widgets/bottom_bar.dart";
import "package:provider/provider.dart";
import "package:tiktoklikescroller/tiktoklikescroller.dart";
import 'package:path_provider/path_provider.dart';

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
            color: Colors.white,
            // A stack is used to place the bottombar on top of the news screen
            child: Stack(children: [
              // The safe area encloses the news card contents to avoid image
              // overflowing to the top
              SafeArea(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    // The Sizedbox holds the image of the newscard
                    SizedBox(
                      height: MediaQuery.of(context).size.height /
                          3, //Set news image to 1/3rd of screen height
                      width: double.infinity,
                      child: AspectRatio(
                        // Avoid content from streaching
                        aspectRatio: 16 / 9,
                        child: CachedNetworkImage(
                          placeholder: (context, url) => const Center(
                            child: CircularProgressIndicator(),
                          ),
                          imageUrl: newsCards[index].imageUrl.toString(),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    // News Title
                    Text(
                      '${newsCards[index].title}',
                      key: Key('$index-title'),
                      style: const TextStyle(fontSize: 22, color: Colors.black),
                    ),
                    // News Description
                    Text(
                      '${newsCards[index].description}',
                      key: Key('$index-description'),
                      style:
                          const TextStyle(fontSize: 18, color: Colors.black87),
                    ),
                  ],
                ),
              ),
              // Positioned widget holds the Bottom Bar
              Positioned(
                bottom: 60,
                left: 0,
                right: 0,
                child: Center(
                  //Bottom Bar
                  child: BottomBar(
                    newsCard: newsCards[index],
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
