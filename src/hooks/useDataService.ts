import { useCallback, useEffect, useState } from 'react';
import {
  capsulesService,
  categoriesService,
  CreateItemData,
  DataState,
  FilterOptions,
  itemsService,
  tagsService,
  UpdateItemData
} from '../api/index';
import { Capsule, Category, Item, Tag } from '../models';

// Generic hook for managing data state
export function useDataService<T>(
  service: any,
  storageKey: string,
  fetchFn: () => Promise<any>
) {
  const [state, setState] = useState<DataState<T>>({
    loading: false,
    data: null,
    error: null
  });

  const fetchData = useCallback(async () => {
    setState((prev: DataState<T>) => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await fetchFn();
      
      if (result.success && result.data) {
        setState({
          loading: false,
          data: result.data,
          error: null
        });
        
        // Save to local storage
        await service[`set${storageKey}State`]({
          loading: false,
          data: result.data,
          error: null
        });
      } else {
        setState({
          loading: false,
          data: null,
          error: result.error || 'Failed to fetch data'
        });
      }
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  }, [service, storageKey, fetchFn]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Load from local storage on mount
  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        const savedState = await service[`get${storageKey}State`]();
        if (savedState) {
          setState(savedState);
        }
      } catch (error) {
        console.error('Error loading from storage:', error);
      }
    };
    
    loadFromStorage();
  }, [service, storageKey]);

  return {
    ...state,
    refresh,
    fetchData
  };
}

// Hook for items management
export function useItems(filter?: FilterOptions) {
  const [state, setState] = useState<DataState<Item[]>>({
    loading: false,
    data: null,
    error: null
  });

  const fetchItems = useCallback(async () => {
    setState((prev: DataState<Item[]>) => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await itemsService.getItems(filter);
      
      if (result.success && result.data) {
        setState({
          loading: false,
          data: result.data,
          error: null
        });
        
        // Save to local storage
        await itemsService.setItemsState({
          loading: false,
          data: result.data,
          error: null
        });
      } else {
        setState({
          loading: false,
          data: null,
          error: result.error || 'Failed to fetch items'
        });
      }
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  }, [filter]);

  const createItem = useCallback(async (data: CreateItemData) => {
    setState((prev: DataState<Item[]>) => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await itemsService.createItem(data);
      
      if (result.success) {
        // Refresh the items list
        await fetchItems();
        return { success: true, data: result.data };
      } else {
        setState((prev: DataState<Item[]>) => ({
          ...prev,
          loading: false,
          error: result.error || 'Failed to create item'
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState((prev: DataState<Item[]>) => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, [fetchItems]);

  const updateItem = useCallback(async (data: UpdateItemData & { id: number }) => {
    setState((prev: DataState<Item[]>) => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await itemsService.updateItem(data);
      
      if (result.success) {
        // Refresh the items list
        await fetchItems();
        return { success: true, data: result.data };
      } else {
        setState((prev: DataState<Item[]>) => ({
          ...prev,
          loading: false,
          error: result.error || 'Failed to update item'
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState((prev: DataState<Item[]>) => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, [fetchItems]);

  const deleteItem = useCallback(async (id: number) => {
    setState((prev: DataState<Item[]>) => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await itemsService.deleteItem(id);
      
      if (result.success) {
        // Refresh the items list
        await fetchItems();
        return { success: true };
      } else {
        setState((prev: DataState<Item[]>) => ({
          ...prev,
          loading: false,
          error: result.error || 'Failed to delete item'
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState((prev: DataState<Item[]>) => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, [fetchItems]);

  // Load from local storage on mount
  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        const savedState = await itemsService.getItemsState();
        if (savedState) {
          setState({
            loading: false,
            data: savedState.data?.data || null,
            error: null
          });
        }
      } catch (error) {
        console.error('Error loading from storage:', error);
      }
    };
    
    loadFromStorage();
  }, []);

  return {
    ...state,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    refresh: fetchItems
  };
}

// Hook for categories management
export function useCategories() {
  return useDataService<Category[]>(
    categoriesService,
    'Categories',
    () => categoriesService.getCategories()
  );
}

// Hook for tags management
export function useTags() {
  return useDataService<Tag[]>(
    tagsService,
    'Tags',
    () => tagsService.getTags()
  );
}

// Hook for capsules management
export function useCapsules() {
  return useDataService<Capsule[]>(
    capsulesService,
    'Capsules',
    () => capsulesService.getCapsules()
  );
}
