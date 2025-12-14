// src/hooks/useSearchItems.ts
import { useQuery } from '@tanstack/react-query';
import { useWardrobeData } from './useWardrobeData';

export const useSearchItems = (query: string) => {
  const { items } = useWardrobeData();

  return useQuery({
    queryKey: ['search', query],
    queryFn: () => {
      const q = query.toLowerCase();
      return items.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.notes?.toLowerCase().includes(q) ||
          item.purchasePlace?.toLowerCase().includes(q)
      );
    },
    enabled: query.length >= 2,
    staleTime: 30_000,
    placeholderData: previousData => previousData ?? [],
  });
};
