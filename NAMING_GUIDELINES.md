# Правила именования (Naming Guidelines)

Этот документ описывает соглашения об именовании для проекта "Шкафчик" (React Native + Expo).

## Общие принципы

- **Консистентность**: Все имена должны следовать единым правилам
- **Читаемость**: Имена должны быть понятными и описательными
- **Язык**: Используем английский язык для технических имен

## Компоненты (Components)

### React компоненты

- **Формат**: PascalCase
- **Примеры**:
  - `UserProfile.tsx`
  - `ItemCard.tsx`
  - `EmptyState.tsx`
  - `SearchInput.tsx`

### Файлы компонентов

- **Формат**: PascalCase + `.tsx`
- **Расположение**: `src/shared/ui/[componentName]/[ComponentName].tsx`

## Хуки (Hooks)

### Кастомные хуки

- **Формат**: camelCase с префиксом `use`
- **Примеры**:
  - `useItems.ts`
  - `useWardrobeData.ts`
  - `useSearchItems.ts`
  - `useToggleFavorite.ts`

### Файлы хуков

- **Формат**: camelCase с префиксом `use` + `.ts`
- **Расположение**: `src/shared/hooks/` или внутри features `src/features/[feature]/model/`

## Функции и методы

### Обычные функции

- **Формат**: camelCase
- **Примеры**:
  - `fetchWardrobeData()`
  - `saveWardrobeData()`
  - `formatDate()`
  - `calculateTotalPrice()`

### API функции

- **Формат**: camelCase
- **Примеры**:
  - `fetchWardrobeData()`
  - `updateItem()`
  - `deleteItem()`

## Переменные и константы

### Переменные

- **Формат**: camelCase
- **Примеры**:
  - `userName`
  - `itemList`
  - `isLoading`
  - `searchQuery`

### Константы

- **Формат**: SCREAMING_SNAKE_CASE
- **Примеры**:
  - `DEFAULT_APP_DATA`
  - `API_BASE_URL`
  - `MAX_ITEMS_PER_PAGE`
  - `STORAGE_KEYS`

## Типы и интерфейсы (Types & Interfaces)

### TypeScript типы

- **Формат**: PascalCase
- **Примеры**:
  - `UserData`
  - `ItemProps`
  - `ApiResponse`
  - `NavigationParams`

### Интерфейсы

- **Формат**: PascalCase
- **Примеры**:
  - `User`
  - `Item`
  - `Tag`
  - `AppData`

### Объединения типов (Unions)

- **Формат**: PascalCase + суффикс `Type`
- **Примеры**:
  - `CardType`
  - `ButtonVariant`
  - `StatusType`

## Файлы и папки

### Файлы

- **Компоненты**: PascalCase + `.tsx`
- **Хуки**: camelCase + `.ts`
- **Типы**: camelCase + `.types.ts` или `index.ts`
- **Утилиты**: camelCase + `.ts`
- **API**: camelCase + `.ts`
- **Константы**: camelCase + `.ts`

### Папки

- **Формат**: camelCase или kebab-case (единообразно)
- **Примеры**:
  - `shared/`
  - `features/`
  - `entities/`
  - `item-card/`
  - `add-item/`

## Feature-Sliced Design (FSD) структура

### Слои архитектуры

```
src/
├── app/           # Инициализация приложения
├── pages/         # Страницы приложения
├── widgets/       # Крупные UI блоки
├── features/      # Бизнес-функции
├── entities/      # Бизнес-сущности
└── shared/        # Переиспользуемый код
```

### Правила импортов между слоями

- `shared` → не импортирует другие слои
- `entities` → может импортировать `shared`
- `features` → может импортировать `entities` и `shared`
- `widgets` → может импортировать `features`, `entities`, `shared`
- `pages` → может импортировать все нижние слои
- `app` → может импортировать все слои

## Специальные случаи

### Boolean переменные

- **Формат**: Префикс `is`, `has`, `should`, `can`
- **Примеры**:
  - `isLoading`
  - `hasError`
  - `shouldShowModal`
  - `canDeleteItem`

### Event handlers

- **Формат**: Префикс `handle` + PascalCase
- **Примеры**:
  - `handleSubmit`
  - `handleDelete`
  - `handleItemPress`

### React props

- **Формат**: camelCase
- **Примеры**:
  - `onPress`
  - `itemData`
  - `isDisabled`

## Инструменты проверки

### ESLint правила

```json
{
  "rules": {
    "react/jsx-pascal-case": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase"]
      },
      {
        "selector": "function",
        "format": ["camelCase"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      }
    ]
  }
}
```

## Примеры рефакторинга

### До/После для компонентов

```tsx
// ❌ Неправильно
const userprofile = () => { ... }
const USER_PROFILE = () => { ... }

// ✅ Правильно
const UserProfile = () => { ... }
```

### До/После для хуков

```tsx
// ❌ Неправильно
const getItems = () => { ... }
const GetItems = () => { ... }

// ✅ Правильно
const useItems = () => { ... }
```

### До/После для констант

```tsx
// ❌ Неправильно
const apiBaseUrl = "..." // camelCase для константы
const defaultAppData = { ... } // camelCase для константы

// ✅ Правильно
const API_BASE_URL = "..."
const DEFAULT_APP_DATA = { ... }
```

## Ответственность за соблюдение

- **Авторы кода**: Соблюдать правила при написании нового кода
- **Code Review**: Проверять соблюдение naming conventions
- **CI/CD**: Автоматическая проверка через ESLint
- **Рефакторинг**: Постепенное приведение существующего кода к стандартам
