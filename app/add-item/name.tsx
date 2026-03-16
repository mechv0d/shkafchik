import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { addItemStyles } from '../../styles/AddItem.styles';
import { commonScreenStyles } from '../../styles/CommonScreen.styles';
import { useFormData } from './_layout';

export default function NameScreen() {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!formData.name.trim()) {
      setError('Наименование обязательно для заполнения');
      return;
    }
    setError('');
    router.push('./details');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView style={commonScreenStyles.container}>
      <View style={addItemStyles.header}>
        <TouchableOpacity onPress={handleBack} style={addItemStyles.backButton}>
          <ThemedText style={addItemStyles.backText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={addItemStyles.title}>Название</ThemedText>
      </View>

      {error ? (
        <ThemedView style={addItemStyles.errorContainer}>
          <ThemedText style={addItemStyles.errorText}>{error}</ThemedText>
        </ThemedView>
      ) : null}

      <ThemedView style={commonScreenStyles.section}>
        <ThemedText type="subtitle">Наименование *</ThemedText>
        <TextInput
          style={commonScreenStyles.input}
          placeholder="Введите название вещи"
          value={formData.name}
          onChangeText={(text) => updateFormData({ name: text })}
        />

        <ThemedText type="subtitle">Описание</ThemedText>
        <TextInput
          style={[commonScreenStyles.input, addItemStyles.textarea]}
          placeholder="Введите описание вещи"
          value={formData.description}
          onChangeText={(text) => updateFormData({ description: text })}
          multiline
          numberOfLines={4}
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


