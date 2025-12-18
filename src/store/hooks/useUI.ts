import { useAppSelector, useAppDispatch } from './index';
import {
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
} from '../slices/uiSlice';

// Хук для работы с UI состоянием
export const useUI = () => {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector(state => state.ui);

  return {
    // Состояние
    ...uiState,

    // Действия для модальных окон
    openModal: (modalName: keyof typeof uiState.modals) => dispatch(openModal(modalName)),
    closeModal: (modalName: keyof typeof uiState.modals) => dispatch(closeModal(modalName)),
    closeAllModals: () => dispatch(closeAllModals()),

    // Действия для вкладок
    setActiveTab: (tab: typeof uiState.activeTab) => dispatch(setActiveTab(tab)),

    // Действия для поиска
    setSearchQuery: (query: string) => dispatch(setSearchQuery(query)),
    clearSearch: () => dispatch(clearSearch()),

    // Глобальные действия
    setGlobalLoading: (loading: boolean) => dispatch(setGlobalLoading(loading)),
    setGlobalError: (error: string | null) => dispatch(setGlobalError(error)),

    // Навигация
    addToNavigationHistory: (route: string) => dispatch(addToNavigationHistory(route)),
    clearNavigationHistory: () => dispatch(clearNavigationHistory()),

    // Сброс состояния
    resetUiState: () => dispatch(resetUiState()),
  };
};
