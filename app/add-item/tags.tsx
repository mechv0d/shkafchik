import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Tag, TagProps } from '../../components/Tag';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { AttributeDAO, CategoryDAO, ImageDAO, initDatabase, ItemDAO, ItemStatusDAO, ItemTagDAO, TagDAO } from '../../src/api/database';
import { saveImageToAppDirectory } from '../../src/api/imageProcessor';
import { addItemStyles } from '../../styles/AddItem.styles';
import { commonScreenStyles } from '../../styles/CommonScreen.styles';
import { useFormData } from './_layout';

export default function TagsScreen() {
  const { formData, updateFormData } = useFormData();
  const [availableTags, setAvailableTags] = useState<TagProps[]>([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      await initDatabase();
      const tagsResult = await TagDAO.getAll();
      const sortedTags = tagsResult.sort((a, b) => b.id - a.id);
      setAvailableTags(sortedTags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const addTag = (tag: TagProps) => {
    if (!formData.tags.includes(tag.name)) {
      updateFormData({ tags: [...formData.tags, tag.name] });
    }
  };

  const removeTag = (tagName: string) => {
    updateFormData({ tags: formData.tags.filter(t => t !== tagName) });
  };

  const selectedTags = formData.tags.filter((t) => t.trim());

  const isTagSelected = (tagName: string) => {
    return formData.tags.includes(tagName);
  };

  const handleSave = async () => {
    try {
      await initDatabase();
      
      // Get category from form data
      let category;
      if (formData.categoryId) {
        category = await CategoryDAO.getById(formData.categoryId);
      } else {
        const subName = formData.subcategory?.trim();
        if (!subName) {
          throw new Error('Category is required');
        }
        category = await CategoryDAO.getByName(subName);
        if (!category) {
          const catId = await CategoryDAO.create({ name: subName });
          category = await CategoryDAO.getById(catId);
        }
      }
      if (!category) throw new Error('Failed to create or find category');

      // Map status
      let status = await ItemStatusDAO.getByName(formData.status.toLowerCase());
      if (!status) {
        status = await ItemStatusDAO.getFirst(); // fallback
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
        // { type: 'price', value: formData.price.toString() },
        { type: 'purchaseDate', value: formData.purchaseDate },
        { type: 'store', value: formData.store },
        { type: 'rating', value: formData.rating.toString() },
        { type: 'mainCategory', value: formData.category },
      ];
      for (const attr of attributes) {
        if (attr.value && attr.value !== '0') {
          console.log('Creating attribute:', attr);
          console.log('Item ID:', itemId);
          console.log('Attribute type:', attr.type);
          console.log('Attribute value:', attr.value);
          await AttributeDAO.create({
            item_id: itemId,
            attribute_type: attr.type,
            value: attr.value
          });
        }
      }

      // Insert tags
      for (const tagName of selectedTags) {
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
        { text: 'OK', onPress: () => router.replace('/(tabs)/items') },
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
    <ScrollView style={commonScreenStyles.container}>
      <View style={addItemStyles.header}>
        <TouchableOpacity onPress={handleBack} style={addItemStyles.backButton}>
          <ThemedText style={addItemStyles.backText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={addItemStyles.title}>Теги</ThemedText>
      </View>

      <ThemedView style={commonScreenStyles.section}>
        <View style={styles.sectionHeader}>
          {/* <ThemedText type="subtitle">Теги</ThemedText> */}
          <TouchableOpacity 
            style={styles.addTagButton} 
            onPress={() => setShowTagModal(true)}
          >
            <ThemedText style={styles.addTagButtonText}>+ Добавить тег</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.selectedTagsContainer}>
          {/* <ThemedText style={styles.selectedTagsLabel}>Выбранные теги:</ThemedText> */}
          {selectedTags.length === 0 ? (
            <ThemedText style={styles.emptyTagsText}>
              У вещи нет выбранных тегов
            </ThemedText>
          ) : (
            <View style={styles.tagsContainer}>
              {selectedTags.map((tagName) => {
                const tag = availableTags.find(t => t.name === tagName);
                return (
                  <View key={tagName} style={styles.tagItem}>
                    {tag ? (
                      <Tag id={tag.id} name={tag.name} color={tag.color} />
                    ) : (
                      <View style={styles.customTagItem}>
                        <ThemedText style={styles.customTagText}>{tagName}</ThemedText>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => removeTag(tagName)}
                      style={styles.removeButton}
                    >
                      <ThemedText style={styles.removeText}>✕</ThemedText>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ThemedView>

      <ThemedView style={addItemStyles.nextContainer}>
        <TouchableOpacity style={commonScreenStyles.button} onPress={handleSave}>
          <ThemedText style={commonScreenStyles.buttonText}>Сохранить</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Tag Selection Modal */}
      <Modal
        visible={showTagModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTagModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">Выберите теги</ThemedText>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowTagModal(false)}
              >
                <ThemedText style={styles.closeButtonText}>✕</ThemedText>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.tagsList} showsVerticalScrollIndicator={false}>
              {availableTags.map((tag) => {
                const selected = isTagSelected(tag.name);
                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={[
                      styles.tagSelectItem,
                      selected && styles.tagSelectItemSelected
                    ]}
                    onPress={() => {
                      if (selected) {
                        removeTag(tag.name);
                      } else {
                        addTag(tag);
                      }
                    }}
                  >
                    <Tag id={tag.id} name={tag.name} color={tag.color} />
                    {selected && (
                      <ThemedText style={styles.checkmark}>✓</ThemedText>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addTagButton: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addTagButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedTagsContainer: {
    marginBottom: 16,
  },
  selectedTagsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#666',
  },
  emptyTagsText: {
    fontSize: 14,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  customTagItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  customTagText: {
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    marginLeft: 4,
  },
  removeText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  tagsList: {
    padding: 16,
  },
  tagSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  tagSelectItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  checkmark: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
