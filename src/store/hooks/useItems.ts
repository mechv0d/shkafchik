import { useAppSelector, useAppDispatch } from './index';
import {
  setFilters,
  clearFilters,
  setSorting,
  toggleItemSelection,
  clearSelection,
  selectAllItems,
  setLoading,
  setError,
  resetItemsState,
} from '../slices/itemsSlice';
import { Item } from '../../shared/types';

// Хук для работы с состоянием items
export const useItems = () => {
  const dispatch = useAppDispatch();
  const itemsState = useAppSelector(state => state.items);

  return {
    // Состояние
    ...itemsState,

    // Действия
    setFilters: (filters: Partial<typeof itemsState.filters>) => dispatch(setFilters(filters)),
    clearFilters: () => dispatch(clearFilters()),
    setSorting: (sortBy: typeof itemsState.sortBy, sortOrder: typeof itemsState.sortOrder) =>
      dispatch(setSorting({ sortBy, sortOrder })),
    toggleItemSelection: (itemId: string) => dispatch(toggleItemSelection(itemId)),
    clearSelection: () => dispatch(clearSelection()),
    selectAllItems: (items: Item[]) => dispatch(selectAllItems(items)),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    setError: (error: string | null) => dispatch(setError(error)),
    resetItemsState: () => dispatch(resetItemsState()),
  };
};
