import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Tag, TagProps } from '../../components/Tag';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { TagDAO, initDatabase } from '../../src/api/database';
import { addItemStyles } from '../../styles/AddItem.styles';
import { commonScreenStyles } from '../../styles/CommonScreen.styles';
import { useEditFormData } from './_layout';

export default function EditTagsScreen() {
  const { formData, updateFormData } = useEditFormData();
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
      
      // Sort: "Новое" first, then by creation date (newest first)
      const sortedTags = tagsResult.sort((a, b) => {
        if (a.name === 'Новое') return -1;
        if (b.name === 'Новое') return 1;
        return b.id - a.id; // Newest first for other tags
      });
      
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
    // Don't allow removal of 'Новое' tag
    if (tagName === 'Новое') {
      return;
    }
    updateFormData({ tags: formData.tags.filter(t => t !== tagName) });
  };

  const isTagSelected = (tagName: string) => {
    return formData.tags.includes(tagName);
  };

  const handleSave = async () => {
    try {
      // TODO: Implement full save functionality for editing
      Alert.alert(
        'Сохранить изменения',
        'Сохранить все изменения и вернуться к детали?',
        [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Сохранить', 
            onPress: async () => {
              // Here we need to:
              // 1. Update item basic info
              // 2. Update attributes
              // 3. Update tags
              // 4. Handle images
              // 5. Navigate back to item detail
              console.log('Saving item...');
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
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
        <TouchableOpacity onPress={handleSave} style={{ padding: 8, backgroundColor: '#000', borderRadius: 6 }}>
          <ThemedText style={{ color: '#fff', fontSize: 14 }}>Сохранить</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedView style={commonScreenStyles.section}>
        <View style={styles.sectionHeader}>
          {/* <ThemedText type="subtitle">Теги</ThemedText> */}
          <TouchableOpacity 
            style={styles.addTagButton} 
            onPress={() => setShowTagModal(true)}
          >
            <ThemedText style={styles.addTagButtonText}>+ Добавить</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.selectedTagsContainer}>
          <ThemedText style={styles.selectedTagsLabel}>Выбранные теги:</ThemedText>
          <View style={styles.tagsContainer}>
            {formData.tags.map((tagName) => {
              const tag = availableTags.find(t => t.name === tagName);
              return (
                <View key={tagName} style={styles.tagItem}>
                  {tag ? (
                    <Tag
                      id={tag.id}
                      name={tag.name}
                      color={tag.color}
                      disabled={tagName === 'Новое'}
                      isProtected={tagName === 'Новое'}
                    />
                  ) : (
                    <View style={styles.customTagItem}>
                      <ThemedText style={styles.customTagText}>{tagName}</ThemedText>
                    </View>
                  )}
                  {tagName !== 'Новое' && (
                    <TouchableOpacity 
                      onPress={() => removeTag(tagName)}
                      style={styles.removeButton}
                    >
                      <ThemedText style={styles.removeText}>✕</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
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
                    disabled={tag.name === 'Новое'}
                  >
                    <Tag
                      id={tag.id}
                      name={tag.name}
                      color={tag.color}
                      disabled={tag.name === 'Новое'}
                      isProtected={tag.name === 'Новое'}
                    />
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
    backgroundColor: '#f5f5f5',
  },
  checkmark: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});
