// src/shared/utils/version.ts
import Constants from 'expo-constants';

/**
 * Получить текущую версию приложения
 * @returns версия приложения из package.json
 */
export const getAppVersion = (): string => {
  // Используем expo-constants для получения версии, которая работает на всех платформах
  return Constants.expoConfig?.version || '1.0.0';
};
