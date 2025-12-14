// src/components/ExampleWithUseEffect.tsx
// ПРИМЕР КОМПОНЕНТА С useEffect — НЕ ИСПОЛЬЗОВАТЬ В ПРОДАКШЕНЕ!
// Этот компонент демонстрирует, как НЕ надо делать

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { fetchWardrobeData } from '../api/wardrobeApi';
import { Item } from '../types';
import ItemCard from './ItemCard';

const ExampleWithUseEffect: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true; // Защита от memory leaks

        const loadItems = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchWardrobeData();
                if (mounted) {
                    setItems(data.items ?? []);
                }
            } catch (err) {
                console.error('Error loading items:', err);
                if (mounted) {
                    setError('Ошибка загрузки данных');
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadItems();

        return () => {
            mounted = false; // Cleanup
        };
    }, []); // Пустой массив зависимостей — запрос только при mount

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-600">Загрузка вещей...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-red-600 text-lg mb-4">⚠️ {error}</Text>
                <Text className="text-gray-600 text-center">
                    Проверьте интернет-соединение и попробуйте снова
                </Text>
            </View>
        );
    }

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

export default ExampleWithUseEffect;
