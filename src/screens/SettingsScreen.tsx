import React, {useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert,
    Share,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useApp} from '../context/AppContext';
import {storage} from '../storage/asyncStorage';
import Button from '../components/Button';
import {useItems} from '../hooks/useItems';
import {useTags} from '../hooks/useTags';

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const {items} = useItems();
    const {tags} = useTags();

    const stats = {
        totalItems: items.length,
        favoriteItems: items.filter(i => i.isFavorite).length,
        inCartItems: items.filter(i => i.cardType === 'in_cart').length,
        totalTags: tags.length,
    };

    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const handleExportData = async () => {
        setIsExporting(true);
        try {
            const jsonData = await storage.exportData();
            await Share.share({
                message: jsonData,
                title: 'Экспорт данных гардероба',
            });
        } catch (err) {
            Alert.alert('Ошибка', 'Не удалось экспортировать данные');
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportData = () => {
        Alert.alert(
            'Импорт данных',
            'Эта функция будет доступна в следующей версии. Сейчас вы можете делиться данными через экспорт.',
            [{text: 'Понятно'}]
        );
    };

    const handleClearData = () => {
        Alert.alert(
            'Очистка всех данных',
            'Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.',
            [
                {text: 'Отмена', style: 'cancel'},
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
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось очистить данные');
                            console.error(error);
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
                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Всего вещей:</Text>
                            <Text className="font-semibold">{stats.totalItems}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">В избранном:</Text>
                            <Text className="font-semibold text-red-500">{stats.favoriteItems}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">В корзине:</Text>
                            <Text className="font-semibold text-blue-500">{stats.inCartItems}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Тегов:</Text>
                            <Text className="font-semibold">{stats.totalTags}</Text>
                        </View>
                    </View>
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
                            loading={isImporting}
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

                {/* Информация о приложении */}
                <View className="bg-card rounded-lg p-4 border border-gray-200">
                    <Text className="text-xl font-bold text-gray-800 mb-4">О приложении</Text>
                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Версия:</Text>
                            <Text className="font-semibold">1.0.0</Text>
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
                        При очистке данных все ваши вещи, теги и настройки будут удалены без возможности восстановления.
                        Рекомендуем предварительно сделать экспорт данных.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default SettingsScreen;