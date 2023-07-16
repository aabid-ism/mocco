import 'dart:convert';

import 'package:mocco/enum.dart';
import 'package:mocco/env.dart';
import 'package:mocco/models/news_card.dart';
import 'package:mocco/services/news_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoadingService {
  late SharedPreferences sharedPrefs;
  List<int?> _readPostListInt = [];

  Future<void> addToReadList(int postIndex, String? currentScreenTag) async {
    String readPostListName = (currentScreenTag == null) ? "readPostIndex" : "readPostIndex-$currentScreenTag";
    sharedPrefs = await SharedPreferences.getInstance();
    // Check if the string list exists
    var readPostList = sharedPrefs.getStringList(readPostListName) ?? [];

    // Convert the string list to a set for uniqueness check
    Set<int?> uniquePostIndexes =
        readPostList.map((value) => int.tryParse(value)).toSet();

    // Add the new postIndex only if it's not already in the set
    if (!uniquePostIndexes.contains(postIndex)) {
      uniquePostIndexes.add(postIndex);
    }

    _readPostListInt = uniquePostIndexes.toList()..sort();
    readPostList = _readPostListInt.map((value) => value.toString()).toList();
    sharedPrefs.setStringList(readPostListName, readPostList);
  }

  //Get Read Post Index
  Future<List<int>> getReadPostList(String? currentScreenTag) async {
    String readPostListName = (currentScreenTag == null) ? "readPostIndex" : "readPostIndex-$currentScreenTag";
    sharedPrefs = await SharedPreferences.getInstance();
    var readPostList = sharedPrefs.getStringList(readPostListName) ?? [];
    return readPostList.map((str) => int.parse(str)).toList();
  }

  //Only use for testing uses
  Future<void> clearSharedPrefs() async {
    sharedPrefs = await SharedPreferences.getInstance();
    sharedPrefs.clear();
  }

  // Future<List<NewsCard>> removeReadPost(List<NewsCard> newsList) async {
  //   sharedPrefs = await SharedPreferences.getInstance();
  //   _readPostList = sharedPrefs.getStringList(_readPostListName) ?? [];
  //   _readPostListInt = _readPostList
  //       .map((readPostIndexSting) => int.tryParse(readPostIndexSting))
  //       .toList();
  //   return newsList
  //       .where((newsCard) => !_readPostListInt.contains(newsCard.postIndex))
  //       .toList();
  // }

  Future<List<NewsCard>> loadNextPosts(NewsScreenUsers postFor,
      List<int> postConsideredAsReadList, String? tag) async {
    final newsService = NewsService();
    var actualReadPostList = await getReadPostList(tag);
    var postPath = "";
    Set<int> mergedSet = {...actualReadPostList, ...postConsideredAsReadList};
    List<int> mergedAndSortedReadPost = mergedSet.toList()..sort();
    var readPostReqBody =
        jsonEncode({'readPostIndices': mergedAndSortedReadPost});
    switch (postFor) {
      case NewsScreenUsers.newsScreen:
        postPath = "/news/";
        break;
      case NewsScreenUsers.lifestyleScreen:
        postPath = "/lifestyle/";
        break;
      case NewsScreenUsers.explorerScreen:
        if (tag != null && tag.isNotEmpty) {
          postPath = "/tag/?reqTag=$tag";
        }
        break;
    }

    var nextPostList = await newsService.fetchAllNews(
        "$serverUrl/handleloading$postPath",
        reqBody: readPostReqBody);
    return nextPostList;
  }
}
