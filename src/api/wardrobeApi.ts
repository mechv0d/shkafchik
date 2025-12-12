// src/api/wardrobeApi.ts
import { storage } from '../storage/asyncStorage';
import { AppData, Item, Tag } from '../types';

// Базовая функция загрузки всех данных
export const fetchWardrobeData = async (): Promise<AppData> => {
    const data = await storage.loadData();
    return data ?? { items: [], tags: [], collections: [], settings: { version: '1.0.0' } };
};

// Для мутаций — сохраняем всё сразу
export const saveWardrobeData = async (data: AppData): Promise<void> => {
    await storage.saveData(data);
};