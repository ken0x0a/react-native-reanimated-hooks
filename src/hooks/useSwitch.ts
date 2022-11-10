import { useMemo } from "react";
import Animated, { EasingNode as Easing } from "react-native-reanimated";

const { cond, block, clockRunning, startClock, stopClock, Clock, Value, timing, useCode } = Animated;

export type UseSwitchResult = {
  position: Animated.Value<number>;
};
export interface UseSwitchProps {
  duration?: number;
  easing?: Animated.EasingNodeFunction;
  max?: number;
  min?: number;
  position?: Animated.Value<number>;
  // animateOnInit?: boolean
}
/**
 * This hook is incomplete.
 * No function to switch actually... 😢
 */
export const useSwitch = ({
  duration = 1200,
  easing = Easing.linear,
  position,
  // animateOnInit = false,
  min = 0,
  max = 1,
}: UseSwitchProps = {}): UseSwitchResult => {
  const [animationSwitch, animation] = useMemo(() => {
    const state = {
      finished: new Value(0),
      position: position || new Value(min),
      time: new Value(0),
      frameTime: new Value(0),
    };

    const config = {
      toValue: new Value(max),
      duration,
      easing,
    };

    const clock = new Clock();

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const _animation = () =>
      block([
        cond(
          clockRunning(clock),
          cond(state.finished, stopClock(clock)),
          cond(state.finished, 0, startClock(clock)),
        ),
        timing(clock, state, config),
      ]);

    return [{ position: state.position }, _animation];
  }, [duration, easing, max, min, position]);

  useCode(animation, [animation]);

  return animationSwitch;
};
