import { Item } from '../models';
import { initDatabase, ItemDAO } from './database';
import { ApiResponse, CreateItemData, FilterOptions, UpdateItemData } from './types';

export class ItemsService {
  async getItems(filter?: FilterOptions): Promise<ApiResponse<Item[]>> {
    try {
      await initDatabase();
      let items = await ItemDAO.getAll();
      
      // Apply filters if provided
      if (filter) {
        if (filter.category) {
          items = items.filter(item => item.category_id.toString() === filter.category);
        }
        if (filter.status) {
          items = items.filter(item => item.status_id.toString() === filter.status);
        }
        if (filter.search) {
          const searchLower = filter.search.toLowerCase();
          items = items.filter(item => 
            item.name.toLowerCase().includes(searchLower)
          );
        }
      }
      
      return { success: true, data: items };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch items';
      return { success: false, error: message };
    }
  }

  async getItem(id: number): Promise<ApiResponse<Item>> {
    try {
      await initDatabase();
      const item = await ItemDAO.getById(id);
      
      if (!item) {
        return { success: false, error: 'Item not found' };
      }
      
      return { success: true, data: item };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch item';
      return { success: false, error: message };
    }
  }

  async createItem(data: CreateItemData): Promise<ApiResponse<Item>> {
    try {
      await initDatabase();
      const id = await ItemDAO.create(data);
      const item = await ItemDAO.getById(id);
      
      if (!item) {
        return { success: false, error: 'Failed to retrieve created item' };
      }
      
      return { success: true, data: item };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create item';
      return { success: false, error: message };
    }
  }

  async updateItem(data: UpdateItemData & { id: number }): Promise<ApiResponse<Item>> {
    try {
      await initDatabase();
      const success = await ItemDAO.update(data.id, data);
      
      if (!success) {
        return { success: false, error: 'Failed to update item' };
      }
      
      const item = await ItemDAO.getById(data.id);
      
      if (!item) {
        return { success: false, error: 'Item not found after update' };
      }
      
      return { success: true, data: item };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update item';
      return { success: false, error: message };
    }
  }

  async deleteItem(id: number): Promise<ApiResponse<void>> {
    try {
      await initDatabase();
      const success = await ItemDAO.delete(id);
      
      if (!success) {
        return { success: false, error: 'Failed to delete item' };
      }
      
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete item';
      return { success: false, error: message };
    }
  }

  // Storage methods for state management
  async setItemsState(state: any): Promise<void> {
    try {
      localStorage.setItem('itemsState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save items state:', error);
    }
  }

  async getItemsState(): Promise<any> {
    try {
      const stored = localStorage.getItem('itemsState');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load items state:', error);
      return null;
    }
  }
}

export const itemsService = new ItemsService();
