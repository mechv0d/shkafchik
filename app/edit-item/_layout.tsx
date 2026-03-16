import { ProcessedImage } from '@/src/api/imageProcessor';
import { ItemWithDetails } from '@/src/models';
import { Stack } from 'expo-router/stack';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface EditFormData {
  photos: ProcessedImage[];
  name: string;
  description: string;
  status: string;
  statusId?: number;
  purchaseDate: string;
  store: string;
  rating: number;
  category: string;
  subcategory: string;
  categoryId?: number;
  tags: string[];
  existingImages: string[]; // URLs of existing images
  imagesToDelete: string[]; // URLs of images to delete
}

const defaultEditFormData: EditFormData = {
  photos: [],
  name: '',
  description: '',
  status: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  store: '',
  rating: 0,
  category: '',
  subcategory: '',
  tags: ['Новое'],
  existingImages: [],
  imagesToDelete: [],
};

const EditFormContext = createContext<{
  formData: EditFormData;
  updateFormData: (updates: Partial<EditFormData>) => void;
  setInitialData: (item: ItemWithDetails) => void;
} | null>(null);

export const EditFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<EditFormData>(defaultEditFormData);

  const updateFormData = (updates: Partial<EditFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const setInitialData = (item: ItemWithDetails) => {
    const description = item.attributes.find(attr => attr.attribute_type === 'description')?.value || '';
    const purchaseDate = item.attributes.find(attr => attr.attribute_type === 'purchase_date')?.value || '';
    const store = item.attributes.find(attr => attr.attribute_type === 'store')?.value || '';
    const rating = parseInt(item.attributes.find(attr => attr.attribute_type === 'rating')?.value || '0');
    
    setFormData({
      photos: [],
      name: item.name,
      description,
      status: item.status?.name || '',
      statusId: item.status?.id,
      purchaseDate,
      store,
      rating,
      category: item.category?.name || '',
      subcategory: '',
      categoryId: item.category?.id,
      tags: item.tags?.map(tag => tag.name) || ['Новое'],
      existingImages: item.images?.map(img => img.file_path) || [],
      imagesToDelete: [],
    });
  };

  return (
    <EditFormContext.Provider value={{ formData, updateFormData, setInitialData }}>
      {children}
    </EditFormContext.Provider>
  );
};

export const useEditFormData = () => {
  const context = useContext(EditFormContext);
  if (!context) {
    throw new Error('useEditFormData must be used within EditFormProvider');
  }
  return context;
};

export default function EditItemLayout() {
  return (
    <EditFormProvider>
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}>
        <Stack.Screen name="index" options={{ title: 'Редактировать вещь' }} />
        <Stack.Screen name="details" options={{ title: 'Детали' }} />
        <Stack.Screen name="category" options={{ title: 'Категория' }} />
        <Stack.Screen name="tags" options={{ title: 'Теги' }} />
      </Stack>
    </EditFormProvider>
  );
}
