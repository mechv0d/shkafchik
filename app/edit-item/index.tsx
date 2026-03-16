import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { addItemStyles } from '@/styles/AddItem.styles';
import { commonScreenStyles } from '@/styles/CommonScreen.styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useEditFormData } from './_layout';

export default function EditItemScreen() {
  const { formData, setInitialData, updateFormData } = useEditFormData();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      console.log('Loading item for editing:', id);
      
      const { ItemDAO, initDatabase } = await import('@/src/api/database');
      await initDatabase();
      
      const item = await ItemDAO.getWithDetails(parseInt(id as string));
      if (item) {
        setInitialData(item);
      } else {
        Alert.alert('Ошибка', 'Вещь не найдена');
        router.back();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading item:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные вещи');
      router.back();
    }
  };

  const handleDetails = () => {
    if (!formData.name.trim()) {
      Alert.alert('Ошибка', 'Введите название вещи');
      return;
    }
    router.push(`/edit-item/details?id=${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <ScrollView style={commonScreenStyles.container}>
        <ThemedText>Загрузка...</ThemedText>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={commonScreenStyles.container}>
      <View style={addItemStyles.header}>
        <TouchableOpacity onPress={handleBack} style={addItemStyles.backButton}>
          <ThemedText style={addItemStyles.backText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={addItemStyles.title}>Редактировать вещь</ThemedText>
      </View>

      <ThemedView style={commonScreenStyles.section}>
        <ThemedText type="subtitle">Название</ThemedText>
        <TextInput
          style={commonScreenStyles.input}
          placeholder="Название вещи"
          value={formData.name}
          onChangeText={(text) => updateFormData({ name: text })}
        />

        <ThemedText type="subtitle">Описание</ThemedText>
        <TextInput
          style={[commonScreenStyles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Описание вещи"
          value={formData.description}
          onChangeText={(text) => updateFormData({ description: text })}
          multiline
          numberOfLines={4}
        />
      </ThemedView>

      <ThemedView style={addItemStyles.nextContainer}>
        <TouchableOpacity style={commonScreenStyles.button} onPress={handleDetails}>
           <ThemedText style={commonScreenStyles.buttonText}>
                      Далее
                    </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}
