import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const CategoriesScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-lg text-gray-600 text-center mt-8">Экран категорий</Text>
        <Text className="text-sm text-gray-500 text-center mt-2">
          Здесь будет список категорий вещей
        </Text>
      </ScrollView>
    </View>
  );
};

export default CategoriesScreen;
