import 'dart:convert';
import 'package:mocco/enum.dart';
import 'package:mocco/env.dart';
import 'package:mocco/models/news_card.dart';
import 'package:mocco/services/news_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoadingService {
  late SharedPreferences sharedPrefs;

  Future<void> addToPostIndexList(int postIndex,
      {String? currentScreenTag}) async {
    String postIndexListName = _getPostIndexListName(currentScreenTag);

    sharedPrefs = await SharedPreferences.getInstance();
    // Check if the string list exists
    var readPostList = sharedPrefs.getStringList(postIndexListName) ?? [];

    // Convert the string list to a set for uniqueness check
    Set<int?> uniquePostIndexes =
        readPostList.map((value) => int.tryParse(value)).toSet();

    // Add the new postIndex only if it's not already in the set
    if (!uniquePostIndexes.contains(postIndex)) {
      uniquePostIndexes.add(postIndex);
    }

    List<int?> postIndexListInt = uniquePostIndexes.toList()..sort();
    readPostList = postIndexListInt.map((value) => value.toString()).toList();
    sharedPrefs.setStringList(postIndexListName, readPostList);
  }

  Future<void> removeFromPostIndexList(int postIndex,
      {String? currentScreenTag}) async {
    String postIndexListName = _getPostIndexListName(currentScreenTag);

    sharedPrefs = await SharedPreferences.getInstance();
    // Check if the string list exists
    var readPostList = sharedPrefs.getStringList(postIndexListName) ?? [];

    // Remove the postIndex from the set if it exists
    if (readPostList.contains(postIndex.toString())) {
      readPostList.remove(postIndex.toString());
    }

    sharedPrefs.setStringList(postIndexListName, readPostList);
  }

  //Get Read Post Index
  Future<List<int>> getPostIndexList({String? currentScreenTag}) async {
    String postIndexListName = _getPostIndexListName(currentScreenTag);

    sharedPrefs = await SharedPreferences.getInstance();
    var readPostList = sharedPrefs.getStringList(postIndexListName) ?? [];
    return readPostList.map((str) => int.parse(str)).toList();
  }

  //Get shared preference name for the index list
  String _getPostIndexListName(String? currentScreenTag) {
    bool isSave = currentScreenTag == "saved";
    String postIndexListName;
    if (!isSave) {
      postIndexListName = (currentScreenTag == null)
          ? "readPostIndex"
          : "readPostIndex-$currentScreenTag";
    } else {
      postIndexListName = "savePostIndex";
    }
    return postIndexListName;
  }

  //Only use for testing uses
  Future<void> clearSharedPrefs() async {
    sharedPrefs = await SharedPreferences.getInstance();
    sharedPrefs.clear();
  }

  // Future<List<NewsCard>> removeReadPost(List<NewsCard> newsList) async {
  //   sharedPrefs = await SharedPreferences.getInstance();
  //   _readPostList = sharedPrefs.getStringList(_readPostListName) ?? [];
  //   postIndexListInt = _readPostList
  //       .map((readPostIndexSting) => int.tryParse(readPostIndexSting))
  //       .toList();
  //   return newsList
  //       .where((newsCard) => !postIndexListInt.contains(newsCard.postIndex))
  //       .toList();
  // }

  Future<List<NewsCard>> loadNextPosts(NewsScreenUsers postFor,
      List<int> postConsideredAsReadList, {String? tag, int? lastPostInList}) async {
    final newsService = NewsService();
    var isSaved = tag == "saved" ? true : false;
    var postPath = "";
    var reqBody = "";
    var actualReadPostList = await getPostIndexList(currentScreenTag: tag);
    if (!isSaved) {
      Set<int> mergedSet = {...actualReadPostList, ...postConsideredAsReadList};
      List<int> mergedAndSortedReadPost = mergedSet.toList()..sort();
      reqBody =
          jsonEncode({'readPostIndices': mergedAndSortedReadPost});
    } else {
      List<int> savedPostListSelection = actualReadPostList.where((lastIndex) => lastIndex > lastPostInList!).toList();
      if (savedPostListSelection.isEmpty){
        return Future.value([]);
      }
      reqBody = jsonEncode({"postIndex": savedPostListSelection});
    }

    switch (postFor) {
      case NewsScreenUsers.localScreen:
        postPath = "handleLoading/local-news/";
        break;
      case NewsScreenUsers.internationalScreen:
        postPath = "handleLoading/international-news/";
        break;
      case NewsScreenUsers.explorerScreen:
        if (isSaved) {
          postPath = "news/get-news-by-post-index/";
        }
        if (tag != null && tag.isNotEmpty && !isSaved) {
          postPath = "handleLoading/tag/?reqTag=$tag";
        }
        break;
    }

    var nextPostList = await newsService.fetchAllNews("$serverUrl/$postPath",
        reqBody: reqBody, method: isSaved ? "POST" : "GET");
    return nextPostList;
  }
}
