import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAppActions } from '../context/AppContext';
import { Item } from '../types';
import Tag from './Tag';
import {useWardrobeMutations} from "@/src/hooks/useWardrobeMutations";

interface ItemCardProps {
    item: Item;
    onPress: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
    const { toggleFavorite, isToggling } = useWardrobeMutations();


    const formatPrice = (price: number) => price > 0 ? price.toLocaleString('ru-RU') + ' ₽' : '—';

    const renderStars = (rating: number) => (
        <View className="flex-row">
            {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}>
                    Star
                </Text>
            ))}
        </View>
    );

    return (
        <TouchableOpacity
            className="bg-card rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
            onPress={onPress}
            disabled={isToggling}
        >
            <View className="flex-row">
                {/* Фото */}
                <View className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center mr-4">
                    {item.photos.length > 0 ? (
                        <Image source={{ uri: item.photos[0] }} className="w-full h-full rounded-lg" />
                    ) : (
                        <Text className="text-gray-400 text-2xl">Clothing</Text>
                    )}
                </View>

                {/* Инфо */}
                <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2">
                            {item.name}
                        </Text>
                        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                            <Text className={item.isFavorite ? 'text-red-500 text-xl' : 'text-gray-300 text-xl'}>
                                {item.isFavorite ? 'FAV' : 'NOT FAV :('}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {item.price > 0 && (
                        <Text className="text-primary font-medium text-base mb-1">
                            {formatPrice(item.price)}
                        </Text>
                    )}

                    {item.rating > 0 && <View className="mb-2">{renderStars(item.rating)}</View>}

                    {item.purchasePlace && (
                        <Text className="text-gray-600 text-sm mb-2">
                            Куплено в: {item.purchasePlace}
                        </Text>
                    )}

                    {/* Теги */}
                    {item.tags.length > 0 && (
                        <View className="flex-row flex-wrap">
                            {item.tags.slice(0, 3).map((tag) => (
                                <View key={tag.id} className="mr-1 mb-1">
                                    <Tag tag={tag} size="sm" />
                                </View>
                            ))}
                            {item.tags.length > 3 && (
                                <View className="bg-gray-200 px-2 py-1 rounded-full">
                                    <Text className="text-gray-600 text-xs">+{item.tags.length - 3}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Бейдж */}
                    <View className={`absolute top-2 right-2 px-2 py-1 rounded-full ${
                        item.cardType === 'purchased' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                        <Text className={`text-xs font-medium ${
                            item.cardType === 'purchased' ? 'text-green-800' : 'text-blue-800'
                        }`}>
                            {item.cardType === 'purchased' ? 'Куплено' : 'В корзине'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ItemCard;