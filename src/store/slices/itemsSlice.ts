import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../shared/types';

interface ItemsState {
  // Фильтры и сортировка
  filters: {
    cardType?: 'purchased' | 'in_cart';
    tags?: string[];
    favorite?: boolean;
    search?: string;
  };
  sortBy: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder: 'asc' | 'desc';

  // Выбранные элементы
  selectedItems: string[];

  // Состояние загрузки
  isLoading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  filters: {},
  sortBy: 'createdAt',
  sortOrder: 'desc',
  selectedItems: [],
  isLoading: false,
  error: null,
};

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    // Установка фильтров
    setFilters: (state, action: PayloadAction<Partial<ItemsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Очистка фильтров
    clearFilters: state => {
      state.filters = {};
    },

    // Установка сортировки
    setSorting: (
      state,
      action: PayloadAction<{ sortBy: ItemsState['sortBy']; sortOrder: ItemsState['sortOrder'] }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },

    // Выбор/снятие выбора элемента
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.selectedItems.indexOf(itemId);
      if (index > -1) {
        state.selectedItems.splice(index, 1);
      } else {
        state.selectedItems.push(itemId);
      }
    },

    // Очистка выбранных элементов
    clearSelection: state => {
      state.selectedItems = [];
    },

    // Выбор всех элементов
    selectAllItems: (state, action: PayloadAction<Item[]>) => {
      state.selectedItems = action.payload.map(item => item.id);
    },

    // Установка состояния загрузки
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Установка ошибки
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Сброс состояния
    resetItemsState: state => {
      state.filters = {};
      state.selectedItems = [];
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setFilters,
  clearFilters,
  setSorting,
  toggleItemSelection,
  clearSelection,
  selectAllItems,
  setLoading,
  setError,
  resetItemsState,
} = itemsSlice.actions;

export default itemsSlice.reducer;
