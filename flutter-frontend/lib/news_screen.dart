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
      body: PageView.builder(// Build pages lazily for better performance 
        scrollDirection: Axis.vertical,
        controller: _controller,
        itemCount: newsCards.length,
        itemBuilder: (BuildContext context, int index) {// Build page items 
          return SizedBox( // full page container
            height: MediaQuery.of(context).size.height, 
            child: Stack(
              children: [
                SafeArea(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: MediaQuery.of(context).size.height / 3,
                        width: double.infinity,
                        child: AspectRatio(
                          aspectRatio: 16 / 9,
                          child: CachedNetworkImage(
                            placeholder: (context, url) => const Center(
                              child: CircularProgressIndicator(),
                            ),
                            imageUrl: newsCards[index].imageUrl ?? "",
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 15, 20, 15),
                        child: Text(
                          '${newsCards[index].title}',
                          key: Key('$index-title'),
                          style: const TextStyle(
                              fontSize: 22, color: Colors.black),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 0, 20, 5),
                        child: Text(
                          '${newsCards[index].description}',
                          key: Key('$index-description'),
                          style: const TextStyle(
                              fontSize: 18, color: Colors.black87),
                        ),
                      ),
                    ],
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
