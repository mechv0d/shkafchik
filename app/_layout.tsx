import { Stack } from 'expo-router';
import 'react-native-reanimated';
import './global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
      <Stack/>
  );
}
