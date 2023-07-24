import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppPreferences extends ChangeNotifier {
  static const String _prefIsEng = 'isEng'; //shared preferences key
  static const bool _defaultIsEng = true; //set default lang pref[eng] to true

  late SharedPreferences _preferences;
  bool _isEng = _defaultIsEng; //set lang pref to default

  bool get isEng => _isEng;

  //init app preferences
  init() async {
    _preferences = await SharedPreferences.getInstance();
    _isEng = _preferences.getBool(_prefIsEng) ?? _defaultIsEng;
  }

  //toggle lang prefs
  Future<void> toggleLang() async {
    _isEng = !isEng;
    notifyListeners();
    _preferences = await SharedPreferences.getInstance();
    await _preferences.setBool(_prefIsEng, _isEng);
  }
}
