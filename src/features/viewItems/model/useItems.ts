// src/hooks/useItems.ts
import { useAppActions } from '@/src/context/AppContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWardrobeData } from '../../../shared/api/wardrobeApi';
import { Item } from '../../../types';

export const useItems = () => {
  const queryClient = useQueryClient();

  const { addItem } = useAppActions();

  const { data, ...query } = useQuery({
    queryKey: ['wardrobe'],
    queryFn: fetchWardrobeData,
    select: data => data.items ?? [],
  });

  // const addMutItem = useMutation().mutate;

  const updateItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Item> }) => {
      const current = queryClient.getQueryData<{ items: Item[] }>(['wardrobe']);
      if (!current) throw new Error('No data');
      const updatedItems = current.items.map(i =>
        i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i
      );
      queryClient.setQueryData(['wardrobe'], { ...current, items: updatedItems });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wardrobe'] }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const current = queryClient.getQueryData<{ items: Item[] }>(['wardrobe']);
      if (!current) return;
      queryClient.setQueryData(['wardrobe'], {
        ...current,
        items: current.items.filter(i => i.id !== id),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wardrobe'] }),
  });

  const toggleFavorite = useMutation({
    mutationFn: async (id: string) => {
      const current = queryClient.getQueryData<{ items: Item[] }>(['wardrobe']);
      if (!current) return;
      const updatedItems = current.items.map(i =>
        i.id === id ? { ...i, isFavorite: !i.isFavorite, updatedAt: new Date() } : i
      );
      queryClient.setQueryData(['wardrobe'], { ...current, items: updatedItems });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wardrobe'] }),
  });

  return {
    items: data ?? [],
    isLoading: query.isLoading,
    addItem: addItem,
    updateItem: updateItem.mutate,
    deleteItem: deleteItem.mutate,
    toggleFavorite: toggleFavorite.mutate,
  };
};
