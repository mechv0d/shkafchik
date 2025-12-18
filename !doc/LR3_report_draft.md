# Отчёт по интеграции Redux Toolkit (LR3)

Ниже приведён текст отчёта по выполнению задания LR3 — интеграции Redux Toolkit в проект "Шкафчик". Этот черновик можно положить в PDF, добавив скриншоты Redux DevTools и ссылку на репозиторий.

---

## 1. Краткое описание проделанной работы

В проекте "Шкафчик" выполнена интеграция Redux Toolkit для управления глобальным состоянием приложения. Были созданы хранилище (`store`), набор срезов (`slices`), асинхронные операции (`thunks`), типизированные хуки и мемоизированные селекторы. Добавлена обработка ошибок и интеграция в пользовательские экраны для замены локального состояния на Redux.

Основные цели:

- централизовать управление UI-настройками и фильтрами;
- упростить тестирование и отладку через Redux DevTools;
- обеспечить типобезопасность и предсказуемость state-менеджмента.

---

## 2. Архитектура Redux в проекте

Структура папки `src/store/`:

- `store.ts` — конфигурация store и экспорт типов `RootState`, `AppDispatch`.
- `slices/` — набор срезов состояния:
  - `itemsSlice` — управление фильтрами, выбором элементов, загрузкой/ошибками.
  - `tagsSlice` — управление выбранными тегами, режимом редактирования.
  - `settingsSlice` — пользовательские настройки (тема, уведомления, язык и т.д.).
  - `uiSlice` — UI-состояние: модальные окна, поиск, глобальные ошибки/загрузка.
- `thunks/` — асинхронные операции, работа с хранилищем данных (загрузка/сохранение/импорт/экспорт).
- `hooks/` — типизированные хуки (`useAppDispatch`, `useAppSelector`) и удобные обёртки (`useItems`, `useSettings`, `useUI`).
- `selectors/` — мемоизированные селекторы через `createSelector`.

Главная идея — каждый слой приложения (features/pages/widgets) использует Redux только для глобального состояния (настройки, фильтры, глобальные модальные окна), а данные долгоживущие (wardrobe) по-прежнему кэшируются и синхронизируются через React Query + AsyncStorage; Redux выступает как единый источник правды для UI и клиентских настроек.

---

## 3. Описание созданных slices и их назначение

- `itemsSlice`
  - отвечает за фильтры, сортировку, выделенные элементы и состояние загрузки/ошибки на уровне UI.
- `tagsSlice`
  - управляет выбранными тегами для фильтрации, режимом редактирования и ошибками.
- `settingsSlice`
  - хранит пользовательские настройки интерфейса: тема, отображение цен/рейтингов, уведомления, язык, валюта и т. п.
  - также обрабатывает состояния асинхронных операций по загрузке/сохранению данных через extraReducers.
- `uiSlice`
  - модальные окна, активная вкладка, глобальные сообщения об ошибках, поисковый запрос.

Эти срезы позволяют компонентам получать только нужную часть state и диспачить локальные (синхронные) действия без необходимости пробрасывать пропсы глубоко по дереву компонентов.

---

## 4. Примеры кода

Ниже приведён минимальный пример одного из созданных `slice` и одного `thunk`. В проекте эти примеры оформлены в соответствующих файлах `src/store/slices/` и `src/store/thunks/`.

Пример `itemsSlice` (сокращённый):

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ItemsState {
  filters: {
    cardType?: 'purchased' | 'in_cart';
    tags?: string[];
    favorite?: boolean;
    search?: string;
  };
  selectedItems: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  filters: {},
  selectedItems: [],
  isLoading: false,
  error: null,
};

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<ItemsState['filters']>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.selectedItems.indexOf(id);
      if (idx > -1) state.selectedItems.splice(idx, 1);
      else state.selectedItems.push(id);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
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
  toggleItemSelection,
  setLoading,
  setError,
  resetItemsState,
} = itemsSlice.actions;
```

Пример `thunk` для загрузки данных гардероба:

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWardrobeData } from '../../shared/api/wardrobeApi';
import { AppData } from '../../shared/types';

export const loadWardrobeData = createAsyncThunk<
  AppData,
  void,
  { rejectValue: string }
>('wardrobe/loadData', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchWardrobeData();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to load wardrobe data'
    );
  }
});
```

В `settingsSlice` и других слайсах используются `extraReducers` для обработки `pending/fulfilled/rejected` состояний этих thunks и для установки полей `isLoading`/`error`.

---

## 5. Сравнение «до» и «после» интеграции Redux

До интеграции:

- Часть состояния хранилась в Context API (`AppContext`), часть — в локальном состоянии компонентов (`useState`).
- Сложнее отслеживать глобальные UI-настройки и консистентно синхронизировать фильтры между экранами.
- Ограниченные возможности для отладки (без единой точки входа в state).

После интеграции:

- Единый источник правды для UI-настроек и фильтров (`store`).
- Упрощённая отладка с помощью Redux DevTools (time travel, inspect actions/state).
- Типобезопасные хуки и селекторы позволяют уменьшить количество ошибок в коде.
- Компоненты стали чище: переключение с пропсов/контекстов на `useAppSelector`/`useAppDispatch`.

Проблемы и сложности:

- Нужно следить за гранулярностью state и не дублировать данные (например, не хранить одни и те же сущности и в React Query cache, и в Redux).
- Переход требует рефакторинга нескольких компонентов.
- Требуется дисциплина: использовать мемоизированные селекторы, чтобы избежать лишних ререндеров.

---

## 6. Рекомендации по документированию и скриншотам

- В PDF-версии отчёта добавьте:
  - Скриншоты Redux DevTools с примерами actions (например, setFilters, loadWardrobeData) и снимком state.
  - Листинг структуры `src/store/`.
  - Сравнительные скриншоты или короткие сценарии «до/после» (например, последовательность действий: изменить фильтр — проверить, что состояние синхронизировано между экранами).

---

## 7. Пример содержимого для README (коротко)

> В `src/store/` находится конфигурация Redux Toolkit. Используются slices: `items`, `tags`, `settings`, `ui`. Асинхронные операции оформлены через `createAsyncThunk` в `src/store/thunks/`. Для доступа к state используются типизированные хуки `useAppSelector`/`useAppDispatch` и удобные обёртки `useItems`, `useSettings`, `useUI`.

---

## 8. Ссылка на репозиторий

Добавьте сюда ссылку на ваш репозиторий GitHub/GitLab после выгрузки изменений:

`https://github.com/<your-username>/<your-repo>`

---

Если нужно, могу:

- сжать этот Markdown в PDF (подскажу команды/инструменты), или
- добавить дополнительные примеры кода (селекторы, хуки, extraReducers) по запросу.
