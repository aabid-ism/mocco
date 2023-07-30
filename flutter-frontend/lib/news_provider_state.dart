import "dart:convert";
import "package:flutter/material.dart";
import "package:mocco/models/news_card.dart";
import "package:mocco/services/loading_service.dart";
import "package:mocco/services/news_service.dart";
import "env.dart";

class NewsProvider extends ChangeNotifier {
  // declaring state variables
  List<NewsCard> newsModelsList = [];
  List<NewsCard> internationalModelsList = [];
  List<NewsCard> notificationResponse = [];
  List<NewsCard> tagResponse = [];

  // creating a Service object that gives access to a method to get the news from server
  final newsService = NewsService();
  final LoadingService loadingService = LoadingService();
  List<int> savedPostList = [];
  List<int> savedPostListFirstFifty = [];

  // fetch newsModelsLists
  // Send value for fetchReqFrom property if req is not from localScreen or internationalScreen
  Future<void> fetchNewsFromService({int? postIndex, String? tag}) async {
    //Get read post list
    String savedPostReqBody = "";
    bool isSaved = tag == "saved";
    var readPostList = await loadingService.getPostIndexList(
        currentScreenTag: !isSaved ? tag : null);
    var readPostReqBody = jsonEncode({'readPostIndices': readPostList});

    //Get Tag Posts
    if (tag != null) {
      if (tag == "today") {
        DateTime currentDate = DateTime.now();
        String isoDateString = currentDate.toIso8601String();
        tagResponse = await newsService.fetchAllNews(
            '$serverUrl/handleLoading/today?todayDateTime=$isoDateString%2b05:30');
      } else if (isSaved) {
        savedPostList =
            await loadingService.getPostIndexList(currentScreenTag: tag);
        savedPostListFirstFifty = savedPostList.take(50).toList();
        savedPostReqBody = jsonEncode({"postIndex": savedPostListFirstFifty});
        tagResponse = await newsService.fetchAllNews(
            '$serverUrl/news/get-news-by-post-index',
            reqBody: savedPostReqBody, method: "POST");
      } else {
        tagResponse = await newsService.fetchAllNews(
            '$serverUrl/handleLoading/tag?reqTag=$tag',
            reqBody: readPostReqBody);
      }
    }

    //Get Notification Posts
    if (postIndex != null) {
      notificationResponse = await newsService
          .fetchAllNews('$serverUrl/news/exact-post?postIndex=$postIndex');
    }

    //Get posts for news & Lifestule
    newsModelsList = await newsService.fetchAllNews(
        '$serverUrl/handleLoading/local-news',
        reqBody: readPostReqBody);
    internationalModelsList = await newsService.fetchAllNews(
        '$serverUrl/handleLoading/international-news',
        reqBody: readPostReqBody);

    // //Show error message on empty responds
    // if (newsModelsList.isEmpty ||
    //     newsModelsList.isEmpty ||
    //     (postIndex != null && notificationResponse.isEmpty) ||
    //     (tag != null && tagResponse.isEmpty)) {
    //   ScaffoldMessenger.of(context).showSnackBar(
    //     const SnackBar(
    //       backgroundColor: Colors.redAccent,
    //       content: Text('Please Connect to the Internet'),
    //     ),
    //   );
    // }

    //Insert notification post to top of the newsList
    if (notificationResponse.isNotEmpty) {
      int index = newsModelsList.indexWhere((newsCard) =>
          newsCard.postIndex == notificationResponse[0].postIndex);
      if (index != -1) {
        newsModelsList.removeAt(index);
      }
      newsModelsList.insert(0, notificationResponse[0]);
    }
    notifyListeners();
  }
}
