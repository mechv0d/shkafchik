import { useWardrobeMutations } from '@/src/hooks/useWardrobeMutations';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Item } from '../../../types';
import { Tag } from '../tag';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
  const { toggleFavorite, isToggling } = useWardrobeMutations();

  const formatPrice = (price: number) => (price > 0 ? price.toLocaleString('ru-RU') + ' ₽' : '—');

  const renderStars = (rating: number) => (
    <View className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <Text key={star} className={`text-sm ${star <= rating ? 'star-filled' : 'star-empty'}`}>
          ★
        </Text>
      ))}
    </View>
  );

  const getStatusBadgeStyles = () => {
    return item.cardType === 'purchased' ? 'status-badge-purchased' : 'status-badge-cart';
  };

  return (
    <TouchableOpacity
      className="card-elegant p-4 mb-4 animate-fade-in"
      onPress={onPress}
      disabled={isToggling}
      activeOpacity={0.9}
    >
      {/* Фото */}
      <View className="relative mb-3">
        <View className="w-full aspect-[4/3] bg-secondary-100 rounded-xl items-center justify-center overflow-hidden shadow-sm">
          {item.photos.length > 0 ? (
            <Image source={{ uri: item.photos[0] }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className="text-secondary-400 text-4xl">👕</Text>
          )}
        </View>

        {/* Favorite indicator */}
        <TouchableOpacity
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full items-center justify-center shadow-md"
          onPress={() => toggleFavorite(item.id)}
          activeOpacity={0.7}
        >
          <Text className={`text-sm ${item.isFavorite ? 'heart-filled' : 'heart-empty'}`}>
            {item.isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>

        {/* Статус бейдж */}
        <View
          className={`absolute top-2 left-2 px-2 py-1 rounded-full border ${getStatusBadgeStyles()}`}
        >
          <Text className="text-xs font-bold">{item.cardType === 'purchased' ? '✓' : '•'}</Text>
        </View>
      </View>

      {/* Инфо */}
      <View className="flex-1">
        <Text className="text-sm font-bold text-text-primary mb-1 leading-5" numberOfLines={2}>
          {item.name}
        </Text>

        {item.price > 0 && (
          <Text className="text-primary-600 font-bold text-sm mb-2">{formatPrice(item.price)}</Text>
        )}

        {item.rating > 0 && <View className="mb-2">{renderStars(item.rating)}</View>}

        {item.purchasePlace && (
          <View className="flex-row items-center mb-2">
            <Text className="text-text-secondary text-xs mr-1">🏪</Text>
            <Text className="text-text-secondary text-xs flex-1" numberOfLines={1}>
              {item.purchasePlace}
            </Text>
          </View>
        )}

        {/* Теги */}
        {item.tags.length > 0 && (
          <View className="flex-row flex-wrap">
            {item.tags.slice(0, 1).map(tag => (
              <View key={tag.id} className="mr-1 mb-1">
                <Tag tag={tag} size="sm" variant="subtle" />
              </View>
            ))}
            {item.tags.length > 1 && (
              <View className="bg-secondary-100 px-1.5 py-0.5 rounded-full border border-secondary-200">
                <Text className="text-secondary-600 text-xs font-medium">
                  +{item.tags.length - 1}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;
