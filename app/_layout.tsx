import { AnonymousPro_400Regular } from '@expo-google-fonts/anonymous-pro';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { initDatabase } from '@/src/api';
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'AnonymousPro': AnonymousPro_400Regular,
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      initDatabase().catch(console.error);
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="add-item" options={{ headerShown: false }} />
        <Stack.Screen name="edit-item" options={{ headerShown: false }} />
        <Stack.Screen name="item/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="capsules/index" options={{ headerShown: false }} />
        <Stack.Screen name="capsules/create" options={{ headerShown: false }} />
        <Stack.Screen name="capsules/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="tags" options={{ title: 'Теги' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
