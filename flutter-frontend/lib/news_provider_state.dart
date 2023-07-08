import "package:flutter/material.dart";
import "package:mocco/enum.dart";
import "package:mocco/models/news_card.dart";
import "package:mocco/services/news_service.dart";
import "env.dart";

class NewsProvider extends ChangeNotifier {
  String url = serverUrl;

  // declaring state variables
  List<NewsCard> newsModelsList = [];
  List<NewsCard> lifestyleModelsList = [];
  List<NewsCard> notificationResponse = [];
  bool isLoading = false;
  NewsScreenUsers notificationFor = NewsScreenUsers.newsScreen;
  // creating a Service object that gives access to a method
  // to get the news from server
  final newsService = NewsService();

  // get the list of NewsCards from the service and assign to
  // newsModelsList
  Future<void> fetchNewsFromService(BuildContext context, {int? postIndex}) async {
    isLoading = true;
    notifyListeners();
    if (postIndex != null) {
      notificationResponse =
      await newsService.fetchAllNews('$serverUrl/exact-post?postIndex=$postIndex');
    }
    final newsResponse = await newsService.fetchAllNews('$serverUrl/feed');
    final lifestyleResponse =
    await newsService.fetchAllNews('$serverUrl/lifestyle');
    if (newsResponse.isEmpty || lifestyleResponse.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        //Show snack bar msg if failed the launch
        const SnackBar(
          backgroundColor: Colors.redAccent,
          content: Text('Please Connect to the Internet'),
        ),
      );
    }
    newsModelsList = newsResponse;
    lifestyleModelsList = lifestyleResponse;

    if (notificationResponse.isNotEmpty) {
      if (notificationResponse[0].typeOfPost == "lifestyle") {
        _updateNotificationPost(lifestyleModelsList, notificationResponse[0]);
        notificationFor = NewsScreenUsers.lifestyleScreen;
      } else {
        _updateNotificationPost(newsModelsList, notificationResponse[0]);
        notificationFor = NewsScreenUsers.newsScreen;
      }
    }
    isLoading = false;
    notifyListeners();
  }

  void _updateNotificationPost(List<NewsCard> newsList,NewsCard notificationPost){
      int index = newsList.indexWhere(
          (newsCard) => newsCard.postIndex == notificationPost.postIndex);
      if (index != -1) {
        newsList.removeAt(index);
      }
      newsList.insert(0, notificationPost);
  }
}