// src/hooks/useTags.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWardrobeData } from '../api/wardrobeApi';
import { Tag } from '../types';

export const useTags = () => {
  const queryClient = useQueryClient();

  const { data: tags = [], ...query } = useQuery({
    queryKey: ['wardrobe'],
    queryFn: fetchWardrobeData,
    select: data => data.tags ?? [],
  });

  const addTag = useMutation({
    mutationFn: async (tagData: Omit<Tag, 'id'>) => {
      const current = queryClient.getQueryData<{ tags: Tag[] }>(['wardrobe']) ?? { tags: [] };
      const newTag: Tag = {
        ...tagData,
        id: `${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      };
      const updated = { ...current, tags: [...current.tags, newTag] };
      queryClient.setQueryData(['wardrobe'], updated);
      return newTag;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wardrobe'] }),
  });

  return {
    tags,
    isLoading: query.isLoading,
    addTag: addTag.mutate,
  };
};
