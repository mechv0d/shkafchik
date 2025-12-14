// src/hooks/useSettings.ts
import { useQuery } from '@tanstack/react-query';
import { fetchWardrobeData } from '../api/wardrobeApi';

export interface AppSettings {
    version: string;
    lastBackup: Date | null;
    // Здесь можно добавить другие настройки в будущем
    theme?: 'light' | 'dark' | 'auto';
    notifications?: boolean;
    autoBackup?: boolean;
}

export const useSettings = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: async (): Promise<AppSettings> => {
            const data = await fetchWardrobeData();
            return data.settings;
        },
        staleTime: 1000 * 60 * 10, // 10 минут - настройки меняются редко
        gcTime: 1000 * 60 * 60, // 1 час в кэше
    });
};