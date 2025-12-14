// src/features/searchItems/ui/SearchInput.tsx
import React from 'react';
import { TextInput, View } from 'react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Поиск вещей...',
}) => {
  return (
    <View className="px-4 py-2">
      <TextInput
        className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};
