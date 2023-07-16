import 'package:flutter/material.dart';

class NoInternet extends StatelessWidget {
  const NoInternet({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        padding: const EdgeInsets.fromLTRB(15, 0, 20, 15),
        width: MediaQuery.of(context).size.width < 390
            ? MediaQuery.of(context).size.width - 40
            : 350,
        height: 80,
        decoration: const BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(20)),
          color: Colors.transparent,
        ),
        child: const Column(
          children: [
            Icon(
              Icons.wifi_off_rounded,
              size: 35,
            ),
            SizedBox(height: 10),
            Text(
              'Please check your internet connection and try again.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.black,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
