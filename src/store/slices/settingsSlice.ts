import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  loadWardrobeData,
  saveWardrobeDataThunk,
  syncWardrobeData,
} from '../thunks/wardrobeThunks';

interface SettingsState {
  // Тема приложения
  theme: 'light' | 'dark' | 'system';

  // Настройки отображения
  showPrices: boolean;
  showRatings: boolean;
  compactView: boolean;

  // Настройки уведомлений
  notificationsEnabled: boolean;

  // Язык интерфейса
  language: 'ru' | 'en';

  // Валюта
  currency: 'RUB' | 'USD' | 'EUR';

  // Другие настройки
  autoBackup: boolean;
  hapticFeedback: boolean;

  // Состояние загрузки
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: 'system',
  showPrices: true,
  showRatings: true,
  compactView: false,
  notificationsEnabled: true,
  language: 'ru',
  currency: 'RUB',
  autoBackup: true,
  hapticFeedback: true,
  isLoading: false,
  error: null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Установка темы
    setTheme: (state, action: PayloadAction<SettingsState['theme']>) => {
      state.theme = action.payload;
    },

    // Переключение отображения цен
    toggleShowPrices: state => {
      state.showPrices = !state.showPrices;
    },

    // Переключение отображения рейтингов
    toggleShowRatings: state => {
      state.showRatings = !state.showRatings;
    },

    // Переключение компактного вида
    toggleCompactView: state => {
      state.compactView = !state.compactView;
    },

    // Переключение уведомлений
    toggleNotifications: state => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },

    // Установка языка
    setLanguage: (state, action: PayloadAction<SettingsState['language']>) => {
      state.language = action.payload;
    },

    // Установка валюты
    setCurrency: (state, action: PayloadAction<SettingsState['currency']>) => {
      state.currency = action.payload;
    },

    // Переключение автобэкапа
    toggleAutoBackup: state => {
      state.autoBackup = !state.autoBackup;
    },

    // Переключение тактильной обратной связи
    toggleHapticFeedback: state => {
      state.hapticFeedback = !state.hapticFeedback;
    },

    // Обновление нескольких настроек
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      Object.assign(state, action.payload);
    },

    // Сброс настроек к умолчанию
    resetSettings: state => {
      Object.assign(state, initialState);
    },

    // Установка состояния загрузки
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Установка ошибки
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    // Загрузка данных гардероба
    builder
      .addCase(loadWardrobeData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadWardrobeData.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(loadWardrobeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load data';
      });

    // Сохранение данных гардероба
    builder
      .addCase(saveWardrobeDataThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveWardrobeDataThunk.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(saveWardrobeDataThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to save data';
      });

    // Синхронизация данных
    builder
      .addCase(syncWardrobeData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncWardrobeData.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(syncWardrobeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to sync data';
      });
  },
});

export const {
  setTheme,
  toggleShowPrices,
  toggleShowRatings,
  toggleCompactView,
  toggleNotifications,
  setLanguage,
  setCurrency,
  toggleAutoBackup,
  toggleHapticFeedback,
  updateSettings,
  resetSettings,
  setLoading,
  setError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
