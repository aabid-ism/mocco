import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:mocco/firebase_options.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/screen_holder.dart';
import 'package:mocco/services/notification_service.dart';
import 'package:provider/provider.dart';

bool isFirebaseInitialized() {
  return Firebase.apps.isNotEmpty;
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  bool initialized = isFirebaseInitialized();
  print('Firebase initialized: $initialized');
  PushNotificationService.initialize();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
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
