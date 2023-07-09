import 'package:mocco/enum.dart';
import 'package:mocco/env.dart';
import 'package:mocco/models/news_card.dart';
import 'package:mocco/services/news_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoadingService {
  late SharedPreferences sharedPrefs;
  late List<String> _readPostList;
  final String _readPostListName = "readPostIndex";
  List<int?> _readPostListInt = [];

  Future<void> addToReadList(int postIndex) async {
    sharedPrefs = await SharedPreferences.getInstance();
    // Check if the string list exists
    _readPostList = sharedPrefs.getStringList(_readPostListName) ?? [];

    // Convert the string list to a set for uniqueness check
    Set<int?> uniquePostIndexes =
        _readPostList.map((value) => int.tryParse(value)).toSet();

    // Add the new postIndex only if it's not already in the set
    if (!uniquePostIndexes.contains(postIndex)) {
      uniquePostIndexes.add(postIndex);
    }

    _readPostListInt = uniquePostIndexes.toList()..sort();
    _readPostList = _readPostListInt.map((value) => value.toString()).toList();
    sharedPrefs.setStringList(_readPostListName, _readPostList);
  }

  //Only use for testing uses
  Future<void> clearSharedPrefs() async {
    sharedPrefs = await SharedPreferences.getInstance();
    sharedPrefs.clear();
  }

  Future<List<NewsCard>> removeReadPost(List<NewsCard> newsList) async {
    sharedPrefs = await SharedPreferences.getInstance();
    _readPostList = sharedPrefs.getStringList(_readPostListName) ?? [];
    _readPostListInt = _readPostList
        .map((readPostIndexSting) => int.tryParse(readPostIndexSting))
        .toList();
    return newsList
        .where((newsCard) => !_readPostListInt.contains(newsCard.postIndex))
        .toList();
  }

  Future<List<NewsCard>> loadNextPosts(
    NewsScreenUsers postFor,
    int lastPostIndex,
    String? tag,
  ) async {
    final newsService = NewsService();
    var postPath = "";

    switch (postFor) {
      case NewsScreenUsers.newsScreen:
        postPath = "loadposts/news/?ref_postIndex=$lastPostIndex";
        break;
      case NewsScreenUsers.lifestyleScreen:
        postPath = "loadposts/lifestyle/?ref_postIndex=$lastPostIndex";
        break;
      case NewsScreenUsers.explorerScreen:
        if (tag != null && tag.isNotEmpty) {
          postPath = "loadposts/tag/?ref_postIndex=$lastPostIndex&req_tag=$tag";
        }
        break;
    }

    var nextPostList = await newsService.fetchAllNews("$serverUrl/$postPath");
    var filteredNextPostList = removeReadPost(nextPostList);
    return filteredNextPostList;
  }
}
