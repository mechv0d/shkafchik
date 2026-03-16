import StarRating from '@/components/StarRating';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { initDatabase, ItemStatusDAO } from '@/src/api/database';
import { addItemStyles } from '@/styles/AddItem.styles';
import { commonScreenStyles } from '@/styles/CommonScreen.styles';
import { capitalize } from '@/utils/capitalize';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useFormData } from './_layout';

export default function DetailsScreen() {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);
  const [error, setError] = useState('');

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
    router.push('./category');
  };

  const handleBack = () => {
    router.back();
  };

  const selectStatus = (status: any) => {
    updateFormData({ status: status.name });
    setShowStatusModal(false);
  };

  
  return (
    <ScrollView style={commonScreenStyles.container}>
      <View style={addItemStyles.header}>
        <TouchableOpacity onPress={handleBack} style={addItemStyles.backButton}>
          <ThemedText style={addItemStyles.backText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={addItemStyles.title}>Детали</ThemedText>
      </View>

      <ThemedView style={commonScreenStyles.section}>
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
        <TextInput
          style={commonScreenStyles.input}
          placeholder="YYYY-MM-DD"
          value={formData.purchaseDate}
          onChangeText={(text) => updateFormData({ purchaseDate: text })}
        />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // No local styles needed - all moved to addItemStyles
});
