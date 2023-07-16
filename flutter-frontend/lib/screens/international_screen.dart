import 'package:flutter/material.dart';
import 'package:mocco/enum.dart';
import 'package:mocco/widgets/news.dart';

class InternationalScreen extends StatelessWidget {
  const InternationalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const NewsContainer(
        requestSource: NewsScreenUsers.internationalScreen);
  }
}
