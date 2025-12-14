// screens/HomeScreen.tsx
import { useSearchItems } from '@/src/hooks/useSearchItems';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DataPersistenceTest from '../components/DataPersistenceTest';
import { EmptyState } from '@/src/shared/ui/emptyState';
import { ItemCard } from '@/src/shared/ui/itemCard';
import { useItems } from '../hooks/useItems';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { items, isLoading } = useItems();

  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'in_cart'>('all');

  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults } = useSearchItems(searchQuery);

  const displayItems = useMemo(
    () => (searchQuery.length >= 2 ? searchResults || [] : items),
    [searchQuery, searchResults, items]
  );

  // Фильтрация — теперь здесь, а не в useItems
  const filteredItems = useMemo(() => {
    let filtered = displayItems;

    // Поиск
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.notes?.toLowerCase().includes(q) ||
          item.purchasePlace?.toLowerCase().includes(q)
      );
    }

    // Фильтр по статусу
    if (activeFilter === 'favorites') {
      filtered = filtered.filter(item => item.isFavorite);
    } else if (activeFilter === 'in_cart') {
      filtered = filtered.filter(item => item.cardType === 'in_cart');
    }

    return filtered;
  }, [displayItems, activeFilter, searchQuery]);

  // Пустое состояние
  if (!isLoading && items.length === 0) {
    return (
      <EmptyState
        title="Ваш гардероб пуст"
        description="Добавьте свою первую вещь, чтобы начать организовывать свой гардероб"
        buttonTitle="Добавить первую вещь"
        onButtonPress={() => navigation.navigate('AddItem')}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Тест сохранения данных */}
      <DataPersistenceTest />

      {/* Поиск */}
      <View className="px-6 pt-6 pb-4">
        <View className="relative">
          <TextInput
            className="input-modern text-base"
            placeholder="🔍 Поиск по названию, заметкам..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-secondary-200 rounded-full items-center justify-center"
              onPress={() => setSearchQuery('')}
            >
              <Text className="text-secondary-600 text-sm">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Фильтры */}
      <View className="px-6 pb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          <TouchableOpacity
            className={`filter-chip ${activeFilter === 'all' ? 'filter-chip-active' : 'filter-chip-inactive'} px-4 py-2.5 rounded-2xl transition-all duration-200 mr-3`}
            onPress={() => setActiveFilter('all')}
            activeOpacity={0.8}
          >
            <Text
              className={`font-semibold ${activeFilter === 'all' ? 'text-white' : 'text-text-secondary'}`}
            >
              📋 Все ({items.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`filter-chip ${activeFilter === 'favorites' ? 'filter-chip-active' : 'filter-chip-inactive'} px-4 py-2.5 rounded-2xl transition-all duration-200 mr-3`}
            onPress={() => setActiveFilter('favorites')}
            activeOpacity={0.8}
          >
            <Text
              className={`font-semibold ${activeFilter === 'favorites' ? 'text-white' : 'text-text-secondary'}`}
            >
              ❤️ Избранное ({items.filter(i => i.isFavorite).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`filter-chip ${activeFilter === 'in_cart' ? 'filter-chip-active' : 'filter-chip-inactive'} px-4 py-2.5 rounded-2xl transition-all duration-200 mr-3`}
            onPress={() => setActiveFilter('in_cart')}
            activeOpacity={0.8}
          >
            <Text
              className={`font-semibold ${activeFilter === 'in_cart' ? 'text-white' : 'text-text-secondary'}`}
            >
              🛒 В корзине ({items.filter(i => i.cardType === 'in_cart').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Список */}
      <View className="px-6 pb-8">
        {filteredItems.length > 0 ? (
          <View className="flex-row flex-wrap justify-between">
            {filteredItems.map((item, index) => (
              <View
                key={item.id}
                className="w-[48%] mb-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ItemCard
                  item={item}
                  onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center py-16">
            <View className="w-24 h-24 bg-secondary-100 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🔍</Text>
            </View>
            <Text className="text-text-secondary text-lg font-semibold text-center mb-2">
              Ничего не найдено
            </Text>
            <Text className="text-text-tertiary text-sm text-center">
              Попробуйте изменить поисковый запрос или фильтры
            </Text>
          </View>
        )}
      </View>

      {/* FAB */}
      <View className="items-center pb-8">
        <TouchableOpacity
          className="fab-modern"
          onPress={() => navigation.navigate('AddItem')}
          activeOpacity={0.9}
        >
          <Text className="text-white text-2xl font-bold">+</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
