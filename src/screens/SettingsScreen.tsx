import { Button } from '@/src/shared/ui/button';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, Share, Text, View } from 'react-native';
import { useSettings as useContextSettings } from '../hooks/useSettings';
import { useStats } from '../hooks/useStats';
import { useSettings as useReduxSettings } from '../store/hooks/useSettings';
import { storage } from '../shared/lib/storage/asyncStorage';
import { getAppVersion } from '../shared/utils/version';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: settings } = useContextSettings();

  // Redux hooks для управления настройками
  const reduxSettings = useReduxSettings();

  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const jsonData = await storage.exportData();
      await Share.share({
        message: jsonData,
        title: 'Экспорт данных гардероба',
      });
    } catch {
      Alert.alert('Ошибка', 'Не удалось экспортировать данные');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = () => {
    Alert.alert(
      'Импорт данных',
      'Эта функция будет доступна в следующей версии. Сейчас вы можете делиться данными через экспорт.',
      [{ text: 'Понятно' }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Очистка всех данных',
      'Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить все',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsClearing(true);
              await storage.clearData();
              // clearData(); // TODO: add func
              Alert.alert('Успех', 'Все данные удалены');
              navigation.goBack();
            } catch {
              Alert.alert('Ошибка', 'Не удалось очистить данные');
              // TODO: Add proper error handling (toast, alert)
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  // const stats = {
  //     totalItems: items.length,
  //     favoriteItems: items.filter(i => i.isFavorite).length,
  //     inCartItems: items.filter(i => i.cardType === 'in_cart').length,
  //     totalTags: tags.length,
  // };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 space-y-6">
        {/* Статистика */}
        <View className="bg-card rounded-lg p-4 border border-gray-200">
          <Text className="text-xl font-bold text-gray-800 mb-4">Статистика</Text>
          {statsLoading ? (
            <Text className="text-gray-600">Загрузка статистики...</Text>
          ) : (
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Всего вещей:</Text>
                <Text className="font-semibold">{stats?.totalItems || 0}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">В избранном:</Text>
                <Text className="font-semibold text-red-500">{stats?.favoriteItems || 0}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">В корзине:</Text>
                <Text className="font-semibold text-blue-500">{stats?.inCartItems || 0}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Куплено:</Text>
                <Text className="font-semibold text-green-500">{stats?.purchasedItems || 0}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Общая стоимость:</Text>
                <Text className="font-semibold">
                  {stats?.totalValue ? stats.totalValue.toLocaleString('ru-RU') + ' ₽' : '0 ₽'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Средний рейтинг:</Text>
                <Text className="font-semibold">⭐ {stats?.averageRating || 0}/5</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Тегов:</Text>
                <Text className="font-semibold">{stats?.totalTags || 0}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Управление данными */}
        <View className="bg-card rounded-lg p-4 border border-gray-200">
          <Text className="text-xl font-bold text-gray-800 mb-4">Управление данными</Text>
          <View className="space-y-3">
            <Button
              title="Экспортировать данные"
              onPress={handleExportData}
              loading={isExporting}
              variant="outline"
            />
            <Button
              title="Импортировать данные"
              onPress={handleImportData}
              loading={false}
              variant="outline"
            />
            <Button
              title="Очистить все данные"
              onPress={handleClearData}
              loading={isClearing}
              variant="secondary"
            />
          </View>
        </View>

        {/* Redux настройки */}
        <View className="bg-card rounded-lg p-4 border border-gray-200">
          <Text className="text-xl font-bold text-gray-800 mb-4">Настройки интерфейса</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Показывать цены</Text>
              <Button
                title={reduxSettings.showPrices ? 'Включено' : 'Выключено'}
                onPress={reduxSettings.toggleShowPrices}
                variant={reduxSettings.showPrices ? 'primary' : 'outline'}
                size="sm"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Показывать рейтинги</Text>
              <Button
                title={reduxSettings.showRatings ? 'Включено' : 'Выключено'}
                onPress={reduxSettings.toggleShowRatings}
                variant={reduxSettings.showRatings ? 'primary' : 'outline'}
                size="sm"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Компактный вид</Text>
              <Button
                title={reduxSettings.compactView ? 'Включено' : 'Выключено'}
                onPress={reduxSettings.toggleCompactView}
                variant={reduxSettings.compactView ? 'primary' : 'outline'}
                size="sm"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Уведомления</Text>
              <Button
                title={reduxSettings.notificationsEnabled ? 'Включены' : 'Выключены'}
                onPress={reduxSettings.toggleNotifications}
                variant={reduxSettings.notificationsEnabled ? 'primary' : 'outline'}
                size="sm"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Тактильная обратная связь</Text>
              <Button
                title={reduxSettings.hapticFeedback ? 'Включена' : 'Выключена'}
                onPress={reduxSettings.toggleHapticFeedback}
                variant={reduxSettings.hapticFeedback ? 'primary' : 'outline'}
                size="sm"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Автобэкап</Text>
              <Button
                title={reduxSettings.autoBackup ? 'Включен' : 'Выключен'}
                onPress={reduxSettings.toggleAutoBackup}
                variant={reduxSettings.autoBackup ? 'primary' : 'outline'}
                size="sm"
              />
            </View>
            <View className="pt-2">
              <Button
                title="Сбросить настройки"
                onPress={() => {
                  Alert.alert(
                    'Сброс настроек',
                    'Вернуть настройки интерфейса к значениям по умолчанию?',
                    [
                      { text: 'Отмена', style: 'cancel' },
                      {
                        text: 'Сбросить',
                        style: 'destructive',
                        onPress: reduxSettings.resetSettings,
                      },
                    ]
                  );
                }}
                variant="secondary"
              />
            </View>
          </View>
        </View>

        {/* Информация о приложении */}
        <View className="bg-card rounded-lg p-4 border border-gray-200">
          <Text className="text-xl font-bold text-gray-800 mb-4">О приложении</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Версия:</Text>
              <Text className="font-semibold">{getAppVersion()}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Последний бэкап:</Text>
              <Text className="font-semibold">
                {settings?.lastBackup ? settings.lastBackup.toLocaleDateString('ru-RU') : 'Не было'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Разработчик:</Text>
              <Text className="font-semibold">Рем Сергей</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Группа:</Text>
              <Text className="font-semibold">1ИСП-21</Text>
            </View>
          </View>
        </View>

        {/* Принципы приложения */}
        <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <Text className="text-lg font-bold text-blue-800 mb-2">Наши принципы</Text>
          <View className="space-y-2">
            <Text className="text-blue-700 text-sm">• Простота и минимализм</Text>
            <Text className="text-blue-700 text-sm">• Надежность и стабильность</Text>
            <Text className="text-blue-700 text-sm">• Без лишних функций</Text>
            <Text className="text-blue-700 text-sm">• Ручной контроль данных</Text>
            <Text className="text-blue-700 text-sm">• Без AI и нейросетей</Text>
          </View>
        </View>

        {/* Предупреждение об очистке */}
        <View className="bg-red-50 rounded-lg p-4 border border-red-200">
          <Text className="text-lg font-bold text-red-800 mb-2">Важно!</Text>
          <Text className="text-red-700 text-sm">
            При очистке данных все ваши вещи, теги и настройки будут удалены без возможности
            восстановления. Рекомендуем предварительно сделать экспорт данных.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
