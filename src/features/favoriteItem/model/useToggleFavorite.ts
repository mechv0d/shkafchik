// src/features/favoriteItem/model/useToggleFavorite.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Item } from '../../../shared/types';

const WARDROBE_KEY = ['wardrobe'] as const;

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (itemId: string): Promise<string> => {
      // Имитация запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 300));
      return itemId;
    },
    onMutate: async (itemId: string) => {
      // Отменяем текущие запросы
      await queryClient.cancelQueries({ queryKey: WARDROBE_KEY });

      // Сохраняем предыдущее состояние
      const previousData = queryClient.getQueryData<{ items: Item[] }>(WARDROBE_KEY);

      // Оптимистичное обновление
      queryClient.setQueryData<{ items: Item[] }>(WARDROBE_KEY, old => {
        if (!old) return old;
        const updatedItems = old.items.map(
          (item): Item =>
            item.id === itemId
              ? { ...item, isFavorite: !item.isFavorite, updatedAt: new Date() }
              : item
        );
        return { ...old, items: updatedItems };
      });

      return { previousData };
    },
    onError: (error, itemId, context) => {
      // Откат при ошибке
      if (context?.previousData) {
        queryClient.setQueryData(WARDROBE_KEY, context.previousData);
      }
    },
    onSettled: () => {
      // Синхронизация с хранилищем
      queryClient.invalidateQueries({ queryKey: WARDROBE_KEY });
    },
  });

  return {
    toggleFavorite: toggleFavoriteMutation.mutate,
    isToggling: toggleFavoriteMutation.isPending,
    isError: toggleFavoriteMutation.isError,
    error: toggleFavoriteMutation.error,
  };
};
