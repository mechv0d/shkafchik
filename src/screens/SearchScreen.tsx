import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useUI } from '../store/hooks/useUI';

const SearchScreen: React.FC = () => {
  const { searchQuery, setSearchQuery } = useUI();

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2 text-base"
          placeholder="Поиск вещей..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView className="flex-1 p-4">
        <Text className="text-lg text-gray-600 text-center mt-8">Экран поиска</Text>
        <Text className="text-sm text-gray-500 text-center mt-2">
          Здесь будет функционал поиска вещей
        </Text>
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
