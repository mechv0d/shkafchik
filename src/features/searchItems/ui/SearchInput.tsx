// src/features/searchItems/ui/SearchInput.tsx
import React from 'react';
import { TextInput, View } from 'react-native';
import { useUI } from '../../../store/hooks/useUI';

interface SearchInputProps {
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Поиск вещей...' }) => {
  const { searchQuery, setSearchQuery } = useUI();
  return (
    <View className="px-4 py-2">
      <TextInput
        className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};
