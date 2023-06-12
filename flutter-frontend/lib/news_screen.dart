import "package:flutter/material.dart";
import "package:mocco/models/news_card.dart";
import "package:mocco/news_provider_state.dart";
import "package:provider/provider.dart";

class NewsScreenContainer extends StatefulWidget {
  const NewsScreenContainer({super.key});

  @override
  State<NewsScreenContainer> createState() => _NewsScreenContainerState();
}

class _NewsScreenContainerState extends State<NewsScreenContainer> {
  List<NewsCard> newsList = [];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) async {
      await Provider.of<NewsProvider>(context, listen: false)
          .fetchNewsFromService();
      newsList =
          Provider.of<NewsProvider>(context, listen: false).newsModelsList;
    });
  }

  @override
  Widget build(BuildContext context) {
    var appState = context.watch<NewsProvider>();
    return Scaffold(
        body: Container(
      color: Colors.white,
      child: SafeArea(
        child: Container(
            color: Colors.white,
            child: Column(
              children: [
                Row(
                  children: [Text(appState.newsModelsList[0].title.toString())],
                ),
                Row(),
              ],
            )),
      ),
    ));
  } // build
}
