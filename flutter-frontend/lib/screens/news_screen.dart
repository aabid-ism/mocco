import 'package:flutter/material.dart';
import 'package:mocco/enum.dart';
import 'package:mocco/widgets/news.dart';

class NewsScreenContainer extends StatelessWidget {
  const NewsScreenContainer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const NewsContainer(requestSource: NewsScreenUsers.newsScreen);
  }
}
