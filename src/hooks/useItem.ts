// src/hooks/useItem.ts
import { useQuery } from '@tanstack/react-query';
import { fetchWardrobeData } from '../api/wardrobeApi';
import { Item } from '../types';

export const useItem = (itemId: string) => {
    return useQuery({
        queryKey: ['item', itemId],
        queryFn: async (): Promise<Item | null> => {
            const data = await fetchWardrobeData();
            return data.items.find(item => item.id === itemId) || null;
        },
        enabled: !!itemId, // Запрос выполняется только если itemId не пустой
        staleTime: 1000 * 60 * 5, // 5 минут
        gcTime: 1000 * 60 * 30, // 30 минут
        select: (data) => data, // Возвращаем найденную вещь или null
    });
};