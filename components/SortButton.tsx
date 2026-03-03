import { ThemedText } from '@/components/themed-text';
import { sortButtonsStyles } from '@/styles/SortButtons.styles';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface SortButtonProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  isActive: boolean;
  onPress: () => void;
}

export function SortButton({ title, icon, count, isActive, onPress }: SortButtonProps) {
  return (
    <TouchableOpacity
      style={[sortButtonsStyles.sortButton, isActive && sortButtonsStyles.sortButtonActive, { overflow: 'visible' }]}
      onPress={onPress}
    >
      {isActive ? (
          React.isValidElement(icon) ? React.cloneElement(icon, { color: '#fff' } as any) : icon
        ) : (
          React.isValidElement(icon) ? React.cloneElement(icon, { color: '#000' } as any) : icon
        )}
        {isActive && <ThemedText style={[sortButtonsStyles.sortButtonText, isActive && sortButtonsStyles.sortButtonTextActive]}>
              {title}
            </ThemedText>}
      <ThemedText style={sortButtonsStyles.sortCount}>
        {count}
      </ThemedText>
    </TouchableOpacity>
  );
}
