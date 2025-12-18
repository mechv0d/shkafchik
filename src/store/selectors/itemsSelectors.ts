import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
// Item type import removed — not used in selectors

// Базовые селекторы
const selectItemsState = (state: RootState) => state.items;

// Селектор для получения отфильтрованных элементов
// (в реальном приложении элементы будут приходить из React Query,
// здесь просто демонстрируем использование селекторов)
export const selectFilteredItems = createSelector([selectItemsState], _itemsState => {
  // В реальном приложении здесь будет логика фильтрации
  // Пока возвращаем пустой массив как демонстрацию
  return [];
});

// Селектор для получения выбранных элементов
export const selectSelectedItems = createSelector(
  [selectItemsState],
  itemsState => itemsState.selectedItems
);

// Селектор для проверки, выбраны ли все элементы
export const selectAreAllItemsSelected = createSelector([selectItemsState], itemsState => {
  // В реальном приложении здесь будет сравнение с общим количеством элементов
  return itemsState.selectedItems.length > 0;
});

// Селектор для получения активных фильтров
export const selectActiveFilters = createSelector([selectItemsState], itemsState => {
  const activeFilters: string[] = [];

  if (itemsState.filters.cardType) activeFilters.push('cardType');
  if (itemsState.filters.tags && itemsState.filters.tags.length > 0) activeFilters.push('tags');
  if (itemsState.filters.favorite) activeFilters.push('favorite');
  if (itemsState.filters.search) activeFilters.push('search');

  return activeFilters;
});

// Селектор для получения количества активных фильтров
export const selectActiveFiltersCount = createSelector(
  [selectActiveFilters],
  activeFilters => activeFilters.length
);

// Селектор для получения настроек сортировки
export const selectSortingConfig = createSelector([selectItemsState], itemsState => ({
  sortBy: itemsState.sortBy,
  sortOrder: itemsState.sortOrder,
}));
