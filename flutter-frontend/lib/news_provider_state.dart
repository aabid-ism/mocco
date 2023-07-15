import "dart:convert";
import "package:flutter/material.dart";
import "package:mocco/enum.dart";
import "package:mocco/models/news_card.dart";
import "package:mocco/services/loading_service.dart";
import "package:mocco/services/news_service.dart";
import "env.dart";

class NewsProvider extends ChangeNotifier {
  // declaring state variables
  List<NewsCard> newsModelsList = [];
  List<NewsCard> lifestyleModelsList = [];
  List<NewsCard> notificationResponse = [];
  List<NewsCard> tagResponse = [];
  NewsScreenUsers notificationFor = NewsScreenUsers.newsScreen;

  // creating a Service object that gives access to a method to get the news from server
  final newsService = NewsService();
  final LoadingService loadingService = LoadingService();

  // fetch newsModelsLists
  Future<void> fetchNewsFromService(BuildContext context,
      {int? postIndex, String? tag}) async {
    //loadingService.clearSharedPrefs();

    //Get read post list
    var readPostList = await loadingService.getReadPostList(tag);
    var readPostReqBody = jsonEncode({'readPostIndices': readPostList});

    //Get Notification Posts
    if (postIndex != null) {
      notificationResponse = await newsService
          .fetchAllNews('$serverUrl/news/exact-post?postIndex=$postIndex');
    }

    //Get Tag Posts
    if (tag != null) {
      tagResponse = await newsService.fetchAllNews(
          '$serverUrl/handleloading/tag?reqTag=$tag',
          reqBody: readPostReqBody);
    }

    //Get posts for news & Lifestule
    newsModelsList = await newsService.fetchAllNews(
        '$serverUrl/handleloading/news',
        reqBody: readPostReqBody);
    lifestyleModelsList = await newsService.fetchAllNews(
        '$serverUrl/handleloading/lifestyle',
        reqBody: readPostReqBody);

    //Show error message on empty responds
    if (newsModelsList.isEmpty ||
        newsModelsList.isEmpty ||
        (postIndex != null && notificationResponse.isEmpty) ||
        (tag != null && tagResponse.isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Colors.redAccent,
          content: Text('Please Connect to the Internet'),
        ),
      );
    }

    if (notificationResponse.isNotEmpty) {
      if (notificationResponse[0].typeOfPost == "lifestyle") {
        _updateNotificationPost(lifestyleModelsList, notificationResponse[0]);
        notificationFor = NewsScreenUsers.lifestyleScreen;
      } else {
        _updateNotificationPost(newsModelsList, notificationResponse[0]);
        notificationFor = NewsScreenUsers.newsScreen;
      }
    }
    notifyListeners();
  }

  void _updateNotificationPost(
      List<NewsCard> newsList, NewsCard notificationPost) {
    int index = newsList.indexWhere(
        (newsCard) => newsCard.postIndex == notificationPost.postIndex);
    if (index != -1) {
      newsList.removeAt(index);
    }
    newsList.insert(0, notificationPost);
  }
}
