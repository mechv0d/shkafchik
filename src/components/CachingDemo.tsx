// src/components/CachingDemo.tsx
// Демонстрация преимуществ useQuery: кэширование и отсутствие дублированных запросов

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchWardrobeData } from '../api/wardrobeApi';

// Компонент с useQuery — использует кэш
const ItemsWithUseQuery: React.FC = () => {
    const { data: items = [], isLoading, error } = useQuery({
        queryKey: ['wardrobe-demo'],
        queryFn: fetchWardrobeData,
        select: (data) => data.items ?? [],
        staleTime: 1000 * 60 * 5, // 5 минут свежие данные
    });

    if (isLoading) return <ActivityIndicator size="small" color="#3B82F6" />;
    if (error) return <Text className="text-red-500">Ошибка загрузки</Text>;

    return (
        <View className="bg-green-50 p-4 rounded-lg border border-green-200">
            <Text className="text-green-800 font-bold mb-2">✅ useQuery (с кэшем)</Text>
            <Text className="text-green-700 text-sm">
                Загружено {items.length} вещей. Данные кэшируются и переиспользуются.
            </Text>
        </View>
    );
};

// Компонент без кэша — каждый раз новый запрос (имитация useEffect)
const ItemsWithoutCache: React.FC<{ trigger: number }> = ({ trigger }) => {
    const { data: items = [], isLoading, error, refetch } = useQuery({
        queryKey: ['no-cache-demo', trigger], // Разный ключ = нет кэша
        queryFn: fetchWardrobeData,
        select: (data) => data.items ?? [],
        staleTime: 0, // Данные сразу устаревают
        gcTime: 0, // Нет кэша
        refetchOnMount: true, // Всегда refetch при mount
    });

    if (isLoading) return <ActivityIndicator size="small" color="#EF4444" />;
    if (error) return <Text className="text-red-500">Ошибка загрузки</Text>;

    return (
        <View className="bg-red-50 p-4 rounded-lg border border-red-200">
            <Text className="text-red-800 font-bold mb-2">❌ Без кэша (как useEffect)</Text>
            <Text className="text-red-700 text-sm">
                Загружено {items.length} вещей. Каждый раз новый запрос.
            </Text>
        </View>
    );
};

const CachingDemo: React.FC = () => {
    const [trigger, setTrigger] = useState(0);

    return (
        <ScrollView className="flex-1 bg-background p-4">
            <Text className="text-2xl font-bold text-gray-800 mb-6">
                🎯 Демонстрация кэширования useQuery
            </Text>

            <Text className="text-gray-700 mb-4 leading-6">
                useQuery автоматически кэширует данные. Когда несколько компонентов запрашивают одни и те же данные с одинаковым queryKey, выполняется только один запрос, а результат делится между всеми компонентами.
            </Text>

            {/* Примеры компонентов */}
            <View className="space-y-4 mb-6">
                <Text className="text-lg font-semibold text-gray-800">Примеры компонентов:</Text>

                <ItemsWithUseQuery />
                <ItemsWithUseQuery />
                <ItemsWithUseQuery />
            </View>

            <Text className="text-gray-700 mb-4 leading-6">
                Все три компонента выше используют один и тот же queryKey ['wardrobe-demo'].
                Откройте DevTools → Network и посмотрите — запрос выполнится только один раз!
            </Text>

            {/* Плохой пример */}
            <View className="space-y-4 mb-6">
                <Text className="text-lg font-semibold text-gray-800">Плохой пример (без кэша):</Text>

                <ItemsWithoutCache trigger={trigger} />
                <TouchableOpacity
                    className="bg-red-500 p-3 rounded-lg"
                    onPress={() => setTrigger(prev => prev + 1)}
                >
                    <Text className="text-white font-semibold text-center">
                        🔄 Перерендерить (новый запрос)
                    </Text>
                </TouchableOpacity>
            </View>

            <Text className="text-gray-700 mb-4 leading-6">
                Компонент выше имеет разный queryKey при каждом рендере, поэтому кэширование не работает.
                Это аналогично тому, как работал бы useEffect без дополнительной логики.
            </Text>

            {/* Преимущества */}
            <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Text className="text-blue-800 font-bold mb-3">🚀 Преимущества useQuery:</Text>
                <View className="space-y-2">
                    <Text className="text-blue-700 text-sm">• ✅ Автоматическое кэширование</Text>
                    <Text className="text-blue-700 text-sm">• ✅ Предотвращение дублированных запросов</Text>
                    <Text className="text-blue-700 text-sm">• ✅ Управление состояниями loading/error</Text>
                    <Text className="text-blue-700 text-sm">• ✅ Автоматический refetch при фокусе/реконнекте</Text>
                    <Text className="text-blue-700 text-sm">• ✅ Background updates</Text>
                    <Text className="text-blue-700 text-sm">• ✅ Retry логика</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default CachingDemo;
