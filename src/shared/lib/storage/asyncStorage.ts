import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../../../types';

// Функция для рекурсивного преобразования строк дат обратно в Date объекты
const reviveDatesInObject = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(reviveDatesInObject);
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Проверяем, является ли значение строкой даты (ISO формат)
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      result[key] = new Date(value);
    } else if (typeof value === 'object') {
      result[key] = reviveDatesInObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};

const STORAGE_KEYS = {
  DATA: '@wardrobe/data',
  SETTINGS: '@wardrobe/settings',
};

const initialData: AppData = {
  items: [
    {
      id: '1',
      name: 'Футболка Nike',
      price: 2500,
      photos: [],
      tags: [
        { id: '1', name: 'Синее', color: '#3B82F6', colorType: 'light' },
        { id: '2', name: 'Фаворит', color: '#EF4444', colorType: 'light' },
      ],
      rating: 4,
      notes: 'Отличная футболка для спорта',
      purchasePlace: 'Спортмастер',
      cardType: 'purchased',
      isFavorite: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: "Джинсы Levi's",
      price: 8000,
      photos: [],
      tags: [{ id: '1', name: 'Синее', color: '#3B82F6', colorType: 'light' }],
      rating: 5,
      notes: 'Классические джинсы',
      purchasePlace: 'Wildberries',
      cardType: 'in_cart',
      isFavorite: false,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      name: 'Кроссовки Adidas',
      price: 12000,
      photos: [],
      tags: [],
      rating: 0,
      notes: '',
      purchasePlace: 'Adidas Store',
      cardType: 'purchased',
      isFavorite: false,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ],
  tags: [
    { id: '1', name: 'Синее', color: '#3B82F6', colorType: 'light' },
    { id: '2', name: 'Фаворит', color: '#EF4444', colorType: 'light' },
    { id: '3', name: 'На выброс', color: '#6B7280', colorType: 'light' },
  ],
  collections: [],
  settings: {
    version: process.env.REACT_APP_VERSION || '1.2.0',
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
      // Silent error - storage operations should fail gracefully
      throw error;
    }
  },

  // Загрузка всех данных
  loadData: async (): Promise<AppData> => {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.DATA);
      if (jsonData) {
        const parsedData = JSON.parse(jsonData);
        return reviveDatesInObject(parsedData);
      }
      // Если данных нет, возвращаем начальные данные
      await storage.saveData(initialData);
      return initialData;
    } catch {
      // Silent error - storage operations should fail gracefully
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
      const data: AppData = reviveDatesInObject(JSON.parse(jsonString));
      await storage.saveData(data);
    } catch {
      // Silent error - storage operations should fail gracefully
      throw new Error('Invalid JSON format');
    }
  },

  // Очистка всех данных
  clearData: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DATA);
    } catch (error) {
      // Silent error - storage operations should fail gracefully
      throw error;
    }
  },
};
