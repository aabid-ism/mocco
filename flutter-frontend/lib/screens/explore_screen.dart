import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mocco/enum.dart';
import 'package:mocco/news_provider_state.dart';
import 'package:mocco/widgets/news.dart';
import 'package:provider/provider.dart';

class ExploreScreen extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(27, 70, 27, 27),
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3, // Number of columns in the grid
            ),
            itemCount: items.length,
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
                                  tag: items[index].toLowerCase());
                        });
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => NewsContainer(
                                    requestSource:
                                        NewsScreenUsers.explorerScreen,
                                    tag: items[index].toLowerCase())));
                      },
                      child: Container(
                        key: Key("${items[index]}-cntr"),
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
                                  'assets/icons/$index.svg',
                                  height: imageSize,
                                  width: imageSize,
                                ),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                items[index],
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
