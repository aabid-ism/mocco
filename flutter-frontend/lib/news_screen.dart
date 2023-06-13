import "dart:io";

import "package:cached_network_image/cached_network_image.dart";
import "package:flutter/material.dart";
import "package:mocco/models/news_card.dart";
import "package:mocco/news_provider_state.dart";
import "package:provider/provider.dart";
import "package:share_plus/share_plus.dart";
import "package:tiktoklikescroller/tiktoklikescroller.dart";
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;
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
            color: Colors.grey,
            child: Stack(children: [
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
                          imageUrl: newsCards[index].imageUrl.toString(),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
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
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Container(
                      height: 74,
                      width: 200,
                      decoration: BoxDecoration(
                        color: const Color(0xFFD9D9D9),
                        borderRadius: BorderRadius.circular(37.0),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          GestureDetector(
                            onTap: () async {
                              final newsImgUrl = newsCards[index].imageUrl;
                              final url = Uri.parse(newsImgUrl ?? "");
                              final respose = await http.get(url);
                              final bytes = respose.bodyBytes;

                              final temp = await getTemporaryDirectory();
                              final shareTempFilePath =
                                  '${temp.path}/mocosharetempimg.jpg';
                              File(shareTempFilePath).writeAsBytesSync(bytes);

                              await Share.shareXFiles(
                                [XFile(shareTempFilePath)],
                                subject: newsCards[index].title,
                                text:
                                    "${newsCards[index].title}\n\n${newsCards[index].description}\n\nAuthor - ${newsCards[index].author}",
                              );
                            },
                            child: const Column(
                              children: [
                                IconButton(
                                    onPressed: null,
                                    icon:
                                        Icon(Icons.share, color: Colors.black)),
                                Text("Share",
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ),
                          GestureDetector(
                            onTap: () async {
                              !await _launchUrl(
                                      newsCards[index].sourceUrl ?? "")
                                  ? ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content:
                                            Text('Could not open the source'),
                                      ),
                                    )
                                  : null;
                            },
                            child: const Column(
                              children: [
                                IconButton(
                                    onPressed: null,
                                    icon: Icon(Icons.info_outline,
                                        color: Colors.black)),
                                Text("Source",
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              )
              /* Positioned(
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
              ), */
            ]),
          );
        },
      ),
    );
  } // build
}

Future<bool> _launchUrl(String sourceString) async {
  try {
    Uri url = Uri.parse(sourceString);
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}
