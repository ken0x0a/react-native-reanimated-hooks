[![GitHub Action](https://github.com/ken0x0a/react-native-reanimated-hooks/actions/workflows/publish.yml/badge.svg)](https://github.com/ken0x0a/react-native-reanimated-hooks/actions)
[![npm version](https://img.shields.io/npm/v/react-native-reanimated-hooks?color=%234FC73C)](https://www.npmjs.com/package/react-native-reanimated-hooks)

react hooks for "react-native-reanimated"


## Install

```sh
yarn add react-native-reanimated-indicators
```

## Usage

### Examples

- https://github.com/ken0x0a/react-native-reanimated-indicators

```tsx
```

## Utils

### useLoop()

simple loop animation 

value will be looped from `min(default 0)` to `max(default 1)`

```tsx
import { interpolate } from 'react-native-reanimated'
import { useLoop } from 'react-native-reanimated-hooks'

export const Example: React.FC<ExampleProps> = () => {
  const loop = useLoop()

  const animatedStyle = useAnimatedStyle(() => {
    const size = interpolate(loop.value.value, [0, 1], [20, 70] )

    return { width: size, height: size, backgroundColor: 'pink', borderRadius: size }
  }, [loop.value])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={loop.toggle} // onPress={() => (loop.isAnimating.current ? loop.stop() : loop.start())}
        style={styles.rect}
      >
        <Animated.View style={animatedStyle} />
      </TouchableOpacity>
    </View>
  )
}
```

The loop is the following

![this](./docs/assets/this.gif)

**NOT** following

![not-this](./docs/assets/not-this.gif)

Loop animated values as indicated by name.
Just work as expected.

### ~~useSwitch~~

not works yet.

