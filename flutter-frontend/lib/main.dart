import 'package:flutter/material.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/screen_holder.dart';
import 'package:mocco/screens/news_screen.dart';
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
