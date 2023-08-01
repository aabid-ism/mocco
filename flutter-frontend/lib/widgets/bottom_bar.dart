import 'dart:io';
import 'package:mocco/services/loading_service.dart';
import 'package:mocco/theme/theme_switcher.dart';
import 'package:path_provider/path_provider.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:mocco/app_preferences.dart';
import 'package:mocco/models/news_card.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;

class BottomBar extends StatefulWidget {
  final NewsCard newsCard;
  final LoadingService loadingService;
  const BottomBar(
      {super.key, required this.newsCard, required this.loadingService});

  @override
  State<BottomBar> createState() => _BottomBarState();
}

class _BottomBarState extends State<BottomBar> {
  bool _isPostSaved = false; // Declare a variable to hold the result

  @override
  void initState() {
    super.initState();
  }

  Future<bool> _currentSavedStatus(int postIndex) async {
    List<int> likedPostIndex =
        await widget.loadingService.getPostIndexList(currentScreenTag: "saved");
    var isLiked = likedPostIndex.contains(widget.newsCard.postIndex);
    return isLiked;
  }

  @override
  Widget build(BuildContext context) {
    var preferencesStateWatcher = context.watch<AppPreferences>();
    bool isDark = Provider.of<AppTheme>(context).isDark;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        Ink(
          height: 70,
          width: 250,
          decoration: BoxDecoration(
            color: AppColors.secondary,
            borderRadius: BorderRadius.circular(35),
            border: Border.all(
              width: isDark ? 1 : 0,
              color: isDark ? AppColors.text : AppColors.secondary,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Share Button
                IconButton(
                  onPressed: () async {
                    _share(
                      widget.newsCard,
                      preferencesStateWatcher.isEng,
                    );
                  },
                  icon: Icon(
                    FontAwesomeIcons.share,
                    color: AppColors.text,
                    size: 28,
                  ),
                ),

                // Lang Toggle
                IconButton(
                  onPressed: () async {
                    if (preferencesStateWatcher.isEng) {
                      if (widget.newsCard.sinhalaTitle!.isEmpty ||
                          widget.newsCard.sinhalaDescription!.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          //Show snack bar msg if failed the launch
                          const SnackBar(
                            backgroundColor: Colors.redAccent,
                            content: Text(
                                'Unfortunately, this article is not available in Sinhala'),
                          ),
                        );
                        return;
                      }
                    }
                    preferencesStateWatcher.toggleLang();
                  },
                  icon: FittedBox(
                    child: Text(
                      preferencesStateWatcher.isEng ? "ENG" : "SIN",
                      maxLines: 1,
                      style: TextStyle(
                        color: AppColors.text,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),

                // Source Button
                IconButton(
                  onPressed: () async {
                    !await _launchUrl(widget.newsCard.sourceUrl ?? "")
                        ? ScaffoldMessenger.of(context).showSnackBar(
                            //Show snack bar msg if failed the launch
                            const SnackBar(
                              content: Text('Could not open the source'),
                            ),
                          )
                        : null;
                  },
                  icon: Icon(
                    Icons.import_contacts,
                    color: AppColors.text,
                    size: 32,
                  ),
                ),

                // Save Toggle
                IconButton(
                  onPressed: () {
                    if (!_isPostSaved) {
                      widget.loadingService.addToPostIndexList(
                          widget.newsCard.postIndex,
                          currentScreenTag: "saved");
                    } else {
                      widget.loadingService.removeFromPostIndexList(
                          widget.newsCard.postIndex,
                          currentScreenTag: "saved");
                    }
                    setState(() {
                      _isPostSaved = !_isPostSaved;
                    });
                  },
                  icon: FutureBuilder<bool>(
                    future: _currentSavedStatus(widget.newsCard.postIndex),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        // Show a loading indicator or placeholder widget while loading
                        return const CircularProgressIndicator(); // Replace this with your preferred loading widget
                      } else if (snapshot.hasError) {
                        // Handle the error
                        return Icon(
                          Icons.bookmark_add_outlined,
                          color: AppColors.text,
                          size: 28,
                        );
                      } else {
                        // Data is ready, update the state
                        _isPostSaved = snapshot.data ?? false;
                        return Icon(
                          _isPostSaved
                              ? Icons.bookmark_rounded
                              : Icons.bookmark_outline,
                          color: AppColors.text,
                          size: 28,
                        );
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

_share(NewsCard newsCard, isEng) async {
  final newsImgUrl = newsCard.imageUrl;
  final url = Uri.parse(newsImgUrl ?? "");
  final response = await http.get(url);
  final bytes = response.bodyBytes;

  final temp = await getTemporaryDirectory();
  final shareTempFilePath = '${temp.path}/mocosharetempimg.jpg';
  File file = File(shareTempFilePath);
  await file.writeAsBytes(bytes);

  var title = isEng ? newsCard.title : newsCard.sinhalaTitle;
  var description = isEng ? newsCard.description : newsCard.sinhalaDescription;
  await Share.shareXFiles(
    [XFile(shareTempFilePath)],
    subject: newsCard.title,
    text: "$title\n\n$description\n\n~Mocco",
  );
}

//URL Launcher function with exception handling
Future<bool> _launchUrl(String sourceString) async {
  try {
    Uri url = Uri.parse(sourceString);
    final response = await http.head(url);
    if (response.statusCode != 200 ||
        !await launchUrl(url, mode: LaunchMode.externalApplication)) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}
