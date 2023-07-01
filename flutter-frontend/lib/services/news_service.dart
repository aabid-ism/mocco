import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mocco/models/news_card.dart';

class NewsService {
  Future<List<NewsCard>> fetchAllNews(String reqUrl) async {
    // get request to api
    final uri = Uri.parse(reqUrl);
    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        // create a list of NewsCard models
        final jsonResponse = jsonDecode(response.body) as List;
        final newsModals = jsonResponse.map((obj) {
          // print("-------------------------------------------");
          // print((obj['description']));
          return NewsCard(
              id: obj['_id'],
              title: obj['title'],
              description: obj['description'],
              imageUrl: obj['imageUrl'],
              sourceUrl: obj['sourceUrl'],
              author: obj['author'],
              sourceName: obj['sourceName'],
              mainTag: obj['mainTag'],
              //secondaryTags: List<String?>.from(obj['secondaryTags']),
              locality: obj['locality'],
              createdAt: obj['createdAt']);
        }).toList();
        return newsModals;
      } else {
        // internal server error(500) or 404 error
        return [];
      }
    } on Exception catch (e) {
      print(e);
      return [];
    }
  }
}
