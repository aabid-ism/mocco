import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:mocco/app_preferences.dart';
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
  if (kDebugMode) {
    print('Firebase initialized: $initialized');
  }
  PushNotificationService.initialize();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AppPreferences()),
        ChangeNotifierProvider(create: (context) => NewsProvider()),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final AppPreferences _appPreferences = AppPreferences();

  @override
  void initState() {
    super.initState();
    _appPreferences.init();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mocco',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.white),
      ),
      home: const ScreensHolder(),
    );
  }
}
