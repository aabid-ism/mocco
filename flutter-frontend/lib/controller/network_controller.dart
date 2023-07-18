import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mocco/widgets/no_internet.dart';

class NetworkController extends GetxController {
  final Connectivity _connectivity = Connectivity();

  @override
  void onInit() {
    super.onInit();
    _connectivity.onConnectivityChanged.listen(_updateConnectionStatus);
  }

  var disconnected = false;
  void _updateConnectionStatus(ConnectivityResult connectivityResult) {
    if (connectivityResult == ConnectivityResult.none) {
      if (Get.isSnackbarOpen) {
        Get.closeCurrentSnackbar();
      }
      Get.defaultDialog(
        title: "No Internet!",
        content: const NoInternet(),
        barrierDismissible: true,
        backgroundColor: const Color(0xFFD9D9D9),
      );
      Get.rawSnackbar(
          messageText: const Text(
            'Internet Connection Unavailable',
            style: TextStyle(color: Colors.white, fontSize: 14),
            textAlign: TextAlign.center,
          ),
          isDismissible: false,
          duration: const Duration(seconds: 10),
          backgroundColor: Colors.red[400]!,
          icon: const Icon(
            Icons.wifi_off_rounded,
            color: Colors.white,
            size: 30,
          ),
          margin: EdgeInsets.zero,
          snackStyle: SnackStyle.GROUNDED);
      disconnected = true;
    } else {
      if (Get.isSnackbarOpen) {
        Get.closeCurrentSnackbar();
      }
      if (Get.isDialogOpen!) {
        Get.back(closeOverlays: true);
      }
      if (disconnected) {
        disconnected = false;
        Get.rawSnackbar(
            messageText: const Text(
              'Connected to the Internet',
              style: TextStyle(color: Colors.white, fontSize: 14),
              textAlign: TextAlign.center,
            ),
            isDismissible: false,
            duration: const Duration(seconds: 4),
            backgroundColor: Colors.green,
            icon: const Icon(
              Icons.wifi_rounded,
              color: Colors.white,
              size: 30,
            ),
            margin: EdgeInsets.zero,
            snackStyle: SnackStyle.GROUNDED);
      }
    }
  }
}
