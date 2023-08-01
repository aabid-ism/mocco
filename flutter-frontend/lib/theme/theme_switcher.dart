import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppColors {
  static Color primary = Colors.white;
  static Color secondary = const Color.fromARGB(255, 217, 217, 217);
  static Color bg = Colors.white;
  static Color text = const Color.fromARGB(255, 58, 58, 58);
}

class AppTheme extends ChangeNotifier {
  static const String _prefIsDark = 'isDark'; //shared preferences key
  static const bool _defaultIsDark = false; //set default theme pref[Dark] to true

  late SharedPreferences _preferences;
  bool _isDark = _defaultIsDark; //set theme pref to default

  bool get isDark => _isDark;

  //init app theme
  init(context) async {
    _preferences = await SharedPreferences.getInstance();
    if (!await _checkFirstLaunch()) {
      _isDark = _preferences.getBool(_prefIsDark) ?? _defaultIsDark;
    } else {
      Brightness systemBrightness = MediaQuery.of(context).platformBrightness;
      systemBrightness == Brightness.dark ? _isDark = true : _isDark = false;
    }
    _toggleColors(_isDark);
    await _preferences.setBool(_prefIsDark, _isDark);
  }

  //toggle theme prefs
  Future<void> toggletheme() async {
    _isDark = !isDark;
    _toggleColors(_isDark);
    _preferences = await SharedPreferences.getInstance();
    await _preferences.setBool(_prefIsDark, _isDark);
  }

  _toggleColors(bool isDark) {
    AppColors.primary =
        isDark ? CustomDarkColors.primary : CustomLightColors.primary;
    AppColors.secondary =
        isDark ? CustomDarkColors.secondary : CustomLightColors.secondary;
    AppColors.text = isDark ? CustomDarkColors.text : CustomLightColors.text;
    AppColors.bg = isDark ? CustomDarkColors.bg : CustomLightColors.bg;
    notifyListeners();
  }

  Future<bool> _checkFirstLaunch() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool isFirst = prefs.getBool('is_first_theme_launch') ?? true;
    isFirst ? prefs.setBool('is_first_theme_launch', false) : null;
    return isFirst;
  }
}

class CustomDarkColors {
  static Color primary = const Color(0xFF1D1D1D);
  static Color secondary = const Color.fromARGB(255, 82, 82, 82);
  static Color bg = const Color(0xFF1D1D1D);
  static Color text = Colors.white;
}

class CustomLightColors {
  static Color primary = Colors.white;
  static Color secondary = const Color.fromARGB(255, 217, 217, 217);
  static Color bg = Colors.white;
  static Color text = const Color.fromARGB(255, 58, 58, 58);
}
