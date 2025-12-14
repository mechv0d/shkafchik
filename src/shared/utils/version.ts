// src/shared/utils/version.ts
import packageJson from '../../../package.json';

/**
 * Получить текущую версию приложения
 * @returns версия приложения из package.json
 */
export const getAppVersion = (): string => {
  return packageJson.version;
};
