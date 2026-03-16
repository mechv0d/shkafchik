import { ItemsGrid } from '@/components/ItemsGrid';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FilterIcon from '@/components/ui/icons/FilterIcon';
import ListIcon from '@/components/ui/icons/ListIcon';
import SearchIcon from '@/components/ui/icons/SearchIcon';
import { Colors } from '@/constants/theme';
import { ItemDAO } from '@/src/api/database';
import { ItemWithDetails } from '@/src/models';
import { commonScreenStyles } from '@/styles/CommonScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ItemWithDetails[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'price_desc' | 'price_asc' | 'date_desc' | 'date_asc' | 'name'>('name');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const colors = Colors.light;

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [searchQuery, items, sortBy]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const allItems = await ItemDAO.getAll();
      const itemsWithDetails = await Promise.all(
        allItems.map(async (item) => {
          const details = await ItemDAO.getWithDetails(item.id);
          return details || null;
        })
      );
      setItems(itemsWithDetails.filter(Boolean) as ItemWithDetails[]);
    } catch (error) {
      console.error('Error loading items:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить вещи');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = items;

    // Фильтрация по названию
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Сортировка
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price_desc':
          const priceADesc = a.attributes.find(attr => attr.attribute_type === 'price')?.value || '0';
          const priceBDesc = b.attributes.find(attr => attr.attribute_type === 'price')?.value || '0';
          return parseFloat(priceBDesc) - parseFloat(priceADesc); // Дорогое сверху
        case 'price_asc':
          const priceAAsc = a.attributes.find(attr => attr.attribute_type === 'price')?.value || '0';
          const priceBAsc = b.attributes.find(attr => attr.attribute_type === 'price')?.value || '0';
          return parseFloat(priceAAsc) - parseFloat(priceBAsc); // Дешевое сверху
        case 'date_desc':
          return new Date(b.date_created).getTime() - new Date(a.date_created).getTime(); // Новое сверху
        case 'date_asc':
          return new Date(a.date_created).getTime() - new Date(b.date_created).getTime(); // Старое сверху
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name':
        return 'Название';
      case 'price_desc':
        return 'Дорогое';
      case 'price_asc':
        return 'Дешевое';
      case 'date_desc':
        return 'Новое';
      case 'date_asc':
        return 'Старое';
      default:
        return 'Название';
    }
  };

  const handleSortSelect = (sortType: 'price_desc' | 'price_asc' | 'date_desc' | 'date_asc' | 'name') => {
    setSortBy(sortType);
    setShowSortDropdown(false);
  };

  const getItemPrice = (item: ItemWithDetails) => {
    return item.attributes.find(attr => attr.attribute_type === 'price')?.value || 'Цена не указана';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
     <ThemedView style={commonScreenStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header */}
      <ThemedView style={commonScreenStyles.header}>
        <ThemedText type="title">Поиск</ThemedText>
      </ThemedView>

      {/* Search Section */}
      <View style={commonScreenStyles.searchSection}>
        <View style={[commonScreenStyles.searchSectionContainer, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
          <SearchIcon color={colors.tabIconDefault} width={20} height={20} />
          <TextInput
            style={[commonScreenStyles.searchSectionInput, { color: colors.text }]}
            placeholder="Введите название..."
            placeholderTextColor={colors.tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={commonScreenStyles.searchControlsRow}>
          <TouchableOpacity onPress={() => setShowSortDropdown(true)} style={commonScreenStyles.searchButton}>
            <View style={commonScreenStyles.searchButtonContent}>
              <ListIcon color={colors.tint} width={24} height={24} viewBox="0 0 24 16"/>
              <Text style={[commonScreenStyles.searchText, { color: colors.tint }]}>
                {getSortLabel()}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setShowFilters(true)} 
            style={[commonScreenStyles.searchFilterButton, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}
          >
            <FilterIcon color={colors.tint} width={20} height={20} />
            <Text style={[commonScreenStyles.searchFilterText, { color: colors.tint }]}>Фильтры</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Dropdown */}
      {showSortDropdown && (
        <TouchableOpacity 
          style={styles.dropdownOverlay} 
          onPress={() => setShowSortDropdown(false)}
          activeOpacity={1}
        >
          <View style={[styles.dropdownContainer, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
            <TouchableOpacity 
              onPress={() => handleSortSelect('price_desc')} 
              style={styles.dropdownItem}
            >
              <Text style={[styles.dropdownText, { color: colors.text }]}>Дорогое</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleSortSelect('price_asc')} 
              style={styles.dropdownItem}
            >
              <Text style={[styles.dropdownText, { color: colors.text }]}>Дешевое</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleSortSelect('date_desc')} 
              style={styles.dropdownItem}
            >
              <Text style={[styles.dropdownText, { color: colors.text }]}>Новое</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleSortSelect('date_asc')} 
              style={styles.dropdownItem}
            >
              <Text style={[styles.dropdownText, { color: colors.text }]}>Старое</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleSortSelect('name')} 
              style={styles.dropdownItem}
            >
              <Text style={[styles.dropdownText, { color: colors.text }]}>Название</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Results */}
      <View style={styles.resultsContainer}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
              {searchQuery.trim() ? 'Ничего не найдено' : 'Введите запрос для поиска'}
            </Text>
          </View>
        ) : (
          <ItemsGrid 
            items={filteredItems}
            title=""
          />
        )}
      </View>
    </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  headerPlaceholder: {
    width: 40,
  },
  dropdownContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    zIndex: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    zIndex: 100,
  },
  emptyText: {
    fontSize: 16,
    zIndex: 100,
  },
});
