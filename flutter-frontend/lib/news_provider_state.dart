import "package:flutter/material.dart";
import "package:mocco/models/news_card.dart";
import "package:mocco/services/news_service.dart";
import "package:provider/provider.dart";

class NewsProvider extends ChangeNotifier {
  // declaring state variables
  List<NewsCard> newsModelsList = [];
  bool isLoading = false;

  // creating a Service object that gives access to a method
  // to get the news from server
  final newsService = NewsService();

  // get the list of NewsCards from the service and assign to
  // newsModelsList
  Future<void> fetchNewsFromService(BuildContext context) async {
    isLoading = true;
    notifyListeners();

    final response = await newsService.fetchAllNews();
    if (response.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        //Show snack bar msg if failed the launch
        const SnackBar(
          backgroundColor: Colors.redAccent,
          content: Text('Please Connect to the Internet'),
        ),
      );
    }
    newsModelsList = response;
    isLoading = false;
    notifyListeners();
  }
}
