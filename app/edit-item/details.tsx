import StarRating from '@/components/StarRating';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AttributeDAO, initDatabase, ItemDAO, ItemStatusDAO, ItemTagDAO, TagDAO } from '@/src/api/database';
import { addItemStyles } from '@/styles/AddItem.styles';
import { commonScreenStyles } from '@/styles/CommonScreen.styles';
import { capitalize } from '@/utils/capitalize';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from '../../components/DatePicker';
import { useEditFormData } from './_layout';
import { useLocalSearchParams } from 'expo-router';

export default function EditDetailsScreen() {
  const { formData, updateFormData } = useEditFormData();
  const router = useRouter();
  // Временно захардкожим для теста - замените на реальный id вещи
  // const id = '1'; // TODO: Получить реальный id из параметров маршрута
  const { id } = useLocalSearchParams();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async (retryCount = 0) => {  
    const maxRetries = 2;
    
    try {
      console.log('Loading statuses...' + (retryCount > 0 ? ` (retry ${retryCount})` : ''));
      const db = await initDatabase();
      console.log('Database initialized successfully');
      const statuses = await ItemStatusDAO.getAll();
      console.log('Statuses loaded:', statuses.length);
      // capitalize statuses
      const capStatuses = statuses.map((status) => ({
        ...status,
        name: capitalize(status.name),
      }));
      setStatusOptions(capStatuses);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to load statuses:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error details:', errorMessage);
      
      // Retry if it's a connection issue and we haven't exceeded max retries
      if (retryCount < maxRetries && errorMessage.includes('NullPointerException')) {
        console.log(`Retrying in 500ms... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => loadStatuses(retryCount + 1), 500);
        return;
      }
      
      setError('Failed to load statuses: ' + errorMessage);
    }
  };

  const handleNext = () => {
    if (!formData.status) {
      setError('Выберите статус вещи');
      return;
    }
    setError('');
    router.push(`./category?id=${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const selectStatus = (status: any) => {
    updateFormData({ 
      status: status.name,
      statusId: status.id
    });
    setShowStatusModal(false);
  };

  const handleDateSelect = (dateString: string) => {
    updateFormData({ purchaseDate: dateString });
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      await initDatabase();
      
      const itemId = parseInt(id as string);
      console.log('Attempting to save item with ID:', itemId);
      
      // Проверяем, существует ли вещь
      const existingItem = await ItemDAO.getById(itemId);
      if (!existingItem) {
        console.log('Item not found with ID:', itemId);
        Alert.alert('Ошибка', `Вещь с ID ${itemId} не найдена`);
        return;
      }
      
      console.log('Found item:', existingItem);
      
      // 1. Обновляем базовую информацию вещи
      await ItemDAO.update(itemId, {
        name: formData.name,
        category_id: formData.categoryId || undefined,
        status_id: formData.statusId || undefined
      });
      
      // 2. Обновляем атрибуты - удаляем старые и создаем новые
      await AttributeDAO.deleteByItemId(itemId);
      
      const attributes = [
        { type: 'description', value: formData.description },
        { type: 'purchase_date', value: formData.purchaseDate },
        { type: 'store', value: formData.store },
        { type: 'rating', value: formData.rating.toString() },
      ];
      
      for (const attr of attributes) {
        if (attr.value && attr.value !== '0') {
          await AttributeDAO.create({
            item_id: itemId,
            attribute_type: attr.type,
            value: attr.value
          });
        }
      }
      
      // 3. Обновляем теги - удаляем старые и добавляем новые
      const existingTagIds = await ItemTagDAO.getItemTags(itemId);
      for (const tagId of existingTagIds) {
        await ItemTagDAO.removeTagFromItem(itemId, tagId);
      }
      
      for (const tagName of formData.tags) {
        const allTags = await TagDAO.getAll();
        let tag = allTags.find(t => t.name === tagName);
        if (!tag) {
          const tagId = await TagDAO.create({ name: tagName });
          tag = { id: tagId, name: tagName };
        }
        
        await ItemTagDAO.addTagToItem(itemId, tag.id);
      }
      
      // 4. Обрабатываем изображения (если есть)
      if (formData.imagesToDelete.length > 0) {
        // Удаляем отмеченные изображения
        for (const imagePath of formData.imagesToDelete) {
          // TODO: Реализовать удаление изображений
          console.log('Should delete image:', imagePath);
        }
      }
      
      Alert.alert('Успех', 'Изменения сохранены', [
        { text: 'OK', onPress: () => router.replace(`/item/${id}`) }
      ]);
      
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <ScrollView style={commonScreenStyles.container}>
      <View style={addItemStyles.header}>
        <TouchableOpacity onPress={handleBack} style={addItemStyles.backButton}>
          <ThemedText style={addItemStyles.backText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={addItemStyles.title}>Детали</ThemedText>
        <TouchableOpacity onPress={handleSave} style={{ padding: 8, backgroundColor: isSaving ? '#666' : '#000', borderRadius: 6 }} disabled={isSaving}>
          <ThemedText style={{ color: '#fff', fontSize: 14 }}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedView style={commonScreenStyles.section}>
        {/* <ThemedText style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
          Отладка: редактирование вещи ID: {id}
        </ThemedText> */}
        
        {error ? (
          <View style={addItemStyles.errorContainerAlt}>
            <ThemedText style={addItemStyles.errorTextAlt}>{error}</ThemedText>
          </View>
        ) : null}
        
        <ThemedText type="subtitle">Статус</ThemedText>
        <TouchableOpacity
          style={addItemStyles.picker}
          onPress={() => setShowStatusModal(true)}
        >
          <ThemedText>{formData.status}</ThemedText>
        </TouchableOpacity>

        <ThemedText type="subtitle">Дата покупки</ThemedText>
        <TouchableOpacity
          style={commonScreenStyles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <ThemedText style={{ color: formData.purchaseDate ? '#000' : '#999' }}>
            {formData.purchaseDate || 'Выберите дату'}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText type="subtitle">Магазин</ThemedText>
        <TextInput
          style={commonScreenStyles.input}
          placeholder="Название магазина"
          value={formData.store}
          onChangeText={(text) => updateFormData({ store: text })}
        />

        <ThemedText type="subtitle">Оценка</ThemedText>
        <StarRating 
          rating={formData.rating || 0} 
          onRatingChange={(rating) => updateFormData({ rating })} 
          useThemedText={true}
        />
      </ThemedView>

      <ThemedView style={addItemStyles.nextContainer}>
        <TouchableOpacity style={commonScreenStyles.button} onPress={handleNext}>
           <ThemedText style={commonScreenStyles.buttonText}>
                      Далее
                    </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <Modal visible={showStatusModal} transparent animationType="slide">
        <View style={addItemStyles.modalContainer}>
          <View style={addItemStyles.modalContent}>
            <ThemedText type="subtitle">Выберите статус</ThemedText>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={addItemStyles.modalOption}
                onPress={() => selectStatus(option)}
              >
                <ThemedText>{option.name}</ThemedText>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={addItemStyles.modalCancel}
              onPress={() => setShowStatusModal(false)}
            >
              <ThemedText>Отмена</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DatePicker
        visible={showDatePicker}
        currentDate={formData.purchaseDate}
        onDateSelect={handleDateSelect}
        onClose={() => setShowDatePicker(false)}
      />
    </ScrollView>
  );
}
