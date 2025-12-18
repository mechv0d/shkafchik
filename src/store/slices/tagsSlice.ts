import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TagsState {
  // Выбранные теги для фильтрации
  selectedTagIds: string[];

  // Состояние загрузки
  isLoading: boolean;
  error: string | null;

  // Режим редактирования тегов
  editingTagId: string | null;
}

const initialState: TagsState = {
  selectedTagIds: [],
  isLoading: false,
  error: null,
  editingTagId: null,
};

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    // Выбор/снятие выбора тега
    toggleTagSelection: (state, action: PayloadAction<string>) => {
      const tagId = action.payload;
      const index = state.selectedTagIds.indexOf(tagId);
      if (index > -1) {
        state.selectedTagIds.splice(index, 1);
      } else {
        state.selectedTagIds.push(tagId);
      }
    },

    // Установка выбранных тегов
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTagIds = action.payload;
    },

    // Очистка выбранных тегов
    clearSelectedTags: state => {
      state.selectedTagIds = [];
    },

    // Установка режима редактирования тега
    setEditingTag: (state, action: PayloadAction<string | null>) => {
      state.editingTagId = action.payload;
    },

    // Установка состояния загрузки
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Установка ошибки
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Сброс состояния
    resetTagsState: state => {
      state.selectedTagIds = [];
      state.isLoading = false;
      state.error = null;
      state.editingTagId = null;
    },
  },
});

export const {
  toggleTagSelection,
  setSelectedTags,
  clearSelectedTags,
  setEditingTag,
  setLoading,
  setError,
  resetTagsState,
} = tagsSlice.actions;

export default tagsSlice.reducer;
