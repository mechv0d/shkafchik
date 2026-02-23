import React from 'react';
import { View } from 'react-native';

interface AnimatedTabIconProps {
  iconComponent: React.ComponentType<{ color: string; size: number }>;
  focused: boolean;
}

export const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ iconComponent, focused }) => {
  const IconComponent = iconComponent;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <IconComponent color={focused ? '#3B82F6' : '#94A3B8'} size={24} />
      <View
        style={{
          position: 'absolute',
          bottom: -8,
          width: 20,
          height: 4,
          backgroundColor: '#3B82F6',
          borderRadius: 2,
          opacity: focused ? 1 : 0,
        }}
      />
    </View>
  );
};
