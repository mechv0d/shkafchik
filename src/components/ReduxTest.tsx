import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../store/hooks/useSettings';
import { useUI } from '../store/hooks/useUI';
import { useAppDispatch } from '../store/hooks';
import { loadWardrobeData, saveWardrobeDataThunk } from '../store/thunks/wardrobeThunks';

export const ReduxTest: React.FC = () => {
  const settings = useSettings();
  const ui = useUI();
  const dispatch = useAppDispatch();

  const handleTestThunks = async () => {
    try {
      // Тестируем загрузку данных
      const result = await dispatch(loadWardrobeData()).unwrap();
      Alert.alert('Успех', `Загружено ${result.items?.length || 0} элементов`);

      // Тестируем сохранение данных
      await dispatch(saveWardrobeDataThunk(result)).unwrap();
      Alert.alert('Успех', 'Данные сохранены');
    } catch (error) {
      Alert.alert('Ошибка', error as string);
    }
  };

  return (
    <ScrollView className="bg-gray-50 p-4">
      <Text className="text-2xl font-bold mb-6 text-center">Redux Test Component</Text>

      {/* Тест настроек */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-3">Настройки Redux</Text>
        <View className="space-y-2">
          <TouchableOpacity
            className={`p-3 rounded ${settings.showPrices ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={settings.toggleShowPrices}
          >
            <Text className={settings.showPrices ? 'text-white' : 'text-gray-800'}>
              Цены: {settings.showPrices ? 'Включены' : 'Выключены'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`p-3 rounded ${settings.notificationsEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
            onPress={settings.toggleNotifications}
          >
            <Text className={settings.notificationsEnabled ? 'text-white' : 'text-gray-800'}>
              Уведомления: {settings.notificationsEnabled ? 'Включены' : 'Выключены'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Тест UI состояния */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-3">UI Состояние Redux</Text>
        <View className="space-y-2">
          <TouchableOpacity
            className="p-3 bg-purple-500 rounded"
            onPress={() => ui.openModal('settings')}
          >
            <Text className="text-white">Открыть модальное окно настроек</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-3 bg-red-500 rounded" onPress={ui.closeAllModals}>
            <Text className="text-white">Закрыть все модальные окна</Text>
          </TouchableOpacity>

          <Text className="text-sm text-gray-600 mt-2">Активная вкладка: {ui.activeTab}</Text>
          <Text className="text-sm text-gray-600">Поисковый запрос: {`"${ui.searchQuery}"`}</Text>
        </View>
      </View>

      {/* Тест Thunks */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-3">Тест асинхронных операций</Text>
        <TouchableOpacity className="p-3 bg-indigo-500 rounded" onPress={handleTestThunks}>
          <Text className="text-white">Тестировать загрузку/сохранение данных</Text>
        </TouchableOpacity>

        {settings.isLoading && <Text className="text-blue-600 mt-2">Загрузка...</Text>}

        {settings.error && <Text className="text-red-600 mt-2">Ошибка: {settings.error}</Text>}
      </View>

      {/* Текущие значения */}
      <View className="bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-lg font-semibold mb-3">Текущее состояние</Text>
        <Text className="text-sm text-gray-600">Загрузка: {settings.isLoading ? 'Да' : 'Нет'}</Text>
        <Text className="text-sm text-gray-600">
          Глобальная загрузка: {ui.globalLoading ? 'Да' : 'Нет'}
        </Text>
        <Text className="text-sm text-gray-600">Глобальная ошибка: {ui.globalError || 'Нет'}</Text>
      </View>
    </ScrollView>
  );
};
