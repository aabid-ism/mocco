import 'dart:io';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:appinio_social_share/appinio_social_share.dart';

class ShareBottomSheet extends StatelessWidget {
  final String imageURL;
  final String heading;
  AppinioSocialShare appinioSocialShare = AppinioSocialShare();
  ShareBottomSheet({
    super.key,
    required this.imageURL,
    required this.heading,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width - 20,
      height: 340,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(0, 15, 0, 15),
        child: Column(
          children: [
            const Center(
              child: Text(
                "Share",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(
              height: 10,
            ),
            FutureBuilder<Uint8List?>(
              future: _getImageFromUrl(imageURL),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.done &&
                    snapshot.hasData) {
                  return Image.memory(
                    snapshot.data!,
                    width: 150,
                    height: 150,
                  );
                } else {
                  return const SizedBox(
                    height: 150,
                    width: 150,
                    child: Padding(
                      padding: const EdgeInsets.all(60.0),
                      child: CircularProgressIndicator(
                        color: Colors.black87,
                      ),
                    ),
                  ); // Show a loading indicator while image is being fetched
                }
              },
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
              child: Text(heading),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                IconButton(
                  onPressed: () => {},
                  icon: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(FontAwesomeIcons.whatsapp,
                          size: 38, color: Colors.black87),
                      SizedBox(height: 4),
                      Text(
                        'WhatsApp',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, color: Colors.black87),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () => {},
                  icon: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(FontAwesomeIcons.instagram,
                          size: 38, color: Colors.black87),
                      SizedBox(height: 4),
                      Text(
                        'Instagram',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, color: Colors.black87),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () => {},
                  icon: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(FontAwesomeIcons.facebook,
                          size: 38, color: Colors.black87),
                      SizedBox(height: 4),
                      Text(
                        'Facebook',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, color: Colors.black87),
                      ),
                    ],
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}

Future<Uint8List> _getImageFromUrl(String imageUrl) async {
  final response = await http.get(Uri.parse(imageUrl));
  if (response.statusCode == 200) {
    return response.bodyBytes;
  } else {
    throw HttpException(
        'Failed to load image: ${response.statusCode} ${imageUrl}');
  }
}

Future<bool> _launchUrl(String sourceString) async {
  try {
    Uri url = Uri.parse(sourceString);
    if (!await launchUrl(url, mode: LaunchMode.externalNonBrowserApplication)) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}
