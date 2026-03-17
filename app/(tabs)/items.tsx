import { ItemsGrid } from '@/components/ItemsGrid';
import { SortButton } from '@/components/SortButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import HangerIcon from '@/components/ui/icons/HangerIcon';
import SearchIcon from '@/components/ui/icons/SearchIcon';
import HeartIcon from '@/components/ui/icons/HeartIcon';
import { Colors } from '@/constants/theme';
import { initDatabase, ItemDAO } from '@/src/api/database';
import { commonScreenStyles } from '@/styles/CommonScreen.styles';
import { sortButtonsStyles } from '@/styles/SortButtons.styles';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ItemWithDetails } from '../../src/models';

export default function ItemsScreen() {
  const [items, setItems] = useState<ItemWithDetails[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'all' | 'favorites' | 'cart' | 'purchased'>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  const colors = Colors.light;

  // Make loadItems available globally
  useEffect(() => {
    // Attach the refresh function to window object for global access
    (global as any).refreshItems = loadItems;
    return () => {
      delete (global as any).refreshItems;
    };
  }, []);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    let filtered = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Применяем сортировку и фильтрацию
    if (sortBy === 'favorites') {
      filtered = filtered.filter(item => item.is_favorite);
    } else if (sortBy === 'cart') {
      filtered = filtered.filter(item => item.in_cart);
    } else if (sortBy === 'purchased') {
      filtered = filtered.filter(item => item.is_purchased);
    }
    
    setFilteredItems(filtered);
  }, [items, searchQuery, sortBy]);

  const loadItems = async () => {
    try {
      await initDatabase();
      const itemsResult = await ItemDAO.getAll();
      console.log('itemsResult:', itemsResult);
      const itemsWithDetails = await Promise.all(
        itemsResult.map(async (item) => {
          const details = await ItemDAO.getWithDetails(item.id);
          return details || null;
        })
      );
      const validItems = itemsWithDetails.filter((item): item is ItemWithDetails => item !== null);
      console.log('validItems:', validItems);
      setItems(validItems);
      

    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };


  return (
    <ThemedView style={commonScreenStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={commonScreenStyles.header}>
          <ThemedText type="title">Недавние</ThemedText>
        </ThemedView>
        {/* Search Section */}
        <View style={[commonScreenStyles.searchSectionContainer, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
          <SearchIcon color={colors.tabIconDefault} width={20} height={20} />
          <TextInput
            style={[commonScreenStyles.searchSectionInput, { color: colors.text }]}
              placeholder="Быстрый поиск"
              placeholderTextColor={colors.tabIconDefault}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

        <View style={{ height: 40, marginBottom: 16 }}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={sortButtonsStyles.sortContainer}
            contentContainerStyle={sortButtonsStyles.sortContainerContent}
          >
          <SortButton
            title="Все"
            icon={<HangerIcon color={'#000'} width={24} height={24} viewBox="0 0 24 24" />}
            count={items.length}
            isActive={sortBy === 'all'}
            onPress={() => setSortBy('all')}
          />
          <SortButton
            title="Избранное"
            icon={<HeartIcon />}
            count={items.filter(item => item.is_favorite).length}
            isActive={sortBy === 'favorites'}
            onPress={() => setSortBy('favorites')}
          />
          {/* <SortButton
            title="В корзине"
            icon={<HangerIcon />}
            count={items.filter(item => item.in_cart).length}
            isActive={sortBy === 'cart'}
            onPress={() => setSortBy('cart')}
          />
          <SortButton
            title="Купленные"
            icon={<HangerIcon />}
            count={items.filter(item => item.is_purchased).length}
            isActive={sortBy === 'purchased'}
            onPress={() => setSortBy('purchased')}
          /> */}
          </ScrollView>
        </View>

        <ItemsGrid items={filteredItems} sortBy={sortBy} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
});
