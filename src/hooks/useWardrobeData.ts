// src/hooks/useWardrobeData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchWardrobeData } from '../api/wardrobeApi';
import { AppData } from '../types';

const defaultData: AppData = {
  items: [],
  tags: [],
  collections: [],
  settings: { version: process.env.REACT_APP_VERSION || '1.2.0', lastBackup: null },
};

export const useWardrobeData = () => {
  const query = useQuery<AppData>({
    queryKey: ['wardrobe'],
    queryFn: fetchWardrobeData,
    staleTime: 1000 * 60 * 5, // 5 минут — данные "свежие"
    gcTime: 1000 * 60 * 30, // 30 минут в кэше
    refetchInterval: 1000 * 60 * 10, // автообновление каждые 10 минут
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: defaultData,
  });

  return {
    ...query,
    data: query.data ?? defaultData,
    items: query.data?.items ?? [],
    tags: query.data?.tags ?? [],
  };
};

// Prefetching — вызываем в навигации или при открытии приложения
export const prefetchWardrobeData = (queryClient: any) => {
  return queryClient.prefetchQuery({
    queryKey: ['wardrobe'],
    queryFn: fetchWardrobeData,
    staleTime: 1000 * 60 * 5,
  });
};
