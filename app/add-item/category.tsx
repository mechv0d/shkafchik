import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useFormData } from './_layout';

const categories = {
  'Одежда': ['Верхняя одежда', 'Футболки', 'Джинсы', 'Платья'],
  'Обувь': ['Кроссовки', 'Ботинки', 'Туфли', 'Сандалии'],
  'Аксессуары': ['Сумки', 'Шапки', 'Очки', 'Ювелирка'],
};

export default function CategoryScreen() {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState('');

  const toggleExpand = (category: string) => {
    setExpanded(expanded === category ? null : category);
  };

  const selectSubcategory = (category: string, subcategory: string) => {
    updateFormData({ category, subcategory });
    setExpanded(null);
  };

  const handleNext = () => {
    if (!formData.category || !formData.subcategory) {
      setError('Выбор категории обязателен');
      return;
    }
    setError('');
    router.push('./tags');
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

      <ThemedView style={styles.categoryContainer}>
        <ThemedText type="subtitle">Выберите категорию</ThemedText>
        {Object.keys(categories).map((category) => (
          <View key={category}>
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => toggleExpand(category)}
            >
              <ThemedText style={styles.categoryText}>
                {category} {expanded === category ? '▼' : '▶'}
              </ThemedText>
            </TouchableOpacity>
            {expanded === category && (
              <View style={styles.subcategoryContainer}>
                {categories[category as keyof typeof categories].map((sub) => (
                  <TouchableOpacity
                    key={sub}
                    style={[
                      styles.subcategoryItem,
                      formData.category === category && formData.subcategory === sub && styles.selected,
                    ]}
                    onPress={() => selectSubcategory(category, sub)}
                  >
                    <ThemedText>{sub}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
  categoryContainer: {
    marginBottom: 24,
  },
  categoryItem: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  subcategoryContainer: {
    marginLeft: 16,
    marginBottom: 8,
  },
  subcategoryItem: {
    padding: 8,
    backgroundColor: '#e9e9e9',
    borderRadius: 6,
    marginBottom: 4,
  },
  selected: {
    backgroundColor: '#007AFF',
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
