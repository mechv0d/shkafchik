// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*'],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // Правила именования для FSD архитектуры
      '@typescript-eslint/naming-convention': [
        'error',
        // Компоненты React (PascalCase)
        {
          selector: 'variable',
          format: ['PascalCase'],
          filter: {
            regex:
              '^(Component|Provider|Screen|Form|Modal|Button|Input|Card|Context|Navigator|TabBarIcon|DataPersistenceTest|EmptyState|ItemCard|TagComponent|AddItemScreen|HomeScreen|ItemDetailScreen|SettingsScreen|Tag|SearchInput)$',
            match: true,
          },
        },
        // Хуки (camelCase с префиксом use)
        {
          selector: 'function',
          format: ['camelCase'],
          filter: {
            regex: '^use[A-Z]',
            match: true,
          },
        },
        // Переменные (camelCase)
        {
          selector: 'variable',
          format: ['camelCase'],
          filter: {
            regex:
              '^(API_|DEFAULT_|MAX_|MIN_|STORAGE_|COLORS|FONTS|WARDROBE_KEY|HEADER_HEIGHT|MAPPING|Stack|Tab|TabNavigator|QueryProvider|AppContext|AppProvider)', // Исключаем константы и компоненты
            match: false,
          },
        },
        // Константы (UPPER_CASE)
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE'],
          filter: {
            regex:
              '^(API_|DEFAULT_|MAX_|MIN_|STORAGE_|COLORS|FONTS|WARDROBE_KEY|HEADER_HEIGHT|MAPPING)',
            match: true,
          },
        },
        // Типы и интерфейсы (PascalCase)
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // Параметры функций (camelCase)
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
      ],
      // Дополнительные правила
      'react/jsx-pascal-case': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-var-requires': 'off', // Разрешаем require для AsyncStorage
    },
  },
]);
