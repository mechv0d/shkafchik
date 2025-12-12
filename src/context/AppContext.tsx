import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { AppContextType, Item, Tag, AppData } from '../types';
import { storage } from '../storage/asyncStorage';

// Используем типы для повышения читаемости и предотвращения ошибок
type AppState = {
    items: Item[];
    tags: Tag[];
};

type AppAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_DATA'; payload: AppData }
    | { type: 'ADD_ITEM'; payload: Item }
    | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<Item> } }
    | { type: 'DELETE_ITEM'; payload: string }
    | { type: 'TOGGLE_FAVORITE'; payload: string }
    | { type: 'ADD_TAG'; payload: Tag }
    | { type: 'CLEAR_DATA' };

const initialState: AppState = {
    items: [],
    tags: [],
};

// Обновленный reducer с комментариями и более безопасным кодом
const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                items: action.payload.items || [],
                tags: action.payload.tags || [],
            };

        case 'ADD_ITEM':
            return {
                ...state,
                items: [action.payload, ...state.items],
            };

        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, ...action.payload.updates, updatedAt: new Date() }
                        : item
                ),
            };

        case 'DELETE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
            };

        case 'TOGGLE_FAVORITE':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload
                        ? { ...item, isFavorite: !item.isFavorite, updatedAt: new Date() }
                        : item
                ),
            };

        case 'ADD_TAG':
            return {
                ...state,
                tags: [...state.tags, action.payload],
            };

        case 'CLEAR_DATA':
            // Возвращаем начальное состояние, но можно также загрузить из initialData, если доступно
            return {
                items: [],
                tags: [],
            };

        default:
            return state;
    }
};

// Контекст приложения
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка данных при старте приложения
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            const data = await storage.loadData();
            dispatch({ type: 'SET_DATA', payload: data });
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Автосохранение данных при изменении
    useEffect(() => {
        if (!isLoading) {
            saveData();
        }
    }, [state.items, state.tags]);

    const saveData = async () => {
        try {
            const appData: AppData = {
                items: state.items,
                tags: state.tags,
                collections: [], // Можно использовать placeholder или подключить реальные данные
                settings: {
                    version: '1.0.0',
                    lastBackup: new Date(),
                },
            };
            await storage.saveData(appData);
        } catch (error) {
            console.error('Error auto-saving data:', error);
        }
    };

    // Генерация уникального ID
    const generateId = (): string => {
        return `${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    };

    // Очистка данных
    const clearData = () => {
        dispatch({ type: 'CLEAR_DATA' });
    };

    // Добавление нового элемента
    const addItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newItem: Item = {
            ...itemData,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        dispatch({ type: 'ADD_ITEM', payload: newItem });
    };

    // Обновление существующего элемента
    const updateItem = (id: string, updates: Partial<Item>) => {
        dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } });
    };

    // Удаление элемента
    const deleteItem = (id: string) => {
        dispatch({ type: 'DELETE_ITEM', payload: id });
    };

    // Переключение флага "избранное"
    const toggleFavorite = (id: string) => {
        dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
    };

    // Добавление тега
    const addTag = (tagData: Omit<Tag, 'id'>) => {
        const newTag: Tag = {
            ...tagData,
            id: generateId(),
        };
        dispatch({ type: 'ADD_TAG', payload: newTag });
    };

    // Фильтрация элементов по различным критериям
    const getFilteredItems = (filters: {
        cardType?: string;
        tags?: string[];
        favorite?: boolean;
        search?: string;
    }) => {
        let filtered = state.items;

        if (filters.cardType) {
            filtered = filtered.filter(item => item.cardType === filters.cardType);
        }

        if (filters.favorite !== undefined) {
            filtered = filtered.filter(item => item.isFavorite === filters.favorite);
        }

        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(item =>
                item.tags.some(tag => filters.tags!.includes(tag.id))
            );
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchLower) ||
                item.notes?.toLowerCase().includes(searchLower) ||
                item.purchasePlace?.toLowerCase().includes(searchLower)
            );
        }

        return filtered;
    };

    // Объект контекста, который будет передаваться в компоненты
    const value: AppContextType = {
        items: state.items,
        tags: state.tags,
        addItem,
        updateItem,
        deleteItem,
        toggleFavorite,
        addTag,
        getFilteredItems,
        isLoading,
        clearData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Хук для использования контекста
export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};