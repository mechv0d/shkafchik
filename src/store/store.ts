import { configureStore } from '@reduxjs/toolkit';
import { itemsSlice } from './slices/itemsSlice';
import { tagsSlice } from './slices/tagsSlice';
import { settingsSlice } from './slices/settingsSlice';
import { uiSlice } from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    items: itemsSlice.reducer,
    tags: tagsSlice.reducer,
    settings: settingsSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем несериализуемые значения в действиях
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
