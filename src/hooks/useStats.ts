// src/hooks/useStats.ts
import { useQuery } from '@tanstack/react-query';
import { fetchWardrobeData } from '../api/wardrobeApi';

export interface Stats {
    totalItems: number;
    favoriteItems: number;
    inCartItems: number;
    purchasedItems: number;
    totalValue: number;
    averageRating: number;
    totalTags: number;
    itemsWithPhotos: number;
    oldestItem: Date | null;
    newestItem: Date | null;
}

export const useStats = () => {
    return useQuery({
        queryKey: ['stats'],
        queryFn: async (): Promise<Stats> => {
            const data = await fetchWardrobeData();

            const items = data.items;
            const totalItems = items.length;
            const favoriteItems = items.filter(item => item.isFavorite).length;
            const inCartItems = items.filter(item => item.cardType === 'in_cart').length;
            const purchasedItems = items.filter(item => item.cardType === 'purchased').length;
            const totalValue = items.reduce((sum, item) => sum + item.price, 0);
            const averageRating = totalItems > 0
                ? items.reduce((sum, item) => sum + item.rating, 0) / totalItems
                : 0;
            const itemsWithPhotos = items.filter(item => item.photos.length > 0).length;

            const dates = items.map(item => item.createdAt).filter(date => date);
            const oldestItem = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
            const newestItem = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;

            return {
                totalItems,
                favoriteItems,
                inCartItems,
                purchasedItems,
                totalValue,
                averageRating: Math.round(averageRating * 10) / 10, // Округляем до 1 знака
                totalTags: data.tags.length,
                itemsWithPhotos,
                oldestItem,
                newestItem,
            };
        },
        staleTime: 1000 * 60 * 5, // 5 минут
        gcTime: 1000 * 60 * 30, // 30 минут
    });
};