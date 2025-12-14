// src/features/searchItems/model/useSearchItems.ts
import { useQuery } from '@tanstack/react-query';
import { Item } from '../../../shared/types';
import { fetchWardrobeData } from '../../../shared/api/wardrobeApi';

export const useSearchItems = (query: string) => {
  return useQuery({
    queryKey: ['wardrobe', 'search', query],
    queryFn: async (): Promise<Item[]> => {
      if (query.length < 2) return [];

      const data = await fetchWardrobeData();
      const searchTerm = query.toLowerCase();

      return data.items.filter(
        item =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.tags.some(tag => tag.name.toLowerCase().includes(searchTerm)) ||
          item.notes.toLowerCase().includes(searchTerm)
      );
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};
