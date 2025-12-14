import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../components/Button';
import Tag from '../components/Tag';
import { useAppActions } from '../context/AppContext';
import { useTags } from '../hooks/useTags';
import { CardType } from '../types';

const AddItemScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { addItem } = useAppActions();
    const { tags, addTag } = useTags(); // ← данные из React Query

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        rating: 0,
        notes: '',
        purchasePlace: '',
        cardType: 'purchased' as CardType,
        isFavorite: false,
    });

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [newTagName, setNewTagName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, введите название вещи');
            return;
        }

        setIsSubmitting(true);

        try {
            const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id));

            addItem({
                name: formData.name.trim(),
                photos: [],
                price: Number(formData.price) || 0,
                rating: formData.rating,
                notes: formData.notes.trim() || "undefined",
                purchasePlace: formData.purchasePlace.trim() || "undefined",
                tags: selectedTagObjects,
                cardType: formData.cardType,
                isFavorite: formData.isFavorite,
            });

            navigation.goBack();
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось добавить вещь');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTag = () => {
        if (newTagName.trim() && !tags.find(t => t.name.toLowerCase() === newTagName.trim().toLowerCase())) {
            addTag({
                name: newTagName.trim(),
                color: '#6B7280',
                colorType: 'light',
            });
            setNewTagName('');
        }
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const renderStars = () => (
        <View className="flex-row space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => setFormData(prev => ({ ...prev, rating: star }))}
                >
                    <Text className={star <= formData.rating ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}>
                        Star
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <ScrollView
            className="flex-1 bg-background"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="px-6 py-6 pb-32"
        >
            <View className="space-y-8">
                {/* Заголовок */}
                <View className="items-center py-4">
                    <View className="w-16 h-16 bg-primary-100 rounded-2xl items-center justify-center mb-4">
                        <Text className="text-3xl">👕</Text>
                    </View>
                    <Text className="text-2xl font-bold text-text-primary mb-2">Новая вещь</Text>
                    <Text className="text-text-secondary text-center">
                        Заполните информацию о вашей новой вещи
                    </Text>
                </View>

                {/* Название */}
                <View className="space-y-2">
                    <View className="flex-row items-center">
                        <Text className="text-lg font-bold text-text-primary mr-2">📝</Text>
                        <Text className="text-lg font-bold text-text-primary">Название *</Text>
                    </View>
                    <TextInput
                        className="input-modern text-base"
                        placeholder="Например: Синяя футболка Levi's"
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    />
                </View>

                {/* Цена */}
                <View className="space-y-2">
                    <View className="flex-row items-center">
                        <Text className="text-lg font-bold text-text-primary mr-2">💰</Text>
                        <Text className="text-lg font-bold text-text-primary">Цена</Text>
                    </View>
                    <TextInput
                        className="input-modern text-base"
                        placeholder="0 ₽"
                        value={formData.price}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, price: text.replace(/[^0-9]/g, '') }))}
                        keyboardType="numeric"
                    />
                </View>

                {/* Рейтинг */}
                <View className="space-y-3">
                    <View className="flex-row items-center">
                        <Text className="text-lg font-bold text-text-primary mr-2">⭐</Text>
                        <Text className="text-lg font-bold text-text-primary">Оценка</Text>
                    </View>
                    <View className="flex-row items-center justify-center py-2">
                        {renderStars()}
                    </View>
                </View>

                {/* Тип карточки */}
                <View className="space-y-3">
                    <View className="flex-row items-center">
                        <Text className="text-lg font-bold text-text-primary mr-2">📊</Text>
                        <Text className="text-lg font-bold text-text-primary">Статус</Text>
                    </View>
                    <View className="flex-row space-x-4">
                        <TouchableOpacity
                            className={`flex-1 py-4 rounded-2xl border-2 transition-all duration-200 ${
                                formData.cardType === 'purchased'
                                    ? 'bg-success-50 border-success-300 shadow-sm'
                                    : 'bg-surface border-border'
                            }`}
                            onPress={() => setFormData(prev => ({ ...prev, cardType: 'purchased' }))}
                            activeOpacity={0.8}
                        >
                            <View className="items-center">
                                <Text className="text-2xl mb-2">✅</Text>
                                <Text className={`font-bold text-center ${
                                    formData.cardType === 'purchased' ? 'text-success-700' : 'text-text-secondary'
                                }`}>
                                    Уже куплено
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-4 rounded-2xl border-2 transition-all duration-200 ${
                                formData.cardType === 'in_cart'
                                    ? 'bg-primary-50 border-primary-300 shadow-sm'
                                    : 'bg-surface border-border'
                            }`}
                            onPress={() => setFormData(prev => ({ ...prev, cardType: 'in_cart' }))}
                            activeOpacity={0.8}
                        >
                            <View className="items-center">
                                <Text className="text-2xl mb-2">🛒</Text>
                                <Text className={`font-bold text-center ${
                                    formData.cardType === 'in_cart' ? 'text-primary-700' : 'text-text-secondary'
                                }`}>
                                    В корзине
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Теги */}
                <View className="space-y-3">
                    <View className="flex-row items-center">
                        <Text className="text-lg font-bold text-text-primary mr-2">🏷️</Text>
                        <Text className="text-lg font-bold text-text-primary">Теги</Text>
                    </View>

                    <View className="flex-row space-x-3">
                        <TextInput
                            className="flex-1 input-modern text-base"
                            placeholder="Добавить новый тег..."
                            value={newTagName}
                            onChangeText={setNewTagName}
                        />
                        <Button
                            title="➕"
                            onPress={handleAddTag}
                            variant="outline"
                            size="md"
                            disabled={!newTagName.trim()}
                        />
                    </View>

                    {tags.length > 0 && (
                        <View className="flex-row flex-wrap">
                            {tags.map((tag) => (
                                <TouchableOpacity
                                    key={tag.id}
                                    onPress={() => toggleTag(tag.id)}
                                    className="mr-3 mb-3"
                                    activeOpacity={0.8}
                                >
                                    <Tag
                                        tag={tag}
                                        size="md"
                                        selected={selectedTags.includes(tag.id)}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Магазин */}
                <View className="space-y-2">
                    <View className="flex-row items-center">
                        <Text className="text-lg font-bold text-text-primary mr-2">🏪</Text>
                        <Text className="text-lg font-bold text-text-primary">Где куплено</Text>
                    </View>
                    <TextInput
                        className="input-modern text-base"
                        placeholder="Название магазина или интернет-магазин"
                        value={formData.purchasePlace}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, purchasePlace: text }))}
                    />
                </View>

                {/* Заметки */}
                <View className="space-y-2">
                    <View className="flex-row items-center">
                        <Text className="text-lg font-bold text-text-primary mr-2">📝</Text>
                        <Text className="text-lg font-bold text-text-primary">Заметки</Text>
                    </View>
                    <TextInput
                        className="input-modern text-base h-24"
                        placeholder="Дополнительные заметки о вещи..."
                        value={formData.notes}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Избранное */}
                <TouchableOpacity
                    className="flex-row items-center justify-center py-4 px-6 bg-surface rounded-2xl border border-border active:bg-secondary-50 transition-colors duration-200"
                    onPress={() => setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                    activeOpacity={0.8}
                >
                    <Text className={`text-2xl mr-3 ${formData.isFavorite ? 'heart-filled' : 'heart-empty'}`}>
                        {formData.isFavorite ? '❤️' : '🤍'}
                    </Text>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-text-primary">
                            Добавить в избранное
                        </Text>
                        <Text className="text-text-secondary text-sm">
                            Вещь появится в списке избранных
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Кнопка */}
                <Button
                    title="✨ Добавить вещь"
                    onPress={handleSubmit}
                    variant="gradient"
                    loading={isSubmitting}
                    disabled={!formData.name.trim() || isSubmitting}
                    size="lg"
                    fullWidth
                />
            </View>
        </ScrollView>
    );
};

export default AddItemScreen;