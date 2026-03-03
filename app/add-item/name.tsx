import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={styles.backText}>← Назад</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Добавить вещь</ThemedText>
      </View>

      {error ? (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </ThemedView>
      ) : null}

      <ThemedView style={styles.formContainer}>
        <ThemedText type="subtitle">Наименование *</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Введите название вещи"
          value={formData.name}
          onChangeText={(text) => updateFormData({ name: text })}
        />

        <ThemedText type="subtitle">Описание</ThemedText>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Введите описание вещи"
          value={formData.description}
          onChangeText={(text) => updateFormData({ description: text })}
          multiline
          numberOfLines={4}
        />
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
  errorContainer: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
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
