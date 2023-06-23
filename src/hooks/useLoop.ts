import { useMemo, useRef } from "react";
import type Animated from "react-native-reanimated";
import { Easing, cancelAnimation, runOnJS, useSharedValue, withTiming } from "react-native-reanimated";

export type UseLoopResult = {
  readonly value: Animated.SharedValue<number>;
  readonly start: () => void;
  readonly stop: () => void;
};

export type UseLoopOptions = {
  animating?: boolean;
  easing?: Animated.EasingFunction;
  interval?: number;
  max?: number;
  min?: number;
  /**
   * UseLoopOptions['value']
   * `value` for `animation.state`
   */
  // value?: Animated.SharedValue<number>;
};

export const useLoop = ({
  animating = true,
  interval = 1000,
  easing = Easing.linear,
  // value: position,
  min = 0,
  max = 1,
}: UseLoopOptions = {}): UseLoopResult => {
  // const value = position !== undefined ? position : useSharedValue(min);
  const value = useSharedValue(min);
  const nextInterval = useSharedValue(min);
  const isAnimating = useRef(animating);
  // useDerivedValue()

  const animation = useMemo(() => {
    // const state = {
    //   nextDuration: interval,
    // };
    nextInterval.value = interval;

    function run() {
      "worklet";

      value.value = withTiming(max, { duration: nextInterval.value, easing }, (finished) => {
        if (finished) {
          value.value = min;
          nextInterval.value = interval;
          run();
        } // eslint-disable-line @typescript-eslint/brace-style
        // change `nextInterval` based on `value.value` position
        else {
          nextInterval.value = (interval * (max - value.value)) / (max - min);
          // console.debug("[reanimated-hooks] useLoop() run() value.value", nextInterval.value);
        }
      });
    }
    function start() {
      // console.debug("[reanimated-hooks] useLoop() start()");
      // console.debug("[state]", nextInterval.value);
      isAnimating.current = true;
      // runOnUI(run)();
      runOnJS(run)();
    }

    const stop = () => {
      // console.debug("[reanimated-hooks] useLoop() stop()");
      isAnimating.current = false;
      cancelAnimation(value);
    };

    if (isAnimating.current) {
      start();
    }

    return { value, start, stop /* , isAnimating */ }; // `isAnimating` never get updated somehow...
  }, [animating, interval, easing, min, max, value]);

  return animation;
};
