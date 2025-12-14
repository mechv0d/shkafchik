import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackParamList } from '../../app/App';
import Button from '../components/Button';
import Tag from '../components/Tag';
import { useAppActions } from '../context/AppContext';
import { useItem } from '../hooks/useItem';

type ItemDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ItemDetail'>;

const ItemDetailScreen: React.FC = () => {
    const navigation = useNavigation<ItemDetailScreenNavigationProp>();
    const route = useRoute();
    const { itemId } = route.params as { itemId: string };

    const { updateItem, deleteItem, toggleFavorite } = useAppActions();
    const { data: item, isLoading } = useItem(itemId);

    const [isEditing, setIsEditing] = useState(false);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-lg text-gray-600">Загрузка...</Text>
            </View>
        );
    }

    if (!item) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-lg text-gray-600">Вещь не найдена</Text>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            'Удалить вещь',
            'Вы уверены, что хотите удалить эту вещь из гардероба?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: () => {
                        deleteItem(itemId);
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const handleToggleFavorite = () => {
        toggleFavorite(itemId);
    };

    const formatPrice = (price: number) => {
        return price > 0 ? price.toLocaleString('ru-RU') + ' ₽' : 'Не указана';
    };

    const renderStars = (rating: number) => {
        return (
            <View className="flex-row">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Text
                        key={star}
                        className={star <= rating ? 'text-yellow-500 text-xl' : 'text-gray-300 text-xl'}
                    >
                        ★
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <ScrollView className="flex-1 bg-background">
            <View className="p-4 space-y-6">
                {/* Заголовок и действия */}
                <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-gray-800 flex-1 mr-4">
                        {item.name}
                    </Text>
                    <TouchableOpacity onPress={handleToggleFavorite}>
                        <Text className={item.isFavorite ? 'text-red-500 text-2xl' : 'text-gray-300 text-2xl'}>
                            {item.isFavorite ? '❤️' : '🤍'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Бейдж статуса */}
                <View className={`self-start px-3 py-1 rounded-full ${
                    item.cardType === 'purchased' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                    <Text className={`font-medium ${
                        item.cardType === 'purchased' ? 'text-green-800' : 'text-blue-800'
                    }`}>
                        {item.cardType === 'purchased' ? 'Куплено' : 'В корзине'}
                    </Text>
                </View>

                {/* Изображение */}
                <View className="w-full h-48 bg-gray-100 rounded-lg items-center justify-center">
                    {item.photos.length > 0 ? (
                        <Text className="text-gray-400">[Изображение]</Text>
                    ) : (
                        <Text className="text-gray-400 text-6xl">👕</Text>
                    )}
                </View>

                {/* Информация */}
                <View className="space-y-4">
                    {/* Цена */}
                    <View>
                        <Text className="text-lg font-semibold text-gray-800 mb-1">Цена</Text>
                        <Text className="text-primary text-xl font-medium">
                            {formatPrice(item.price)}
                        </Text>
                    </View>

                    {/* Рейтинг */}
                    {item.rating > 0 && (
                        <View>
                            <Text className="text-lg font-semibold text-gray-800 mb-1">Оценка</Text>
                            {renderStars(item.rating)}
                        </View>
                    )}

                    {/* Место покупки */}
                    {item.purchasePlace && (
                        <View>
                            <Text className="text-lg font-semibold text-gray-800 mb-1">Место покупки</Text>
                            <Text className="text-gray-700 text-base">{item.purchasePlace}</Text>
                        </View>
                    )}

                    {/* Теги */}
                    {item.tags.length > 0 && (
                        <View>
                            <Text className="text-lg font-semibold text-gray-800 mb-2">Теги</Text>
                            <View className="flex-row flex-wrap">
                                {item.tags.map((tag) => (
                                    <View key={tag.id} className="mr-2 mb-2">
                                        <Tag tag={tag} size="md" />
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Заметки */}
                    {item.notes && (
                        <View>
                            <Text className="text-lg font-semibold text-gray-800 mb-1">Заметки</Text>
                            <Text className="text-gray-700 text-base leading-6">{item.notes}</Text>
                        </View>
                    )}

                    {/* Даты */}
                    <View className="pt-4 border-t border-gray-200">
                        <Text className="text-sm text-gray-500">
                            Добавлено: {item.createdAt.toLocaleDateString('ru-RU')}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            Обновлено: {item.updatedAt.toLocaleDateString('ru-RU')}
                        </Text>
                    </View>
                </View>

                {/* Кнопки действий */}
                <View className="space-y-3 pt-4">
                    <Button
                        title="Редактировать"
                        onPress={() => navigation.navigate('AddItem')} // В будущем сделаем отдельный экран редактирования
                        variant="outline"
                    />
                    <Button
                        title="Удалить вещь"
                        onPress={handleDelete}
                        variant="secondary"
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default ItemDetailScreen;