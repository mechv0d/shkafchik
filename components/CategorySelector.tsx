import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { CategoryDAO, initDatabase } from '../src/api/database';
import { Category } from '../src/models';

interface CategorySelectorProps {
  selectedCategoryId?: number;
  onCategorySelect: (category: Category, fullPath: string) => void;
  showSelectedPath?: boolean;
  selectedPath?: string;
}

export default function CategorySelector({ 
  selectedCategoryId, 
  onCategorySelect, 
  showSelectedPath = true,
  selectedPath 
}: CategorySelectorProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
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
      onCategorySelect(category, fullPath);
      setExpanded(null);
    } catch (error) {
      console.error('Failed to get category path:', error);
      // Fallback to simple name if path fails
      onCategorySelect(category, category.name);
      setExpanded(null);
    }
  };

  const selectSubcategory = async (parent: Category, subcategory: Category) => {
    try {
      const fullPath = await CategoryDAO.getCategoryPath(subcategory.id);
      onCategorySelect(subcategory, fullPath);
      setExpanded(null);
    } catch (error) {
      console.error('Failed to get category path:', error);
      // Fallback to manual path construction
      onCategorySelect(subcategory, `${parent.name} → ${subcategory.name}`);
      setExpanded(null);
    }
  };

  const renderCategory = (category: Category) => {
    const isExpanded = expanded === category.id;
    const isSelected = selectedCategoryId === category.id;

    return (
      <View key={category.id}>
        <View style={styles.categoryHeader}>
          <TouchableOpacity
            style={styles.categoryExpandButton}
            onPress={() => toggleExpand(category.id)}
          >
            <ThemedText style={styles.categoryText}>
              {category.name} {isExpanded ? '▼' : '▶'}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectButton,
              isSelected && styles.parentCategorySelected
            ]}
            onPress={() => selectCategory(category)}
          >
            <ThemedText style={[
              styles.selectButtonText,
              isSelected && styles.parentCategorySelectedText
            ]}>
              {isSelected ? 'Выбрано' : 'Выбрать'}
            </ThemedText>
          </TouchableOpacity>
        </View>
        {isExpanded && category.children && category.children.length > 0 && (
          <View style={styles.subcategoryContainer}>
            {category.children.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={[
                  styles.subcategoryItem,
                  selectedCategoryId === sub.id && styles.selected,
                ]}
                onPress={() => selectSubcategory(category, sub)}
              >
                <ThemedText>{sub.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return <ThemedText>Загрузка категорий...</ThemedText>;
  }

  return (
    <ThemedView>
      {showSelectedPath && selectedPath && (
        <ThemedView style={styles.selectedPathContainer}>
          <ThemedText style={styles.selectedPathText}>{selectedPath}</ThemedText>
        </ThemedView>
      )}
      {categories.map(renderCategory)}
    </ThemedView>
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
  selectedPathContainer: {
    backgroundColor: '#ffffffff',
    padding: 8,
    borderRadius: 8,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderLeftColor: '#000000ff',
  },
  selectedPathText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000ff',
  },
});
