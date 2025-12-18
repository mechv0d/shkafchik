import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Базовые селекторы
const selectSettingsState = (state: RootState) => state.settings;

// Селектор для получения конфигурации отображения
export const selectDisplayConfig = createSelector([selectSettingsState], settings => ({
  showPrices: settings.showPrices,
  showRatings: settings.showRatings,
  compactView: settings.compactView,
}));

// Селектор для получения настроек уведомлений
export const selectNotificationSettings = createSelector([selectSettingsState], settings => ({
  notificationsEnabled: settings.notificationsEnabled,
  hapticFeedback: settings.hapticFeedback,
}));

// Селектор для получения региональных настроек
export const selectLocaleSettings = createSelector([selectSettingsState], settings => ({
  language: settings.language,
  currency: settings.currency,
}));

// Селектор для получения настроек хранения данных
export const selectStorageSettings = createSelector([selectSettingsState], settings => ({
  autoBackup: settings.autoBackup,
}));

// Селектор для проверки, включены ли все уведомления
export const selectAreAllNotificationsEnabled = createSelector(
  [selectNotificationSettings],
  notificationSettings =>
    notificationSettings.notificationsEnabled && notificationSettings.hapticFeedback
);

// Селектор для получения темы с учетом системной настройки
export const selectResolvedTheme = createSelector([selectSettingsState], settings => {
  if (settings.theme === 'system') {
    // В реальном приложении здесь будет логика определения системной темы
    return 'light'; // По умолчанию светлая тема
  }
  return settings.theme;
});
