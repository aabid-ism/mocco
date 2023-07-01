import "package:flutter/material.dart";
import "package:mocco/models/news_card.dart";
import "package:mocco/services/news_service.dart";

import "env.dart";

class NewsProvider extends ChangeNotifier {
  String url = serverUrl;
  // declaring state variables
  List<NewsCard> newsModelsList = [];
  List<NewsCard> lifestyleModelsList = [];
  bool isLoading = false;

  // creating a Service object that gives access to a method
  // to get the news from server
  final newsService = NewsService();

  // get the list of NewsCards from the service and assign to
  // newsModelsList
  Future<void> fetchNewsFromService(BuildContext context) async {
    isLoading = true;
    notifyListeners();

    final newsResponse = await newsService.fetchAllNews(serverUrl);
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
    isLoading = false;
    notifyListeners();
  }
}
