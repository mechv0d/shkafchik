// screens/HomeScreen.tsx
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useItems } from '../hooks/useItems';
import { useWardrobeData } from '../hooks/useWardrobeData'; // ← для refetch
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import {useSearchItems} from "@/src/hooks/useSearchItems";

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { items, isLoading } = useItems();
    const { refetch } = useWardrobeData(); // ← только для pull-to-refresh

    const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'in_cart'>('all');

    const [searchQuery, setSearchQuery] = useState('');
    const { data: searchResults, isFetching } = useSearchItems(searchQuery);

    const displayItems = searchQuery.length >= 2 ? searchResults : items;

    // Фильтрация — теперь здесь, а не в useItems
    const filteredItems = useMemo(() => {
        let filtered = items;

        // Поиск
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
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
    }, [items, searchQuery, activeFilter]);

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
        <View className="flex-1 bg-background">

            {/* Поиск */}
            <View className="px-4 pt-4 pb-2">
                <TextInput
                    className="bg-card rounded-lg px-4 py-3 border border-gray-200"
                    placeholder="Поиск по названию, заметкам..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Фильтры */}
            <View className="flex-row px-4 pb-2 space-x-2">
                <TouchableOpacity
                    className={`px-4 py-2 rounded-full ${activeFilter === 'all' ? 'bg-primary' : 'bg-gray-200'}`}
                    onPress={() => setActiveFilter('all')}
                >
                    <Text className={`font-medium ${activeFilter === 'all' ? 'text-white' : 'text-gray-700'}`}>
                        Все ({items.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 rounded-full ${activeFilter === 'favorites' ? 'bg-primary' : 'bg-gray-200'}`}
                    onPress={() => setActiveFilter('favorites')}
                >
                    <Text className={`font-medium ${activeFilter === 'favorites' ? 'text-white' : 'text-gray-700'}`}>
                        Избранное ({items.filter(i => i.isFavorite).length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 rounded-full ${activeFilter === 'in_cart' ? 'bg-primary' : 'bg-gray-200'}`}
                    onPress={() => setActiveFilter('in_cart')}
                >
                    <Text className={`font-medium ${activeFilter === 'in_cart' ? 'text-white' : 'text-gray-700'}`}>
                        В корзине ({items.filter(i => i.cardType === 'in_cart').length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Список */}
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
                    />
                )}
                contentContainerClassName="p-4"
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />
                }
                ListEmptyComponent={
                    <View className="items-center py-8">
                        <Text className="text-gray-500 text-lg">Ничего не найдено</Text>
                    </View>
                }
            />

            {/* FAB */}
            <View className="absolute bottom-6 right-6">
                <Button
                    title="+"
                    onPress={() => navigation.navigate('AddItem')}
                    size="lg"
                    className="w-14 h-14 rounded-full shadow-lg"
                />
            </View>
        </View>
    );
};

export default HomeScreen;