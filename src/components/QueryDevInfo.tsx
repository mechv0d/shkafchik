// src/components/QueryDevInfo.tsx
// Компонент для отображения информации о React Query (для разработки)

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

const QueryDevInfo: React.FC = () => {
    const queryClient = useQueryClient();

    // Получаем все активные запросы
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();

    // Группируем по статусу
    const stats = {
        fresh: queries.filter(q => q.isStale() === false).length,
        stale: queries.filter(q => q.isStale() === true).length,
        fetching: queries.filter(q => q.isFetching()).length,
        paused: queries.filter(q => q.isPaused()).length,
        inactive: queries.filter(q => q.state.status === 'pending').length,
        error: queries.filter(q => q.state.status === 'error').length,
        success: queries.filter(q => q.state.status === 'success').length,
    };

    return (
        <ScrollView className="bg-gray-900 p-4 rounded-lg max-h-96">
            <Text className="text-white font-bold text-lg mb-4">🔍 React Query Dev Info</Text>

            {/* Статистика */}
            <View className="mb-4">
                <Text className="text-white font-semibold mb-2">Статистика запросов:</Text>
                <View className="grid grid-cols-2 gap-2">
                    <View className="bg-green-600 p-2 rounded">
                        <Text className="text-white text-sm">Свежие: {stats.fresh}</Text>
                    </View>
                    <View className="bg-yellow-600 p-2 rounded">
                        <Text className="text-white text-sm">Устаревшие: {stats.stale}</Text>
                    </View>
                    <View className="bg-blue-600 p-2 rounded">
                        <Text className="text-white text-sm">Загружаются: {stats.fetching}</Text>
                    </View>
                    <View className="bg-purple-600 p-2 rounded">
                        <Text className="text-white text-sm">Приостановлены: {stats.paused}</Text>
                    </View>
                    <View className="bg-gray-600 p-2 rounded">
                        <Text className="text-white text-sm">Неактивные: {stats.inactive}</Text>
                    </View>
                    <View className="bg-red-600 p-2 rounded">
                        <Text className="text-white text-sm">С ошибками: {stats.error}</Text>
                    </View>
                    <View className="bg-green-700 p-2 rounded col-span-2">
                        <Text className="text-white text-sm">Успешные: {stats.success}</Text>
                    </View>
                </View>
            </View>

            {/* Активные запросы */}
            <View>
                <Text className="text-white font-semibold mb-2">Активные запросы:</Text>
                {queries.length === 0 ? (
                    <Text className="text-gray-400">Нет активных запросов</Text>
                ) : (
                    <View className="space-y-2">
                        {queries.map((query) => (
                            <View key={JSON.stringify(query.queryKey)} className="bg-gray-800 p-3 rounded">
                                <Text className="text-white font-medium text-sm">
                                    Ключ: {JSON.stringify(query.queryKey)}
                                </Text>
                                <Text className="text-gray-300 text-xs">
                                    Статус: {query.state.status} |
                                    Данные: {query.state.data ? '✅' : '❌'} |
                                    Загрузка: {query.isFetching() ? '🔄' : '⏹️'} |
                                    Свежий: {query.isStale() ? '❌' : '✅'}
                                </Text>
                                {query.state.dataUpdatedAt > 0 && (
                                    <Text className="text-gray-400 text-xs">
                                        Обновлено: {new Date(query.state.dataUpdatedAt).toLocaleTimeString()}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Советы */}
            <View className="mt-4 bg-blue-900 p-3 rounded">
                <Text className="text-blue-200 font-semibold mb-2">💡 Советы по кэшированию:</Text>
                <Text className="text-blue-100 text-xs leading-5">
                    • Один queryKey = один кэшированный запрос{'\n'}
                    • select позволяет извлекать части данных без нового запроса{'\n'}
                    • staleTime определяет "свежесть" данных{'\n'}
                    • gcTime управляет временем жизни в кэше
                </Text>
            </View>
        </ScrollView>
    );
};

export default QueryDevInfo;
