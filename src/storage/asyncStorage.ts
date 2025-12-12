import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../types';

const STORAGE_KEYS = {
    DATA: '@wardrobe/data',
    SETTINGS: '@wardrobe/settings',
};

const initialData: AppData = {
    items: [],
    tags: [
        { id: '1', name: 'Синее', color: '#3B82F6', colorType: 'light' },
        { id: '2', name: 'Фаворит', color: '#EF4444', colorType: 'light' },
        { id: '3', name: 'На выброс', color: '#6B7280', colorType: 'light' },
    ],
    collections: [],
    settings: {
        version: '1.0.0',
        lastBackup: null,
    },
};

export const storage = {
    // Сохранение всех данных
    saveData: async (data: AppData): Promise<void> => {
        try {
            const jsonData = JSON.stringify(data);
            await AsyncStorage.setItem(STORAGE_KEYS.DATA, jsonData);
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    },

    // Загрузка всех данных
    loadData: async (): Promise<AppData> => {
        try {
            const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.DATA);
            if (jsonData) {
                return JSON.parse(jsonData);
            }
            // Если данных нет, возвращаем начальные данные
            await storage.saveData(initialData);
            return initialData;
        } catch (error) {
            console.error('Error loading data:', error);
            return initialData;
        }
    },

    // Экспорт данных в JSON строку
    exportData: async (): Promise<string> => {
        const data = await storage.loadData();
        return JSON.stringify(data, null, 2);
    },

    // Импорт данных из JSON строки
    importData: async (jsonString: string): Promise<void> => {
        try {
            const data: AppData = JSON.parse(jsonString);
            await storage.saveData(data);
        } catch (error) {
            console.error('Error importing data:', error);
            throw new Error('Invalid JSON format');
        }
    },

    // Очистка всех данных
    clearData: async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.DATA);
        } catch (error) {
            console.error('Error clearing data:', error);
            throw error;
        }
    },
};