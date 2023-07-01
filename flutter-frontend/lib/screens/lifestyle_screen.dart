import 'package:flutter/material.dart';
import 'package:mocco/enum.dart';
import 'package:mocco/widgets/news.dart';

class LifestyleScreen extends StatelessWidget {
  const LifestyleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const NewsContainer(requestSource: NewsScreenUsers.lifestyleScreen);
  }
}
