import 'package:flutter/material.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/news_screen.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => NewsProvider(),
      child: MaterialApp(
        title: 'Mocco',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.white),
        ),
        home: const ScreensHolder(),
      ),
    );
  }
}

// Show the main News Page or Lifestyle Page or Saved news page
class ScreensHolder extends StatefulWidget {
  const ScreensHolder({super.key});

  @override
  State<ScreensHolder> createState() => _ScreensHolderState();
}

class _ScreensHolderState extends State<ScreensHolder> {
  @override
  void initState() { // Fetch news data before NewsScreen build
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) async {
      await Provider.of<NewsProvider>(context, listen: false)
          .fetchNewsFromService();
    });
  }

  @override
  Widget build(BuildContext context) {
    return const NewsScreenContainer();
  }
}
