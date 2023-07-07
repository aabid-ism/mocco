// Show the main News Page or Lifestyle Page or Saved news page
import 'package:flutter/material.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/screens/explore_screen.dart';
import 'package:mocco/screens/lifestyle_screen.dart';
import 'package:mocco/screens/news_screen.dart';
import 'package:mocco/widgets/top_menu.dart';
import 'package:provider/provider.dart';

class ScreensHolder extends StatefulWidget {
  const ScreensHolder({super.key});

  @override
  State<ScreensHolder> createState() => _ScreensHolderState();
}

class _ScreensHolderState extends State<ScreensHolder> {
  late int _currentPageIndex;
  final PageController _pageController = PageController(
      initialPage: 1); //Initializer page controller and set initial page to 1
  @override
  void initState() {
    // Fetch news data before NewsScreen build
    super.initState();
      WidgetsBinding.instance.addPostFrameCallback((timeStamp) async {
        await Provider.of<NewsProvider>(context, listen: false)
            .fetchNewsFromService(context);
      });
    _currentPageIndex = 1;
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // var newsState = context.watch<NewsProvider>();
    // newsState.notificationFor == NewsScreenUsers.newsScreen?
    // _currentPageIndex = 1
    //     :_currentPageIndex = 2;
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            PageView(
              scrollDirection: Axis.horizontal,
              controller: _pageController,
              onPageChanged: (int index) {
                //on page change action
                setState(() {
                  _currentPageIndex = index; //change current page index
                });
              },
              children: const [
                ExploreScreen(),
                NewsScreenContainer(),
                LifestyleScreen(),
              ],
            ),
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: TopMenu(
                currentPageIndex: _currentPageIndex,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
