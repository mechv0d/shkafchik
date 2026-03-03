import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useFormData } from './_layout';

const statusOptions = ['Куплено', 'В корзине'];

export default function DetailsScreen() {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleNext = () => {
    router.push('./category');
  };

  const handleBack = () => {
    router.back();
  };

  const selectStatus = (status: string) => {
    updateFormData({ status: status as 'Куплено' | 'В корзине' });
    setShowStatusModal(false);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => updateFormData({ rating: i })}
          style={styles.star}
        >
          <ThemedText style={[styles.starText, formData.rating >= i && styles.starSelected]}>
            ⭐
          </ThemedText>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={styles.backText}>← Назад</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Добавить вещь</ThemedText>
      </View>

      <ThemedView style={styles.formContainer}>
        <ThemedText type="subtitle">Статус</ThemedText>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setShowStatusModal(true)}
        >
          <ThemedText>{formData.status}</ThemedText>
        </TouchableOpacity>

        <ThemedText type="subtitle">Цена</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={formData.price.toString()}
          onChangeText={(text) => updateFormData({ price: parseFloat(text) || 0 })}
          keyboardType="numeric"
        />

        <ThemedText type="subtitle">Дата покупки</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={formData.purchaseDate}
          onChangeText={(text) => updateFormData({ purchaseDate: text })}
        />

        <ThemedText type="subtitle">Магазин</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Название магазина"
          value={formData.store}
          onChangeText={(text) => updateFormData({ store: text })}
        />

        <ThemedText type="subtitle">Оценка</ThemedText>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
      </ThemedView>

      <ThemedView style={styles.nextContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <ThemedText>Далее</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <Modal visible={showStatusModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText type="subtitle">Выберите статус</ThemedText>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => selectStatus(option)}
              >
                <ThemedText>{option}</ThemedText>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
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
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    flex: 1,
  },
  formContainer: {
    marginBottom: 24,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  star: {
    marginRight: 8,
  },
  starText: {
    fontSize: 24,
    color: '#ccc',
  },
  starSelected: {
    color: '#FFD700',
  },
  nextContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  nextButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalCancel: {
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
});
