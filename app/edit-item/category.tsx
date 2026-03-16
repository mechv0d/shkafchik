import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import CategorySelector from '../../components/CategorySelector';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { Category } from '../../src/models';
import { addItemStyles } from '../../styles/AddItem.styles';
import { commonScreenStyles } from '../../styles/CommonScreen.styles';
import { useEditFormData } from './_layout';

export default function EditCategoryScreen() {
  const { formData, updateFormData } = useEditFormData();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleCategorySelect = async (category: Category, fullPath: string) => {
    updateFormData({ 
      categoryId: category.id,
      category: fullPath,
      subcategory: category.name 
    });
  };

  const handleNext = () => {
    if (!formData.categoryId) {
      setError('Выберите категорию');
      return;
    }
    setError('');
    router.push('./tags');
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // Сохранение изменений и возврат к детали
    router.back();
  };

  return (
    <ScrollView style={commonScreenStyles.container}>
      <View style={addItemStyles.header}>
        <TouchableOpacity onPress={handleBack} style={addItemStyles.backButton}>
          <ThemedText style={addItemStyles.backText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={addItemStyles.title}>Категория</ThemedText>
        <TouchableOpacity onPress={handleSave} style={{ padding: 8, backgroundColor: '#000', borderRadius: 6 }}>
          <ThemedText style={{ color: '#fff', fontSize: 14 }}>Сохранить</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedView style={commonScreenStyles.section}>
        {error ? (
          <View style={addItemStyles.errorContainerAlt}>
            <ThemedText style={addItemStyles.errorTextAlt}>{error}</ThemedText>
          </View>
        ) : null}
        
        <ThemedText type="subtitle">Выберите категорию</ThemedText>
        <CategorySelector
          selectedCategoryId={formData.categoryId}
          onCategorySelect={handleCategorySelect}
          selectedPath={formData.category}
        />
      </ThemedView>

      <ThemedView style={addItemStyles.nextContainer}>
        <TouchableOpacity style={commonScreenStyles.button} onPress={handleNext}>
           <ThemedText style={commonScreenStyles.buttonText}>
                      Далее
                    </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}
