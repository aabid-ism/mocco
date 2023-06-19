import 'package:flutter/material.dart';
import 'package:mocco/models/news_card.dart';
import 'package:mocco/widgets/share_bottom_sheet.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;

class BottomBar extends StatelessWidget {
  final NewsCard newsCard;
  const BottomBar({super.key, required this.newsCard});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 70,
      width: 160,
      decoration: BoxDecoration(
        color: const Color(0xFFD9D9D9),
        borderRadius: BorderRadius.circular(35.0),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          // Share Button
          GestureDetector(
            // Make whole share column clickable
            onTap: () async {
              showModalBottomSheet(
                // Call custom share widget with data
                context: context,
                builder: (BuildContext context) {
                  return ShareBottomSheet(
                    imageURL: newsCard.imageUrl ?? "",
                    heading: newsCard.title ?? "",
                  );
                },
              );
            },
            child: const Column(children: [
              // Share Icon Button
              IconButton(
                onPressed: null,
                icon: Column(children: [
                  Icon(Icons.share, color: Colors.black),
                  SizedBox(
                    height: 6,
                  ),
                  Text(
                    "Share",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ]),
              ),
            ]),
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
            child: const Column(
              children: [
                // Source Icon Buttom
                IconButton(
                  onPressed: null,
                  icon: Column(children: [
                    Icon(Icons.info_outline, color: Colors.black),
                    SizedBox(height: 6),
                    Text(
                      "Source",
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                    ),
                  ]),
                ),
              ],
            ),
          ),
        ],
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
