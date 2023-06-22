import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mocco/models/news_card.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/widgets/bottom_bar.dart';
import 'package:provider/provider.dart';

class NewsScreenContainer extends StatefulWidget {
  const NewsScreenContainer({Key? key}) : super(key: key);

  @override
  State<NewsScreenContainer> createState() => _NewsScreenContainerState();
}

class _NewsScreenContainerState extends State<NewsScreenContainer> {
  final _controller = PageController();
  List<NewsCard> newsList = [];

  @override
  Widget build(BuildContext context) {
    var appState = context.watch<NewsProvider>();
    var newsCards = appState.newsModelsList;

    return Scaffold(
      body: PageView.builder(
        key: const PageStorageKey('newsScreenPageView'), // Add PageStorageKey
        // Build pages lazily for better performance
        scrollDirection: Axis.vertical,
        controller: _controller,
        itemCount: newsCards.length,
        itemBuilder: (BuildContext context, int index) {
          // Build page items
          return KeepAlive( //Keep page preserved even when the page  not currently visible in the PageView
            keepAlive: true,
            child: PageStorage(
              //Create storage bucket
              bucket: PageStorageBucket(),
              child: SafeArea(
                child: Stack(
                  children: [
                    Container(
                      height: MediaQuery.of(context).size.height / 3,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.5),
                            spreadRadius: 5,
                            blurRadius: 7,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Align(
                        alignment: Alignment.topCenter,
                        child: CachedNetworkImage(
                          placeholder: (context, url) => const Center(
                            child: CircularProgressIndicator(),
                          ),
                          imageUrl: newsCards[index].imageUrl ?? "",
                          errorWidget: (context, url, error) => const Center(
                            child: SizedBox(
                              height: 90,
                              child: Column(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                children: [
                                  Icon(Icons.error, size: 48),
                                  SizedBox(height: 20),
                                  Text(
                                    "The image could not be loaded",
                                    style: TextStyle(
                                      fontSize: 17,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  )
                                ],
                              ),
                            ),
                          ),
                          fit: BoxFit.cover,
                          height: MediaQuery.of(context).size.height /
                              3, //Set image size to 1/3 of the screen
                          width: double.infinity,
                        ),
                      ),
                    ),
                    Positioned(
                      right: 20,
                      top: (MediaQuery.of(context).size.height / 3) -
                          11.5, // Position mainTag teblet
                      child: Container(
                        decoration: BoxDecoration(
                          color: const Color.fromARGB(255, 255, 209, 139),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withOpacity(0.5),
                              spreadRadius: 2,
                              blurRadius: 5,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(21, 4, 21, 5),
                          child: Text(
                            newsCards[index].mainTag ?? "mocco",
                            style: const TextStyle(
                              fontSize: 14.0,
                              color: Colors.black,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      top: (MediaQuery.of(context).size.height /
                          3), //Start contet from where news image ends
                      child: SizedBox(
                        width: MediaQuery.of(context)
                            .size
                            .width, //Set content area to max display size
                        child: Padding(
                          padding: const EdgeInsets.all(21),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment
                                .start, //Align items from left-to-right in cross axis
                            children: [
                              Text(
                                newsCards[index].title ?? "",
                                key: Key('$index-title'),
                                style: const TextStyle(
                                  fontSize: 24,
                                  color: Colors.black,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(
                                height: 10,
                              ),
                              Text(
                                newsCards[index].description ?? "",
                                key: Key('$index-description'),
                                style: const TextStyle(
                                    fontSize: 18, color: Colors.black87),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 60,
                      left: 0,
                      right: 0,
                      child: Center(
                        child: BottomBar(
                          newsCard: newsCards[index],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
