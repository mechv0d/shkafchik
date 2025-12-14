// src/context/AppContext.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useContext } from 'react';
import { saveWardrobeData } from '../api/wardrobeApi';
import { AppData, Item, Tag } from '../types';

// Типы действий
type AddItemData = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateItemData = { id: string; updates: Partial<Item> };

interface AppContextType {
    // Мутации — только действия, меняющие данные
    addItem: (item: AddItemData) => void;
    updateItem: (data: UpdateItemData) => void;
    deleteItem: (id: string) => void;
    toggleFavorite: (id: string) => void;
    addTag: (tag: Omit<Tag, 'id'>) => void;
    clearAllData: () => Promise<void>;
}

// Контекст
const AppContext = createContext<AppContextType | undefined>(undefined);

// Провайдер
export const AppProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();

    // Вспомогательная функция генерации ID
    const generateId = () => `${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // === Мутации ===

    const addItem = useMutation({
        mutationFn: async (newItemData: AddItemData) => {
            const current = queryClient.getQueryData<AppData>(['wardrobe']) ?? {
                items: [],
                tags: [],
                collections: [],
                settings: { version: '1.0.0', lastBackup: null }
            };
            const newItem: Item = {
                ...newItemData,
                id: generateId(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return {...current, items: [newItem, ...current.items]};
        },
        onSuccess: async (updatedData) => {
            // Обновляем кэш
            queryClient.setQueryData(['wardrobe'], updatedData);
            // Сохраняем в AsyncStorage
            await saveWardrobeData(updatedData);
        },
    }).mutate;

    const updateItem = useMutation({
        mutationFn: async ({id, updates}: UpdateItemData) => {
            const current = queryClient.getQueryData<AppData>(['wardrobe']);
            if (!current) throw new Error('No data');
            const updatedItems = current.items.map(item =>
                item.id === id
                    ? {...item, ...updates, updatedAt: new Date()}
                    : item
            );
            return {...current, items: updatedItems};
        },
        onSuccess: async (updatedData) => {
            queryClient.setQueryData(['wardrobe'], updatedData);
            await saveWardrobeData(updatedData);
        },
    }).mutate;

    const deleteItem = useMutation({
        mutationFn: async (id: string) => {
            const current = queryClient.getQueryData<AppData>(['wardrobe']);
            if (!current) return current;
            return {
                ...current,
                items: current.items.filter(item => item.id !== id),
            };
        },
        onSuccess: async (updatedData) => {
            if (updatedData) {
                queryClient.setQueryData(['wardrobe'], updatedData);
                await saveWardrobeData(updatedData);
            }
        },
    }).mutate;

    const toggleFavorite = useMutation({
        mutationFn: async (id: string) => {
            const current = queryClient.getQueryData<AppData>(['wardrobe']);
            if (!current) return current;
            const updatedItems = current.items.map(item =>
                item.id === id
                    ? {...item, isFavorite: !item.isFavorite, updatedAt: new Date()}
                    : item
            );
            return {...current, items: updatedItems};
        },
        onSuccess: async (updatedData) => {
            if (updatedData) {
                queryClient.setQueryData(['wardrobe'], updatedData);
                await saveWardrobeData(updatedData);
            }
        },
    }).mutate;

    const addTag = useMutation({
        mutationFn: async (tagData: Omit<Tag, 'id'>) => {
            const current = queryClient.getQueryData<AppData>(['wardrobe']) ?? {
                items: [],
                tags: [],
                collections: [],
                settings: { version: '1.0.0', lastBackup: null }
            };
            const newTag: Tag = {
                ...tagData,
                id: generateId(),
            };
            return {...current, tags: [...current.tags, newTag]};
        },
        onSuccess: async (updatedData) => {
            queryClient.setQueryData(['wardrobe'], updatedData);
            await saveWardrobeData(updatedData);
        },
    }).mutate;

    const clearAllData = async () => {
        await queryClient.setQueryData(['wardrobe'], {items: [], tags: [], collections: [], settings: {}});
        queryClient.invalidateQueries({queryKey: ['wardrobe']});
    };

    const value: AppContextType = {
        addItem,
        updateItem,
        deleteItem,
        toggleFavorite,
        addTag,
        clearAllData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Хук для использования
export const useAppActions = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppActions must be used within AppProvider');
    }
    return context;
};