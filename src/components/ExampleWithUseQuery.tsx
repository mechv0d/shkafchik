// src/components/ExampleWithUseQuery.tsx
// ПРИМЕР КОМПОНЕНТА С useQuery — РЕКОМЕНДУЕТСЯ ИСПОЛЬЗОВАТЬ!

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { fetchWardrobeData } from '../api/wardrobeApi';
import ItemCard from './ItemCard';

const ExampleWithUseQuery: React.FC = () => {
    // useQuery автоматически управляет состоянием загрузки, ошибками и кэшем
    const {
        data: items = [], // Данные уже извлечены и имеют fallback
        isLoading,
        isError,
        error,
        refetch // Для ручного обновления, если нужно
    } = useQuery({
        queryKey: ['wardrobe'], // Ключ для кэширования — тот же, что и в других компонентах
        queryFn: fetchWardrobeData,
        select: (data) => data.items ?? [], // Извлекаем только items из полного ответа
        staleTime: 1000 * 60 * 5, // Данные свежие 5 минут
        gcTime: 1000 * 60 * 30, // В кэше 30 минут
    });

    // Состояние загрузки
    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-600">Загрузка вещей...</Text>
            </View>
        );
    }

    // Состояние ошибки
    if (isError) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-red-600 text-lg mb-4">⚠️ Ошибка загрузки</Text>
                <Text className="text-gray-600 text-center mb-4">
                    {error?.message || 'Произошла неизвестная ошибка'}
                </Text>
                <Text className="text-gray-500 text-center text-sm">
                    Проверьте интернет-соединение и попробуйте снова
                </Text>
            </View>
        );
    }

    // Пустое состояние
    if (items.length === 0) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-2xl mb-4">👕</Text>
                <Text className="text-xl font-bold text-gray-800 mb-2">
                    В гардеробе пусто
                </Text>
                <Text className="text-gray-600 text-center">
                    Добавьте свою первую вещь, чтобы начать
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        onPress={() => Alert.alert('Вещь', item.name)}
                    />
                )}
                contentContainerClassName="p-4"
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default ExampleWithUseQuery;
