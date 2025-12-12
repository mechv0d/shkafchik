export type CardType = 'purchased' | 'in_cart';

export interface Tag {
    id: string;
    name: string;
    color: string;
    colorType: 'light' | 'dark';
}

export interface Item {
    id: string;
    name: string;
    photos: string[];
    price: number;
    rating: number;
    notes: string;
    tags: Tag[];
    purchasePlace: string;
    cardType: CardType;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface AppData {
    items: Item[];
    tags: Tag[];
    collections: any[];
    settings: {
        version: string;
        lastBackup: Date | null;
    };
}

export type AppContextType = {
    items: Item[];
    tags: Tag[];
    addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateItem: (id: string, updates: Partial<Item>) => void;
    deleteItem: (id: string) => void;
    toggleFavorite: (id: string) => void;
    addTag: (tag: Omit<Tag, 'id'>) => void;
    getFilteredItems: (filters: {
        cardType?: string;
        tags?: string[];
        favorite?: boolean;
        search?: string;
    }) => Item[];
    clearData: () => void; // Добавляем эту строку
    isLoading: boolean;
};