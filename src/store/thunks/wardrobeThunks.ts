import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWardrobeData, saveWardrobeData } from '../../shared/api/wardrobeApi';
import { AppData } from '../../shared/types';

// Thunk для загрузки данных гардероба
export const loadWardrobeData = createAsyncThunk<AppData, void, { rejectValue: string }>(
  'wardrobe/loadData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchWardrobeData();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load wardrobe data'
      );
    }
  }
);

// Thunk для сохранения данных гардероба
export const saveWardrobeDataThunk = createAsyncThunk<void, AppData, { rejectValue: string }>(
  'wardrobe/saveData',
  async (data, { rejectWithValue }) => {
    try {
      await saveWardrobeData(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to save wardrobe data'
      );
    }
  }
);

// Thunk для синхронизации данных (загрузка + сохранение)
export const syncWardrobeData = createAsyncThunk<AppData, void, { rejectValue: string }>(
  'wardrobe/syncData',
  async (_, { rejectWithValue }) => {
    try {
      // Имитация синхронизации с сервером
      const localData = await fetchWardrobeData();

      // Здесь можно добавить логику синхронизации с удаленным сервером
      // const remoteData = await fetchRemoteData();
      // const mergedData = mergeData(localData, remoteData);

      // Пока просто возвращаем локальные данные
      return localData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to sync wardrobe data'
      );
    }
  }
);

// Thunk для экспорта данных
export const exportWardrobeData = createAsyncThunk<string, void, { rejectValue: string }>(
  'wardrobe/exportData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchWardrobeData();
      const jsonString = JSON.stringify(data, null, 2);
      return jsonString;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to export wardrobe data'
      );
    }
  }
);

// Thunk для импорта данных
export const importWardrobeData = createAsyncThunk<AppData, string, { rejectValue: string }>(
  'wardrobe/importData',
  async (jsonString, { rejectWithValue }) => {
    try {
      const data: AppData = JSON.parse(jsonString);

      // Валидация данных
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }

      // Сохранение импортированных данных
      await saveWardrobeData(data);

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to import wardrobe data'
      );
    }
  }
);
