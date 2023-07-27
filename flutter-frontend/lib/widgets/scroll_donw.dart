import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mocco/theme/theme_switcher.dart';

class ScrollDown extends StatefulWidget {
  const ScrollDown({super.key});

  @override
  State<ScrollDown> createState() => _ScrollDownState();
}

class _ScrollDownState extends State<ScrollDown>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );

    _animation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0, end: 1), weight: 1),
      TweenSequenceItem(tween: Tween(begin: 1, end: 0), weight: 1),
    ]).animate(_controller);

    _controller.repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Opacity(
          opacity: 1.0,
          child: Transform.translate(
            offset: Offset(0, 10 * (1.0 - _animation.value)),
            child: child,
          ),
        );
      },
      child: FutureBuilder(
        future:
            Future.delayed(const Duration(seconds: 8), () => true),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const SizedBox();
          } else {
            return Column(
              children: [
                Text(
                  "Scroll Down",
                  style: TextStyle(fontSize: 13, color: AppColors.text),
                ),
                ColorFiltered(
                  colorFilter:
                      ColorFilter.mode(AppColors.text, BlendMode.srcIn),
                  child: SvgPicture.asset(
                    "assets/icons/scroll.svg",
                    height: 24,
                    width: 24,
                  ),
                ),
              ],
            );
          }
        },
      ),
    );
  }
}
