import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { CategoryDAO, initDatabase } from '../../src/api/database';
import { Category } from '../../src/models';
import { addItemStyles } from '../../styles/AddItem.styles';
import { commonScreenStyles } from '../../styles/CommonScreen.styles';
import { useFormData } from './_layout';

export default function CategoryScreen() {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      await initDatabase();
      const hierarchy = await CategoryDAO.getHierarchy();
      setCategories(hierarchy);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError('Не удалось загрузить категории');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId: number) => {
    setExpanded(expanded === categoryId ? null : categoryId);
  };

  const selectCategory = async (category: Category) => {
    try {
      const fullPath = await CategoryDAO.getCategoryPath(category.id);
      updateFormData({ 
        categoryId: category.id,
        category: fullPath,
        subcategory: category.name 
      });
      setExpanded(null);
    } catch (error) {
      console.error('Failed to get category path:', error);
      // Fallback to simple name if path fails
      updateFormData({ 
        categoryId: category.id,
        category: category.name,
        subcategory: category.name 
      });
      setExpanded(null);
    }
  };

  const selectSubcategory = async (parent: Category, subcategory: Category) => {
    try {
      const fullPath = await CategoryDAO.getCategoryPath(subcategory.id);
      updateFormData({ 
        categoryId: subcategory.id,
        category: fullPath,
        subcategory: subcategory.name 
      });
      setExpanded(null);
    } catch (error) {
      console.error('Failed to get category path:', error);
      // Fallback to manual path construction
      updateFormData({ 
        categoryId: subcategory.id,
        category: `${parent.name} → ${subcategory.name}`,
        subcategory: subcategory.name 
      });
      setExpanded(null);
    }
  };

  const handleNext = () => {
    if (!formData.categoryId) {
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
    <ScrollView style={commonScreenStyles.container}>
      <View style={addItemStyles.header}>
        <TouchableOpacity onPress={handleBack} style={addItemStyles.backButton}>
          <ThemedText style={addItemStyles.backText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={addItemStyles.title}>Категория</ThemedText>
      </View>

      {error ? (
        <ThemedView style={addItemStyles.errorContainer}>
          <ThemedText style={addItemStyles.errorText}>{error}</ThemedText>
        </ThemedView>
      ) : null}

      {loading ? (
        <ThemedView style={commonScreenStyles.section}>
          <ThemedText>Загрузка категорий...</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={commonScreenStyles.section}>
          <ThemedText type="subtitle">Выберите категорию</ThemedText>
          {formData.category && (
            <ThemedView style={styles.selectedPathContainer}>
              {/* <ThemedText style={styles.selectedPathLabel}>Выбранная категория:</ThemedText> */}
              <ThemedText style={styles.selectedPathText}>{formData.category}</ThemedText>
            </ThemedView>
          )}
          {categories.map((category) => (
            <View key={category.id}>
              <View style={styles.categoryHeader}>
                <TouchableOpacity
                  style={styles.categoryExpandButton}
                  onPress={() => toggleExpand(category.id)}
                >
                  <ThemedText style={styles.categoryText}>
                    {category.name} {expanded === category.id ? '▼' : '▶'}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    formData.categoryId === category.id && styles.parentCategorySelected
                  ]}
                  onPress={() => selectCategory(category)}
                >
                  <ThemedText style={[
                    styles.selectButtonText,
                    formData.categoryId === category.id && styles.parentCategorySelectedText
                  ]}>
                    {formData.categoryId === category.id ? 'Выбрано' : 'Выбрать'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {expanded === category.id && category.children && category.children.length > 0 && (
                <View style={styles.subcategoryContainer}>
                  {category.children.map((sub) => (
                    <TouchableOpacity
                      key={sub.id}
                      style={[
                        styles.subcategoryItem,
                        formData.categoryId === sub.id && styles.selected,
                      ]}
                      onPress={() => selectSubcategory(category, sub)}
                    >
                      <ThemedText>{sub.name}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ThemedView>
      )}

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

const styles = StyleSheet.create({
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryHeader: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryExpandButton: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButton: {
    borderColor: '#000000ff',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  selectButtonText: {
    color: '#000000ff',
    fontSize: 12,
    fontWeight: '500',
  },
  subcategoryContainer: {
    marginLeft: 16,
    marginTop: 8,
  },
  subcategoryItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  selected: {
    borderWidth: 1,
    borderColor: '#000000ff',
  },
  parentCategorySelected: {
    backgroundColor: '#000',
  },
  parentCategorySelectedText: {
    color: '#fff',
  },
  nextContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  selectedPathContainer: {
    backgroundColor: '#ffffffff',
    padding: 8,
    borderRadius: 8,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderLeftColor: '#000000ff',
  },
  selectedPathLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  selectedPathText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000ff',
  },
});
