import { set, startClock, stopClock } from 'react-native-reanimated'
import type Animated from 'react-native-reanimated'


export function pauseTiming(
  clock: Animated.Clock,
  state: Animated.TimingState,
  config: AnimatedTimingConfig,
): Animated.Node<number>[] {
  return [stopClock(clock), set(config.toValue, state.position)]
}

export function resumeTiming(
  clock: Animated.Clock,
  state: Animated.TimingState,
  config: AnimatedTimingConfig,
  max: Animated.Adaptable<number>,
): Animated.Node<number>[] {
  return [set(state.time, clock), set(config.toValue, max), startClock(clock)]
}

interface AnimatedTimingConfig extends Omit<Animated.TimingConfig, 'toValue'> {
  toValue: Animated.Value<number>
}
