import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { captureFromCamera, pickFromGallery, ProcessedImage } from '../../src/api/imageProcessor';
import { useFormData } from './_layout';

export default function AddItemScreen() {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();

  const handleCaptureFromCamera = async () => {
    try {
      const image = await captureFromCamera();
      if (image) {
        updateFormData({ photos: [...formData.photos, image] });
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to capture image');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const image = await pickFromGallery();
      if (image) {
        updateFormData({ photos: [...formData.photos, image] });
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to pick image');
    }
  };

  const removeImage = (index: number) => {
    updateFormData({ photos: formData.photos.filter((_: ProcessedImage, i: number) => i !== index) });
  };

  const resetPhotos = () => {
    Alert.alert(
      'Сбросить фото',
      'Вы уверены, что хотите удалить все фото?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Сбросить', onPress: () => updateFormData({ photos: [] }) },
      ]
    );
  };

  const handleNext = () => {
    router.push('/add-item/name');
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        {/* <ThemedText type="title">Добавить вещь</ThemedText> */}
        <ThemedText>Сфотографируйте или выберите изображение вещи</ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCaptureFromCamera}>
          <ThemedText>📷 Сфотографировать</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePickFromGallery}>
          <ThemedText>📁 Выбрать из галереи</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF3B30' }]} onPress={resetPhotos}>
          <ThemedText>🗑️ Сбросить все фото</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.imagesContainer}>
        <ThemedText type="subtitle">Изображения ({formData.photos.length})</ThemedText>
        {formData.photos.map((image: ProcessedImage, index: number) => (
          <View key={index} style={styles.imageItem}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <ThemedText>Фото {index + 1}</ThemedText>
            <TouchableOpacity style={styles.deleteButton} onPress={() => removeImage(index)}>
              <ThemedText>🗑️</ThemedText>
            </TouchableOpacity>
          </View>
        ))}
      </ThemedView>

      <ThemedView style={styles.nextContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <ThemedText>Далее</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 4,
  },
  imagesContainer: {
    marginBottom: 24,
  },
  imageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  deleteButton: {
    marginLeft: 'auto',
    padding: 8,
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
});
