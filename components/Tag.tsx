import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export interface TagProps {
  id: number;
  name: string;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  isProtected?: boolean;
}

export function Tag({ 
  id, 
  name, 
  color, 
  onPress, 
  disabled = false, 
  isProtected = false 
}: TagProps) {
  const isWhiteColor = color?.toLowerCase() === '#ffffff';
  const isBeigeColor = color?.toLowerCase() === '#f5f5dc';
  
  let borderColor;
  let circleBorderColor;
  
  if (isWhiteColor) {
    borderColor = '#ccc';
    circleBorderColor = '#ccc';
  } else if (isBeigeColor) {
    borderColor = '#d2b48c'; // Dark beige
    circleBorderColor = '#d2b48c';
  } else {
    borderColor = color || '#007AFF';
    circleBorderColor = 'rgba(0,0,0,0.1)';
  }
  
  return (
    <TouchableOpacity
      style={[
        styles.tag,
        isProtected && styles.protectedTag,
        disabled && styles.disabledTag
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.tagContent, { borderColor }]}>
        <View style={[styles.colorCircle, { backgroundColor: color || '#007AFF', borderColor: circleBorderColor }]} />
        <ThemedText style={styles.tagName}>{name}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    marginBottom: 8,
  },
  
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  
  tagName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  
  protectedTag: {
    opacity: 0.6,
  },
  
  disabledTag: {
    opacity: 0.5,
  },
});
