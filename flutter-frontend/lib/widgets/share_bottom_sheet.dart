import 'dart:io';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
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
    return SizedBox(
      width: MediaQuery.of(context).size.width -
          20, // Leave small space in sides of the container
      height: 340,
      child: Padding(
        //Add Pading from top and bottom to avoid compact UI
        padding: const EdgeInsets.fromLTRB(0, 15, 0, 15),
        child: Column(
          //Arange widets top to bottom
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
              // Load sharing image with better UX using Progress Indicator
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
                      padding: EdgeInsets.all(60.0),
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
              //Arange share apllication button widgets left to right with smae space
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                //Whatsapp Icon Button
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
                //Instagram Icon Button
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
                //Facebook Icon Button
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

//Get Image from web
Future<Uint8List> _getImageFromUrl(String imageUrl) async {
  final response = await http.get(Uri.parse(imageUrl));
  if (response.statusCode == 200) {
    return response.bodyBytes;
  } else {
    throw HttpException(
        'Failed to load image: ${response.statusCode} ${imageUrl}');
  }
}
