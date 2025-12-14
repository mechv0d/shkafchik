// src/api/wardrobeApi.ts
import { storage } from '../shared/lib/storage/asyncStorage';
import { AppData } from '../types';

// Базовая функция загрузки всех данных
export const fetchWardrobeData = async (): Promise<AppData> => {
  const data = await storage.loadData();
  return (
    data ?? {
      items: [],
      tags: [],
      collections: [],
      settings: { version: process.env.REACT_APP_VERSION || '1.2.0' },
    }
  );
};

// Для мутаций — сохраняем всё сразу
export const saveWardrobeData = async (data: AppData): Promise<void> => {
  await storage.saveData(data);
};
