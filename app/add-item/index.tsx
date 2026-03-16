import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, BackHandler, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import TrashIcon from '../../components/ui/icons/TrashIcon';
import { Colors } from '../../constants/theme';
import { captureFromCamera, pickFromGallery, ProcessedImage } from '../../src/api/imageProcessor';
import { commonScreenStyles } from '../../styles/CommonScreen.styles';
import { useFormData } from './_layout';

export default function AddItemScreen() {
  const { formData, updateFormData } = useFormData();
  // const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

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

  const handleBack = () => {
    router.push('/items');
  };

  const handleNext = () => {
    router.push('/add-item/name');
  };

  return (
    <ThemedView style={[commonScreenStyles.container]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: '#ffffff' }}>
      <ThemedView style={commonScreenStyles.header}>
        <TouchableOpacity style={{ paddingVertical: 5 }} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText type="title">Новая вещь</ThemedText>
      </ThemedView>

      <ThemedView style={commonScreenStyles.section}>
        <ThemedView style={{ gap: 12 }}>
          <TouchableOpacity style={commonScreenStyles.button} onPress={handleCaptureFromCamera}>
            <ThemedText style={commonScreenStyles.buttonText}>Сфотографировать</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={commonScreenStyles.buttonSecondary} onPress={handlePickFromGallery}>
            <ThemedText style={commonScreenStyles.buttonSecondaryText}>Выбрать из галереи</ThemedText>
          </TouchableOpacity>
          
          {formData.photos.length > 0 && (
            <TouchableOpacity style={commonScreenStyles.buttonSecondary} onPress={resetPhotos}>
              <ThemedText style={commonScreenStyles.buttonSecondaryText}>Сбросить все фото</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>

      {formData.photos.length > 0 && (
        <ThemedView style={commonScreenStyles.section}>
          <ThemedText type="subtitle" style={{ marginBottom: 8 }}>Изображения ({formData.photos.length})</ThemedText>
          {formData.photos.map((image: ProcessedImage, index: number) => (
            <ThemedView key={index} style={commonScreenStyles.card}>
              <ThemedView style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
              }}>
                <Image 
                  source={{ uri: image.uri }} 
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    backgroundColor: '#f8f9fa',
                  }} 
                />
                <ThemedText style={commonScreenStyles.cardTitle}>Фото {index + 1}</ThemedText>
                <TouchableOpacity style={commonScreenStyles.button} onPress={() => removeImage(index)}>
                  <ThemedText style={commonScreenStyles.buttonText}><TrashIcon color={'#fff'}/></ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      <ThemedView style={{ marginTop: 'auto', paddingTop: 24 }}>
        <TouchableOpacity 
          style={[
            commonScreenStyles.button, 
            { 
              backgroundColor: formData.photos.length > 0 ? '#000000ff' : '#8E8E93',
            }
          ]} 
          onPress={handleNext}
          disabled={formData.photos.length === 0}
        >
          <ThemedText style={commonScreenStyles.buttonText}>
            Далее
          </ThemedText>
        </TouchableOpacity>
        
        {formData.photos.length === 0 && (
          <ThemedText style={{
            textAlign: 'center',
            fontSize: 14,
            opacity: 0.6,
            marginTop: 8,
          }}>
            Добавьте хотя бы одно фото, чтобы продолжить
          </ThemedText>
        )}
      </ThemedView>
    </ScrollView>
    </ThemedView>
  );
}


