import { useAppSelector, useAppDispatch } from './index';
import {
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
} from '../slices/settingsSlice';

// Хук для работы с настройками
export const useSettings = () => {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector(state => state.settings);

  return {
    // Состояние
    ...settingsState,

    // Действия
    setTheme: (theme: typeof settingsState.theme) => dispatch(setTheme(theme)),
    toggleShowPrices: () => dispatch(toggleShowPrices()),
    toggleShowRatings: () => dispatch(toggleShowRatings()),
    toggleCompactView: () => dispatch(toggleCompactView()),
    toggleNotifications: () => dispatch(toggleNotifications()),
    setLanguage: (language: typeof settingsState.language) => dispatch(setLanguage(language)),
    setCurrency: (currency: typeof settingsState.currency) => dispatch(setCurrency(currency)),
    toggleAutoBackup: () => dispatch(toggleAutoBackup()),
    toggleHapticFeedback: () => dispatch(toggleHapticFeedback()),
    updateSettings: (settings: Partial<typeof settingsState>) => dispatch(updateSettings(settings)),
    resetSettings: () => dispatch(resetSettings()),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    setError: (error: string | null) => dispatch(setError(error)),
  };
};
