import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mocco/app_preferences.dart';
import 'package:mocco/enum.dart';
import 'package:mocco/env.dart';
import 'package:mocco/models/news_card.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/services/loading_service.dart';
import 'package:mocco/theme/theme_switcher.dart';
import 'package:mocco/widgets/bottom_bar.dart';
import 'package:mocco/widgets/scroll_donw.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class NewsContainer extends StatefulWidget {
  final NewsScreenUsers requestSource;
  final String? tag;

  const NewsContainer({Key? key, required this.requestSource, this.tag})
      : super(key: key);

  @override
  State<NewsContainer> createState() => _NewsContainerState();
}

class _NewsContainerState extends State<NewsContainer> {
  final PageController _controller = PageController();
  late NewsScreenUsers _containerReqFrom;
  List<NewsCard> newsList = [];
  final LoadingService loadingService = LoadingService();
  late bool isFirstLaunch = false;

  @override
  void initState() {
    super.initState();
    _checkFirstLaunch();
  }

  @override
  Widget build(BuildContext context) {
    String? tag = widget.tag;
    bool isSaved = tag == "saved";
    _containerReqFrom = widget.requestSource;
    var appState = context.watch<NewsProvider>();
    var preferencesState = context.watch<AppPreferences>();
    preferencesState.init();
    List<NewsCard> newsCards = [];
    var currentPageIndex = 0;

    if (_containerReqFrom == NewsScreenUsers.localScreen) {
      newsCards = appState.newsModelsList;
    } else if (_containerReqFrom == NewsScreenUsers.internationalScreen) {
      newsCards = appState.internationalModelsList;
    } else {
      newsCards = appState.tagResponse;
    }
    if (newsCards.isNotEmpty && !isSaved) {
      loadingService.addToPostIndexList(newsCards[0].postIndex,
          currentScreenTag: tag);
    }

    //Clear application cache for testing
    //loadingService.clearSharedPrefs();

    return Scaffold(
      backgroundColor: AppColors.bg,
      body: PageView.builder(
        // Build pages lazily for better performance
        scrollDirection: Axis.vertical,
        controller: _controller,
        itemCount: newsCards.length,
        onPageChanged: (index) async {
          if (currentPageIndex < index) {
            currentPageIndex = index;
            if (!(isSaved)) {
              loadingService.addToPostIndexList(newsCards[index].postIndex,
                  currentScreenTag: tag);
            }
          }
          if (newsCards.length - loadPostBefore == index) {
            var sortedNews = List<NewsCard>.from(newsCards);
            sortedNews.sort(
                (card1, card2) => card1.postIndex.compareTo(card2.postIndex));
            var nextPostList = await loadingService.loadNextPosts(
                _containerReqFrom, newsCards.getPostIndexAfter(index),
                tag: tag, lastPostInList: sortedNews.last.postIndex);
            if (nextPostList != []) {
              setState(() {
                newsCards.addAll(nextPostList);
              });
            }
          }
          if (newsCards.length == index + 1) {
            Get.rawSnackbar(
                messageText: Text(
                  'You have caught up with all ${!(tag == "saved") ? "new" : "saved"} stories!',
                  style: TextStyle(color: AppColors.text, fontSize: 15),
                  textAlign: TextAlign.center,
                ),
                isDismissible: true,
                duration: const Duration(seconds: 10),
                backgroundColor: AppColors.secondary,
                icon: Icon(
                  Icons.done_all,
                  color: AppColors.text,
                  size: 30,
                ),
                margin: EdgeInsets.zero,
                snackStyle: SnackStyle.GROUNDED);
          }
        },
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
                        color: AppColors.text.withOpacity(0.15),
                        spreadRadius: 4,
                        blurRadius: 10,
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
                      height: MediaQuery.of(context).size.height / 3,
                      //Set image size to 1/3 of the screen
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
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(15),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.15),
                          spreadRadius: 4,
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(21, 4, 21, 5),
                      child: Text(
                        newsCards[index].mainTag ?? "mocco",
                        style: TextStyle(
                          fontSize: 14.0,
                          color: AppColors.text,
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
                        crossAxisAlignment: CrossAxisAlignment.start,
                        //Align items from left-to-right in cross axis
                        children: [
                          Text(
                            langProcessor(
                                newsCards[index].title,
                                newsCards[index].sinhalaTitle ??
                                    newsCards[index].title,
                                preferencesState.isEng),
                            key: Key('$index-title'),
                            style: TextStyle(
                              color: AppColors.text,
                              fontSize: preferencesState.isEng
                                  ? 24
                                  : (newsCards[index].sinhalaTitle == ""
                                      ? 24
                                      : 22),
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
                            style: TextStyle(
                              color: AppColors.text,
                              fontSize: preferencesState.isEng
                                  ? 18
                                  : (newsCards[index].sinhalaTitle == ""
                                      ? 18
                                      : 17),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                Visibility(
                  visible: _containerReqFrom == NewsScreenUsers.explorerScreen,
                  child: Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    child: SafeArea(
                      child: Stack(
                        children: [
                          Container(
                            height: MediaQuery.of(context).size.height / 8,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: const Alignment(0, .2),
                                colors: [
                                  Colors.black.withOpacity(
                                      0.5), // starting color (20% transparent)
                                  Colors.black.withOpacity(0), // endinrent)
                                ],
                              ),
                            ),
                          ),
                          Positioned(
                            child: Padding(
                              padding: const EdgeInsets.fromLTRB(6, 10, 6, 6),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    toPascalCase(tag ?? ""),
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          Positioned(
                            child: IconButton(
                              icon: const Icon(
                                Icons.arrow_back_ios_rounded,
                                color: Colors.white,
                              ),
                              onPressed: () {
                                Navigator.pop(context);
                              },
                            ),
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
                        loadingService: loadingService),
                  ),
                ),
                Visibility(
                  visible: isFirstLaunch && index == 0,
                  child: const Positioned(
                    bottom: 17,
                    left: 0,
                    right: 0,
                    child: ScrollDown(),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Future<void> _checkFirstLaunch() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool isFirst = prefs.getBool('is_first_launch') ?? true;
    setState(() {
      isFirstLaunch = isFirst;
    });
    if (isFirst) {
      prefs.setBool('is_first_launch', false);
    }
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

String toPascalCase(String text) {
  try {
    List<String> words = text.trim().split(' ');
    String result = '';

    for (String word in words) {
      result += word[0].toUpperCase() + word.substring(1).toLowerCase();
    }

    return result;
  } catch (e) {
    return text;
  }
}
