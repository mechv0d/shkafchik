import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { AttributeDAO, CategoryDAO, ColorDAO, ImageDAO, initDatabase, ItemDAO, ItemStatusDAO, ItemTagDAO, TagDAO } from '../../src/api/database';
import { saveImageToAppDirectory } from '../../src/api/imageProcessor';
import { useFormData } from './_layout';

export default function TagsScreen() {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();
  const [newTag, setNewTag] = useState('');

  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);

  useEffect(() => {
    loadTagsAndColors();
  }, []);

  const loadTagsAndColors = async () => {
    try {
      await initDatabase();
      const tagsResult = await TagDAO.getAll();
      const colorsResult = await ColorDAO.getAll();
      setAvailableTags(tagsResult);
      setColors(colorsResult);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData({ tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    updateFormData({ tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSave = async () => {
    try {
      await initDatabase();
      
      // Find or create category
      let category = await CategoryDAO.getByName(formData.subcategory);
      if (!category) {
        const catId = await CategoryDAO.create({ name: formData.subcategory });
        category = await CategoryDAO.getById(catId);
      }
      if (!category) throw new Error('Failed to create or find category');

      // Map status
      let statusName = formData.status === 'Куплено' ? 'в использовании' : 'на хранении';
      let status = await ItemStatusDAO.getByName(statusName);
      if (!status) {
        status = await ItemStatusDAO.getById(1); // fallback
      }
      if (!status) throw new Error('Failed to find status');

      const itemId = await ItemDAO.create({
        name: formData.name,
        category_id: category.id,
        status_id: status.id
      });

      // Insert images
      for (let i = 0; i < formData.photos.length; i++) {
        const photo = formData.photos[i];
        const path = await saveImageToAppDirectory(photo.uri, itemId, i);
        await ImageDAO.create({
          item_id: itemId,
          file_path: path,
          display_order: i
        });
      }

      // Insert attributes
      const attributes = [
        { type: 'description', value: formData.description },
        { type: 'price', value: formData.price.toString() },
        { type: 'purchaseDate', value: formData.purchaseDate },
        { type: 'store', value: formData.store },
        { type: 'rating', value: formData.rating.toString() },
        { type: 'mainCategory', value: formData.category },
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

      // Insert tags
      for (const tagName of formData.tags) {
        // Find existing tag or create new one
        let tag = availableTags.find(t => t.name === tagName);
        if (!tag) {
          const tagId = await TagDAO.create({ name: tagName });
          tag = { id: tagId, name: tagName };
        }
        
        // Link tag to item
        await ItemTagDAO.addTagToItem(itemId, tag.id);
      }

      Alert.alert('Успех', 'Вещь добавлена!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось сохранить вещь');
    }
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

      <ThemedView style={styles.formContainer}>
        <ThemedText type="subtitle">Теги</ThemedText>
        <View style={styles.addTagContainer}>
          <TextInput
            style={styles.input}
            placeholder="Новый тег"
            value={newTag}
            onChangeText={setNewTag}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTag}>
            <ThemedText>Добавить</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.tagsContainer}>
          {formData.tags.map((tag) => (
            <View key={tag} style={styles.tagItem}>
              <ThemedText>{tag}</ThemedText>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <ThemedText style={styles.removeText}>✕</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.nextContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleSave}>
          <ThemedText>Сохранить</ThemedText>
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
  formContainer: {
    marginBottom: 24,
  },
  addTagContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  removeText: {
    marginLeft: 8,
    color: '#FF3B30',
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
