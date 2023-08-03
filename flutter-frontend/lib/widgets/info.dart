import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:mocco/theme/theme_switcher.dart';
import 'package:url_launcher/url_launcher.dart';

class Info extends StatelessWidget {
  const Info({super.key});

  @override
  Widget build(BuildContext context) {
    TextStyle defaultTextStyle = TextStyle(color: AppColors.text, height: 1.2);
    TextStyle defaultLinkStyle = const TextStyle(
      color: Colors.lightBlue,
      height: 1.2,
    );

    return Padding(
      padding: const EdgeInsets.all(10.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Thank you for downloading Mocco!",
            style: defaultTextStyle,
          ),
          const SizedBox(height: 10),
          RichText(
            text: TextSpan(children: [
              TextSpan(
                text: 'Follow us on ',
                style: defaultTextStyle,
              ),
              TextSpan(
                text: 'Instagram',
                style: defaultLinkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    _launchEmail("https://www.instagram.com/mocco_lk", false);
                  },
              ),
              TextSpan(
                text: ' and ',
                style: defaultTextStyle,
              ),
              TextSpan(
                text: 'Facebook',
                style: defaultLinkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    _launchEmail(
                        "https://www.facebook.com/mocco.srilanka", false);
                  },
              ),
              TextSpan(
                text: '. Visit our web application at ',
                style: defaultTextStyle,
              ),
              TextSpan(
                text: 'mocco.lk',
                style: defaultLinkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    _launchEmail("https://mocco.lk", false);
                  },
              ),
            ]),
          ),
          const SizedBox(
            height: 15,
          ),
          RichText(
            text: TextSpan(children: [
              TextSpan(
                text: ' • For customer support: ',
                style: defaultTextStyle,
              ),
              TextSpan(
                text: 'support@serendib.global',
                style: defaultLinkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    _launchEmail("support@serendib.global", true);
                  },
              ),
            ]),
          ),
          const SizedBox(
            height: 8,
          ),
          RichText(
            text: TextSpan(children: [
              TextSpan(
                text: ' • For advertising inquiries: ',
                style: defaultTextStyle,
              ),
              TextSpan(
                text: 'partnerships@serendib.global',
                style: defaultLinkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    _launchEmail("partnerships@serendib.global", true);
                  },
              ),
            ]),
          ),
          const SizedBox(
            height: 8,
          ),
          RichText(
            text: TextSpan(children: [
              TextSpan(
                text: ' • For other inquiries: ',
                style: defaultTextStyle,
              ),
              TextSpan(
                text: 'info@serendib.global',
                style: defaultLinkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    _launchEmail("info@serendib.global", true);
                  },
              ),
            ]),
          ),
          const SizedBox(
            height: 8,
          ),
          RichText(
            text: TextSpan(children: [
              TextSpan(
                text: 'You can view our ',
                style: defaultTextStyle,
              ),
              TextSpan(
                text: 'Privacy Policy',
                style: defaultLinkStyle,
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    _launchEmail(
                        "https://aabid-ism.github.io/mocco-privacy-policy/",
                        false);
                  },
              ),
            ]),
          ),
        ],
      ),
    );
  }

  void _launchEmail(String urlString, bool isEmail) async {
    final Uri uri;
    uri = isEmail
        ? (Uri(scheme: 'mailto', path: urlString))
        : Uri.parse(urlString);
    if (await canLaunchUrl(uri)) {
      await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
    } else {
      throw 'Could not launch email';
    }
  }
}
