import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mocco/app_preferences.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/screen_holder.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:provider/provider.dart';
import "env.dart";

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AppPreferences()),
        ChangeNotifierProvider(create: (context) => NewsProvider()),
      ],
      child: const MyApp(),
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
    initPlatformState();
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

  Future<void> initPlatformState() async {
    OneSignal.shared.setAppId(onSignalAppID);

    var permissionResult =
    OneSignal.shared.promptUserForPushNotificationPermission();
    if (await permissionResult) {
      if (kDebugMode) {
        print("Notification Access Granted!!!");
      }
    }

    OneSignal.shared.setNotificationWillShowInForegroundHandler((event) async{
      event.complete(event.notification);
    });

    OneSignal.shared
        .setNotificationOpenedHandler((OSNotificationOpenedResult result) async {
      var data = result.notification.additionalData;
      var postIndex = int.tryParse(data?['postIndex']);

      await Provider.of<NewsProvider>(context, listen: false)
          .fetchNewsFromService(context, postIndex: postIndex);
    });
  }
}
