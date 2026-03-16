import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import HangerIcon from '@/components/ui/icons/HangerIcon';
import MoodIcon from '@/components/ui/icons/MoodIcon';
import PlusIcon from '@/components/ui/icons/PlusIcon';
import ProfileIcon from '@/components/ui/icons/ProfileIcon';
import SearchIcon from '@/components/ui/icons/SearchIcon';
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
        name="items"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <HangerIcon color={'#000'} width={24} height={32} viewBox="0 0 24 24" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <SearchIcon color={'#000'} width={24} height={32} viewBox="0 0 24 24" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <PlusIcon color={'#000'} width={24} height={32} viewBox="0 0 24 24" activeLineHeight={22} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="capsules"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <MoodIcon color={'#000'} width={24} height={32} viewBox="0 0 24 24" focused={focused} />,
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