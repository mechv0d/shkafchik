import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import HangerIcon from '@/components/ui/icons/HangerIcon';
import PlusIcon from '@/components/ui/icons/PlusIcon';
import ProfileIcon from '@/components/ui/icons/ProfileIcon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
            <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <HangerIcon color={'#000'} width={24} height={32} viewBox="0 0 24 24" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <PlusIcon color={'#000'} width={24} height={32} viewBox="0 0 24 24" activeLineHeight={22} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <ProfileIcon color={'#000'} width={24} height={32} viewBox="0 0 24 24" focused={focused} />,
        }}
      />
    </Tabs>
  );
}