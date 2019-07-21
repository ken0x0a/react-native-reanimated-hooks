import { useCallback, useMemo, useRef } from 'react'
import Animated, { Easing } from 'react-native-reanimated'
import { ReanimatedLoopState as LoopState } from '../enums'
import { pauseTiming, resumeTiming } from '../utils/timing'

const { cond, eq, and, block, set, clockRunning, Clock, Value, timing, useCode } = Animated

export interface UseLoopResult {
  clock: Animated.Clock
  isAnimating: {
    current: boolean
  }
  position: Animated.Value<number>
  start: () => void
  stop: () => void
}
export interface UseLoopOptions {
  animating?: Animated.Value<LoopState>
  easing?: Animated.EasingFunction
  interval?: number
  max?: number
  min?: number
  /**
   * UseLoopOptions['position']
   * `position` for `animation.state`
   */
  position?: Animated.Value<number>
}
export const useLoop = ({
  animating,
  interval = 1000,
  easing = Easing.linear,
  min = 0,
  max = 1,
  position,
}: UseLoopOptions = {}): UseLoopResult => {
  const [animation, loopAnimation] = useMemo(() => {
    const isAnimatingAnimVal = animating || new Value<LoopState>(1)
    const isAnimating = { current: true }

    const state = {
      finished: new Value(0),
      position: position || new Value<number>(min),
      time: new Value(0),
      frameTime: new Value(0),
    }

    const reset = [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(state.position, min),
    ]
    const config = {
      toValue: new Value(max),
      duration: interval,
      easing,
    }

    const clock = new Clock()

    const _loopAnimation = block([
      cond(and(state.finished, eq(state.position, max)), reset),
      cond(
        clockRunning(clock),
        cond(isAnimatingAnimVal, 0, pauseTiming(clock, state, config)),
        cond(isAnimatingAnimVal, resumeTiming(clock, state, config, max)),
      ),
      timing(clock, state, config),
    ])

    /**
     * MAY BE REMOVED (split to another utility function) IN FUTURE `start`, `stop`, `toggle`, `isAnimating`
     */
    const start = () => {
      isAnimatingAnimVal.setValue(LoopState.animate)
      isAnimating.current = true
    }

    const stop = () => {
      isAnimatingAnimVal.setValue(LoopState.pause)
      isAnimating.current = false
    }

    const toggle = () => (isAnimating.current ? stop() : start())

    return [{ start, stop, toggle, position: state.position, clock, isAnimating }, _loopAnimation]
  }, [animating, interval, easing, min, max, position])

  useCode(loopAnimation, [loopAnimation])

  return animation
}

interface UseLoopStateOptions {
  state?: LoopState
}
export function useLoopState({ state = LoopState.animate }: UseLoopStateOptions = {}) {
  const animRef = useRef({
    isAnimating: state === LoopState.animate,
    animValue: new Animated.Value<LoopState>(state),
  })

  const toggle = useCallback(() => {
    if (animRef.current.isAnimating) {
      animRef.current.animValue.setValue(LoopState.pause)
      animRef.current.isAnimating = false
    } else {
      animRef.current.animValue.setValue(LoopState.animate)
      animRef.current.isAnimating = true
    }
  }, [])
  const start = useCallback(() => {
    animRef.current.animValue.setValue(LoopState.animate)
    animRef.current.isAnimating = true
  }, [])

  const stop = useCallback(() => {
    animRef.current.animValue.setValue(LoopState.pause)
    animRef.current.isAnimating = false
  }, [])

  return { state: animRef.current.animValue, toggle, stop, start }
}
