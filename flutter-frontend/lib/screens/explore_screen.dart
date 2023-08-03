import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:mocco/enum.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/theme/theme_switcher.dart';
import 'package:mocco/widgets/info.dart';
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
    "Saved"
  ];

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  bool _isDark = true;
  @override
  Widget build(BuildContext context) {
    _isDark = Provider.of<AppTheme>(context).isDark;
    return Scaffold(
      backgroundColor: AppColors.bg,
      floatingActionButton: Padding(
        padding: const EdgeInsets.fromLTRB(42, 0, 10, 12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            FloatingActionButton(
              heroTag: "themeSwitcherFAB",
              backgroundColor: AppColors.secondary,
              onPressed: () {
                Provider.of<AppTheme>(context, listen: false).toggletheme();
              },
              child: ColorFiltered(
                colorFilter: ColorFilter.mode(AppColors.text, BlendMode.srcIn),
                child: SvgPicture.asset(
                  _isDark
                      ? 'assets/icons/light_mode.svg'
                      : 'assets/icons/dark_mode.svg',
                  height: 45,
                  width: 45,
                ),
              ),
            ),
            FloatingActionButton(
              heroTag: "infoFab",
              backgroundColor: AppColors.secondary,
              onPressed: () {
                Get.defaultDialog(
                  title: "Mocco",
                  titleStyle: TextStyle(color: AppColors.text),
                  content: const Info(),
                  barrierDismissible: true,
                  backgroundColor: AppColors.bg,
                );
              },
              child: ColorFiltered(
                colorFilter: ColorFilter.mode(AppColors.text, BlendMode.srcIn),
                child: SvgPicture.asset(
                  'assets/icons/info.svg',
                  height: 45,
                  width: 45,
                ),
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
                        const fetchReqFrom = NewsScreenUsers.explorerScreen;
                        final tag = ExploreScreen.items[index].toLowerCase();

                        Provider.of<NewsProvider>(context, listen: false)
                            .fetchNewsFromService(tag: tag)
                            .then((_) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => NewsContainer(
                                requestSource: fetchReqFrom,
                                tag: tag,
                              ),
                            ),
                          );
                        });
                      },
                      child: Container(
                        key: Key("${ExploreScreen.items[index]}-cntr"),
                        decoration: BoxDecoration(
                          color: AppColors.secondary,
                          borderRadius: BorderRadius.circular(15.0),
                        ),
                        child: LayoutBuilder(builder: (context, constraints) {
                          double imageSize = constraints.maxHeight *
                              0.5; // Adjust the percentage as needed
                          return Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Center(
                                child: ColorFiltered(
                                  colorFilter: ColorFilter.mode(
                                      AppColors.text, BlendMode.srcIn),
                                  child: SvgPicture.asset(
                                    'assets/icons/tags/$index.svg',
                                    height: imageSize,
                                    width: imageSize,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                ExploreScreen.items[index],
                                style: TextStyle(
                                  color: AppColors.text,
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
