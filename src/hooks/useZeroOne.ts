import { useMemo } from 'react'
import Animated, { Easing } from 'react-native-reanimated'

const { cond, block, clockRunning, startClock, stopClock, Clock, Value, timing } = Animated

export interface UseZeroOneProps {
  duration?: number
  easing?: Animated.EasingFunction
}
export const useZeroOne = ({ duration = 1200, easing = Easing.linear }: UseZeroOneProps = {}) => {
  const progress = useMemo(() => {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    }

    const config = {
      toValue: new Value(1),
      duration,
      easing,
    }

    const clock = new Clock()

    const _progress = block([
      cond(
        clockRunning(clock),
        cond(state.finished, stopClock(clock)),
        cond(state.finished, 0, startClock(clock)),
      ),
      timing(clock, state, config),
      state.position,
    ])

    return _progress
  }, [])

  return [progress]
}
