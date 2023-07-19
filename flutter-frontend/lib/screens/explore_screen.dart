import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mocco/enum.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/widgets/news.dart';
import 'package:provider/provider.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  static const items = [
    "Today",
    "Accidents",
    "Crime",
    "Economy",
    "Education",
    "Entertainment",
    "Environment",
    "Health",
    "Humanitarian",
    "Politics",
    "Sports",
    "Technology",
  ];

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  bool _isDark = true;
  double _size = 45;
  void _animateShape() {
    setState(() {
      _isDark = !_isDark;
      _isDark ? _size = 45 : _size = 40;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: Padding(
        padding: const EdgeInsets.fromLTRB(42, 0, 10, 12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            FloatingActionButton(
              heroTag: "themeSwitcherFAB",
              backgroundColor: const Color.fromARGB(255, 217, 217, 217),
              onPressed: _animateShape,
              child: SvgPicture.asset(
                _isDark
                    ? 'assets/icons/light_mode.svg'
                    : 'assets/icons/dark_mode.svg',
                height: _size,
                width: _size,
              ),
            ),
            FloatingActionButton(
              heroTag: "settingsFAB",
              backgroundColor: const Color.fromARGB(255, 217, 217, 217),
              onPressed: () {},
              child: SvgPicture.asset(
                'assets/icons/settings.svg',
                height: 35,
                width: 35,
              ),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(27, 70, 27, 27),
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3, // Number of columns in the grid
            ),
            itemCount: ExploreScreen.items.length,
            itemBuilder: (context, index) {
              return GridTile(
                child: Padding(
                    padding: const EdgeInsets.all(9),
                    child: GestureDetector(
                      onTap: () {
                        WidgetsBinding.instance
                            .addPostFrameCallback((timeStamp) async {
                          await Provider.of<NewsProvider>(context,
                                  listen: false)
                              .fetchNewsFromService(context,
                                  tag:
                                      ExploreScreen.items[index].toLowerCase());
                        });
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => NewsContainer(
                                    requestSource:
                                        NewsScreenUsers.explorerScreen,
                                    tag: ExploreScreen.items[index]
                                        .toLowerCase())));
                      },
                      child: Container(
                        key: Key("${ExploreScreen.items[index]}-cntr"),
                        decoration: BoxDecoration(
                          color: const Color.fromARGB(255, 217, 217, 217),
                          borderRadius: BorderRadius.circular(15.0),
                        ),
                        child: LayoutBuilder(builder: (context, constraints) {
                          double imageSize = constraints.maxHeight *
                              0.5; // Adjust the percentage as needed
                          return Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Center(
                                child: SvgPicture.asset(
                                  'assets/icons/tags/$index.svg',
                                  height: imageSize,
                                  width: imageSize,
                                ),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                ExploreScreen.items[index],
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          );
                        }),
                      ),
                    )),
              );
            },
          ),
        ),
      ),
    );
  }
}
