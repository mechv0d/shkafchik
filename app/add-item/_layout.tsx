import { ProcessedImage } from '@/src/api/imageProcessor';
import { Stack } from 'expo-router/stack';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface FormData {
  photos: ProcessedImage[];
  name: string;
  description: string;
  status: string;
  purchaseDate: string;
  store: string;
  rating: number;
  category: string;
  subcategory: string;
  categoryId?: number;
  tags: string[];
}

const defaultFormData: FormData = {
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
};

const FormContext = createContext<{
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
} | null>(null);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormData must be used within FormProvider');
  }
  return context;
};

export default function AddItemLayout() {
  return (
    <FormProvider>
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}>
        <Stack.Screen name="index" options={{ title: 'Добавить вещь' }} />
        <Stack.Screen name="name" options={{ title: 'Название' }} />
        <Stack.Screen name="category" options={{ title: 'Категория' }} />
        <Stack.Screen name="details" options={{ title: 'Детали' }} />
        <Stack.Screen name="tags" options={{ title: 'Теги' }} />
      </Stack>
    </FormProvider>
  );
}
