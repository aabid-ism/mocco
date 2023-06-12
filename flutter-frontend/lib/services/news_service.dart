import 'dart:convert';

import 'package:http/http.dart' as http;
import "package:mocco/env.dart";
import 'package:mocco/models/news_card.dart';

class NewsService {
  Future<List<NewsCard>> fetchAllNews() async {
    // get request to api
    const url = serverUrl;
    final uri = Uri.parse(url);
    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        // create a list of NewsCard models
        final jsonResponse = jsonDecode(response.body) as List;
        final newsModals = jsonResponse.map((obj) {
          return NewsCard(
              id: obj['_id'],
              title: obj['title'],
              description: obj['description']
              // imageUrl: obj['imageUrl']
              );
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
