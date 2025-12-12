// src/providers/QueryProvider.tsx

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// DevTools в React Native нужен специальный импорт
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/modern/production.js';

// 1. Создаем QueryClient с базовой конфигурацией и глобальными опциями
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 🟢 staleTime (10 секунд): данные считаются свежими 10 секунд
            staleTime: 10 * 1000,

            // 🟢 gcTime (cacheTime в v4) (5 минут): время хранения неиспользуемых данных в кэше
            gcTime: 5 * 60 * 1000,

            // 🟢 retry (1): 1 попытка повторного запроса при ошибке (всего 2 запроса: исходный + 1 повтор)
            retry: 1,
        },
    },
});

export const QueryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}

            {/* 🟢 3. Подключаем React Query DevTools для development режима */}
            {/* Проверка на Platform.OS === 'web' или __DEV__ для React Native */}
            {/* DevTools отображается только в режиме разработчика */}
            {__DEV__ && (
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
            )}
        </QueryClientProvider>
    );
};

