// src/hooks/useWardrobeMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppData, Item } from '../types';

const WARDROBE_KEY = ['wardrobe'] as const;

// Дефолтные данные (на случай, если кэш пустой)
const getDefaultData = (): AppData => ({
  items: [],
  tags: [],
  collections: [],
  settings: { version: process.env.REACT_APP_VERSION || '1.2.0', lastBackup: new Date() },
});

export const useWardrobeMutations = () => {
  const queryClient = useQueryClient();

  // Оптимистичное переключение избранного
  const toggleFavorite = useMutation({
    mutationFn: async (itemId: string): Promise<string> => {
      // Имитация запроса к серверу (или AsyncStorage)
      // В реальном приложении — await api.toggleFavorite(itemId)
      await new Promise(resolve => setTimeout(resolve, 300)); // искусственная задержка
      return itemId;
    },

    // 1. Оптимистичное обновление — UI обновляется мгновенно
    onMutate: async (itemId: string) => {
      // Отменяем текущие запросы, чтобы не было конфликтов
      await queryClient.cancelQueries({ queryKey: WARDROBE_KEY });

      // Сохраняем предыдущее состояние (для отката)
      const previousData = queryClient.getQueryData<AppData>(WARDROBE_KEY);

      // Обновляем кэш оптимистично
      queryClient.setQueryData<AppData>(WARDROBE_KEY, old => {
        if (!old) return getDefaultData();

        const updatedItems = old.items.map(
          (item): Item =>
            item.id === itemId
              ? { ...item, isFavorite: !item.isFavorite, updatedAt: new Date() }
              : item
        );

        return { ...old, items: updatedItems };
      });

      // Возвращаем контекст для onError
      return { previousData };
    },

    // 2. Если произошла ошибка — откатываем UI
    onError: (error, itemId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(WARDROBE_KEY, context.previousData);
      }

      // TODO: Add proper error handling (toast, alert)
      // Можно показать тост: "Не удалось обновить избранное"
    },

    // 3. После завершения (успех или ошибка) — синхронизируем с хранилищем
    onSettled: () => {
      // Это запустит useWardrobeData → автосохранение в AsyncStorage
      queryClient.invalidateQueries({ queryKey: WARDROBE_KEY });
    },
  });

  return {
    toggleFavorite: toggleFavorite.mutate,
    isToggling: toggleFavorite.isPending,
    isError: toggleFavorite.isError,
    error: toggleFavorite.error,
  };
};
