import React from 'react';
import { View, Text } from 'react-native';

interface TabBarIconProps {
  icon: string;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ icon, color, size }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: size - 4 }}>{icon}</Text>
    </View>
  );
};

export default TabBarIcon;
