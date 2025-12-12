import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/App';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { items, getFilteredItems, isLoading } = useApp();

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'in_cart'>('all');

    const filteredItems = getFilteredItems({
        search: searchQuery,
        favorite: activeFilter === 'favorites' ? true : undefined,
        cardType: activeFilter === 'in_cart' ? 'in_cart' : undefined,
    });

    const onRefresh = async () => {
        setRefreshing(true);
        // В будущем можно добавить синхронизацию
        setTimeout(() => setRefreshing(false), 1000);
    };

    const renderItem = ({ item }: { item: any }) => (
        <ItemCard item={item} onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })} />
    );

    if (items.length === 0 && !isLoading) {
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
                    className={`px-4 py-2 rounded-full ${
                        activeFilter === 'all' ? 'bg-primary' : 'bg-gray-200'
                    }`}
                    onPress={() => setActiveFilter('all')}
                >
                    <Text className={`font-medium ${
                        activeFilter === 'all' ? 'text-white' : 'text-gray-700'
                    }`}>
                        Все ({items.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 rounded-full ${
                        activeFilter === 'favorites' ? 'bg-primary' : 'bg-gray-200'
                    }`}
                    onPress={() => setActiveFilter('favorites')}
                >
                    <Text className={`font-medium ${
                        activeFilter === 'favorites' ? 'text-white' : 'text-gray-700'
                    }`}>
                        Избранное
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 rounded-full ${
                        activeFilter === 'in_cart' ? 'bg-primary' : 'bg-gray-200'
                    }`}
                    onPress={() => setActiveFilter('in_cart')}
                >
                    <Text className={`font-medium ${
                        activeFilter === 'in_cart' ? 'text-white' : 'text-gray-700'
                    }`}>
                        В корзине
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Список */}
            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerClassName="p-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View className="items-center justify-center py-8">
                        <Text className="text-gray-500 text-lg">Ничего не найдено</Text>
                    </View>
                }
            />

            {/* Кнопка добавления */}
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