import { Item } from '../models';

// API service types
export interface CreateItemData extends Omit<Item, 'id' | 'date_created' | 'date_modified'> {}

export interface UpdateItemData extends Partial<CreateItemData> {}

export interface FilterOptions {
  category?: string;
  status?: string;
  search?: string;
}

export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ItemsService {
  getItems(): Promise<ApiResponse<Item[]>>;
  getItem(id: number): Promise<ApiResponse<Item>>;
  createItem(data: CreateItemData): Promise<ApiResponse<Item>>;
  updateItem(data: UpdateItemData & { id: number }): Promise<ApiResponse<Item>>;
  deleteItem(id: number): Promise<ApiResponse<void>>;
}

// Re-export Item from models for convenience
export { Item } from '../models';
