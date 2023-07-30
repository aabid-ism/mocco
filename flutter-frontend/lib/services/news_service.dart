import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:mocco/models/news_card.dart';

class NewsService {
  Future<List<NewsCard>> fetchAllNews(String reqUrl,
      {String? reqBody, String? method}) async {
    // get request to api
    final uri = Uri.parse(reqUrl);
    try {
      var headers = {'Content-Type': 'application/json'};
      var request = http.Request(method ?? "GET", uri);
      request.body = reqBody ?? "";
      request.headers.addAll(headers);
      http.StreamedResponse response = await request.send();

      if (response.statusCode == 200) {
        // create a list of NewsCard models
        final jsonResponse = await response.stream.bytesToString();
        final decodedResponse = jsonDecode(jsonResponse) as List;
        final newsModals = decodedResponse.map((obj) {
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
              secondaryTags: List<String?>.from(obj['secondaryTags']),
              locality: obj['locality'],
              createdAt: DateTime.tryParse(obj['createdAt']),
              sinhalaDescription: obj['sinhalaDescription'],
              sinhalaTitle: obj['sinhalaTitle'],
              postIndex: obj['postIndex'],
              typeOfPost: obj['typeOfPost']);
        }).toList();

        //newsModals.sort((a, b) => b.createdAt!.compareTo(a.createdAt!));
        return newsModals;
      } else {
        // internal server error(500) or 404 error
        return [];
      }
    } on Exception catch (e) {
      if (kDebugMode) {
        print(e);
      }
      return [];
    }
  }
}
