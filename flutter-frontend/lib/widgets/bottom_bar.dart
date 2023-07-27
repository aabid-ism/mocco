import 'dart:io';
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

class BottomBar extends StatelessWidget {
  final NewsCard newsCard;
  const BottomBar({super.key, required this.newsCard});

  @override
  Widget build(BuildContext context) {
    var preferencesStateWatcher = context.watch<AppPreferences>();
    return Container(
      height: 65,
      width: 190,
      decoration: BoxDecoration(
        color: AppColors.secondary,
        borderRadius: BorderRadius.circular(35),
        boxShadow: [
          BoxShadow(
            color: AppColors.text.withOpacity(0.15),
            spreadRadius: 2,
            blurRadius: 15,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(15, 5, 15, 0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            // Share Button
            GestureDetector(
              // Make whole share column clickable
              onTap: () async {
                final newsImgUrl = newsCard.imageUrl;
                final url = Uri.parse(newsImgUrl ?? "");
                final response = await http.get(url);
                final bytes = response.bodyBytes;

                final temp = await getTemporaryDirectory();
                final shareTempFilePath = '${temp.path}/mocosharetempimg.jpg';
                File file = File(shareTempFilePath);
                await file.writeAsBytes(bytes);

                var title = preferencesStateWatcher.isEng
                    ? newsCard.title
                    : newsCard.sinhalaTitle;
                var description = preferencesStateWatcher.isEng
                    ? newsCard.description
                    : newsCard.sinhalaDescription;
                await Share.shareXFiles(
                  [XFile(shareTempFilePath)],
                  subject: newsCard.title,
                  text: "$title\n\n$description\n\n~Mocco",
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Source Icon Buttom
                  IconButton(
                    onPressed: null,
                    icon: Column(children: [
                      Icon(FontAwesomeIcons.share, color: AppColors.text),
                      const SizedBox(
                        height: 4,
                      ),
                    ]),
                  ),
                ],
              ),
            ),
            // Source Button
            GestureDetector(
              // Make whole source column clickable
              onTap: () async {
                !await _launchUrl(newsCard.sourceUrl ?? "")
                    ? ScaffoldMessenger.of(context).showSnackBar(
                        //Show snack bar msg if failed the launch
                        const SnackBar(
                          content: Text('Could not open the source'),
                        ),
                      )
                    : null;
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Source Icon Buttom
                  IconButton(
                    onPressed: null,
                    icon: Column(children: [
                      Icon(Icons.info_outline, color: AppColors.text),
                    ]),
                  ),
                ],
              ),
            ),
            // Lang Toggle Button
            GestureDetector(
              // Make whole source column clickable
              onTap: () async {
                if (preferencesStateWatcher.isEng) {
                  if (newsCard.sinhalaTitle!.isEmpty ||
                      newsCard.sinhalaDescription!.isEmpty) {
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
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Source Icon Buttom
                  IconButton(
                    onPressed: null,
                    icon: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          FittedBox(
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
                          const SizedBox(
                            height: 5,
                          ),
                        ]),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
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
