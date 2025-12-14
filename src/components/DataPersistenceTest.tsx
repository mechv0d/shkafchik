// src/components/DataPersistenceTest.tsx
// Тестовый компонент для проверки сохранения данных

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAppActions } from '../context/AppContext';
import { useItems } from '../hooks/useItems';

const DataPersistenceTest: React.FC = () => {
  const { addItem } = useAppActions();
  const { items } = useItems();
  const [testCounter, setTestCounter] = useState(0);

  const addTestItem = () => {
    const testItem = {
      name: `Тестовая вещь ${testCounter + 1}`,
      photos: [],
      price: Math.floor(Math.random() * 5000) + 1000,
      rating: Math.floor(Math.random() * 5) + 1,
      notes: `Тестовая заметка ${testCounter + 1}`,
      purchasePlace: `Магазин ${testCounter + 1}`,
      tags: [],
      cardType: 'purchased' as const,
      isFavorite: Math.random() > 0.5,
    };

    addItem(testItem);
    setTestCounter(prev => prev + 1);

    Alert.alert(
      'Вещь добавлена!',
      `Добавлена "${testItem.name}". Обновите страницу (F5) — вещь должна остаться.`,
      [{ text: 'OK' }]
    );
  };

  const clearAllItems = () => {
    // Для тестирования — очищаем через storage напрямую
    const clearAll = async () => {
      await AsyncStorage.removeItem('@wardrobe/data');
      window.location.reload(); // Перезагрузка страницы
    };

    Alert.alert('Очистить все данные?', 'Это удалит все вещи и перезагрузит страницу.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Очистить',
        style: 'destructive',
        onPress: clearAll,
      },
    ]);
  };

  return (
    <View className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 m-4">
      <Text className="text-yellow-800 font-bold text-lg mb-3">🧪 Тест сохранения данных</Text>

      <Text className="text-yellow-700 mb-2">
        Всего вещей: <Text className="font-bold">{items.length}</Text>
      </Text>

      <View className="flex-row space-x-2 mb-3">
        <TouchableOpacity className="bg-blue-500 p-3 rounded flex-1" onPress={addTestItem}>
          <Text className="text-white font-semibold text-center">➕ Добавить тестовую вещь</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-500 p-3 rounded flex-1" onPress={clearAllItems}>
          <Text className="text-white font-semibold text-center">🗑️ Очистить всё</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-yellow-100 p-2 rounded">
        <Text className="text-yellow-800 text-sm">
          💡 <Text className="font-bold">Инструкция:</Text> Добавьте вещь → обновите страницу (F5) →
          вещь должна остаться в списке.
        </Text>
      </View>

      {items.length > 0 && (
        <View className="mt-3">
          <Text className="text-yellow-800 font-semibold mb-2">Последние добавленные:</Text>
          {items.slice(-3).map((item, _index) => (
            <Text key={item.id} className="text-yellow-700 text-sm">
              • {item.name}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default DataPersistenceTest;
