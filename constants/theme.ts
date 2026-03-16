/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    tint: '#000000',
    icon: '#333333',
    tabIconDefault: '#999999',
    tabIconSelected: '#000000',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** Inter font family */
    sans: 'Inter',
    /** Anonymous Pro font family (unused) */
    serif: 'AnonymousPro',
    /** Inter font family */
    rounded: 'Inter',
    /** Anonymous Pro font family (unused) */
    mono: 'AnonymousPro',
  },
  default: {
    sans: 'Inter',
    serif: 'AnonymousPro',
    rounded: 'Inter',
    mono: 'AnonymousPro',
  },
  web: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "'Anonymous Pro', Georgia, 'Times New Roman', serif",
    rounded: "'Inter', 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "'Anonymous Pro', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
