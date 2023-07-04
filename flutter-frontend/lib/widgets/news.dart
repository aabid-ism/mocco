import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mocco/app_preferences.dart';
import 'package:mocco/models/news_card.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/widgets/bottom_bar.dart';
import 'package:provider/provider.dart';
import '../enum.dart';

class NewsContainer extends StatefulWidget {
  final NewsScreenUsers requestSource;
  const NewsContainer({super.key, required this.requestSource});

  @override
  State<NewsContainer> createState() => _NewsContainerState();
}

class _NewsContainerState extends State<NewsContainer> {
  final PageController _controller = PageController();
  late NewsScreenUsers _containerReqFrom;
  List<NewsCard> newsList = [];
  @override
  Widget build(BuildContext context) {
    _containerReqFrom = widget.requestSource;
    var appState = context.watch<NewsProvider>();
    var preferencesState = context.watch<AppPreferences>();
    preferencesState.init();
    var newsCards = _containerReqFrom == NewsScreenUsers.newsScreen
        ? appState.newsModelsList
        : appState.lifestyleModelsList;

    return Scaffold(
      body: PageView.builder(
        // Build pages lazily for better performance
        scrollDirection: Axis.vertical,
        controller: _controller,
        itemCount: newsCards.length,
        itemBuilder: (BuildContext context, int index) {
          // Build page items
          return SafeArea(
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
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
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
                            langProcessor(
                                newsCards[index].title,
                                newsCards[index].sinhalaTitle ??
                                    newsCards[index].title,
                                preferencesState.isEng),
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
                            langProcessor(
                                newsCards[index].description,
                                newsCards[index].sinhalaDescription ??
                                    newsCards[index].description,
                                preferencesState.isEng),
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
          );
        },
      ),
    );
  }
}

String langProcessor(String eng, String sin, bool isEng) {
  if (!isEng) {
    if (sin.isEmpty) {
      return eng;
    }
    return sin;
  }
  return eng;
}
