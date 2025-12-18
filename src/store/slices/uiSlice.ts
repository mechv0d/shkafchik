import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  // Модальные окна
  modals: {
    addItem: boolean;
    editItem: boolean;
    deleteConfirmation: boolean;
    settings: boolean;
    filters: boolean;
  };

  // Активная вкладка
  activeTab: 'home' | 'settings' | 'search';

  // Поиск
  searchQuery: string;
  isSearchActive: boolean;

  // Загрузка
  globalLoading: boolean;

  // Ошибки
  globalError: string | null;

  // Навигация
  navigationHistory: string[];
}

const initialState: UiState = {
  modals: {
    addItem: false,
    editItem: false,
    deleteConfirmation: false,
    settings: false,
    filters: false,
  },
  activeTab: 'home',
  searchQuery: '',
  isSearchActive: false,
  globalLoading: false,
  globalError: null,
  navigationHistory: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Управление модальными окнами
    openModal: (state, action: PayloadAction<keyof UiState['modals']>) => {
      state.modals[action.payload] = true;
    },

    closeModal: (state, action: PayloadAction<keyof UiState['modals']>) => {
      state.modals[action.payload] = false;
    },

    closeAllModals: state => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UiState['modals']] = false;
      });
    },

    // Установка активной вкладки
    setActiveTab: (state, action: PayloadAction<UiState['activeTab']>) => {
      state.activeTab = action.payload;
    },

    // Управление поиском
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.isSearchActive = action.payload.length > 0;
    },

    clearSearch: state => {
      state.searchQuery = '';
      state.isSearchActive = false;
    },

    // Глобальная загрузка
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    // Глобальные ошибки
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.globalError = action.payload;
    },

    // Навигационная история
    addToNavigationHistory: (state, action: PayloadAction<string>) => {
      state.navigationHistory.push(action.payload);
      // Ограничиваем историю до 10 элементов
      if (state.navigationHistory.length > 10) {
        state.navigationHistory = state.navigationHistory.slice(-10);
      }
    },

    clearNavigationHistory: state => {
      state.navigationHistory = [];
    },

    // Сброс UI состояния
    resetUiState: state => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  openModal,
  closeModal,
  closeAllModals,
  setActiveTab,
  setSearchQuery,
  clearSearch,
  setGlobalLoading,
  setGlobalError,
  addToNavigationHistory,
  clearNavigationHistory,
  resetUiState,
} = uiSlice.actions;

export default uiSlice.reducer;
