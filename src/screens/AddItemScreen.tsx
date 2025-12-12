import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Tag from '../components/Tag';
import { CardType, Tag as TagType } from '../types';

const AddItemScreen: React.FC = () => {
    const navigation = useNavigation();
    const { addItem, tags, addTag } = useApp();

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

            await addItem({
                name: formData.name.trim(),
                photos: [],
                price: Number(formData.price) || 0,
                rating: formData.rating,
                notes: formData.notes.trim(),
                tags: selectedTagObjects,
                purchasePlace: formData.purchasePlace.trim(),
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
        if (newTagName.trim() && !tags.find(tag => tag.name === newTagName.trim())) {
            const newTag: Omit<TagType, 'id'> = {
                name: newTagName.trim(),
                color: '#6B7280', // Серый по умолчанию
                colorType: 'light',
            };
            addTag(newTag);
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

    const renderStars = () => {
        return (
            <View className="flex-row space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setFormData(prev => ({ ...prev, rating: star }))}
                    >
                        <Text className={star <= formData.rating ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <ScrollView className="flex-1 bg-background p-4">
            <View className="space-y-6">
                {/* Название */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Название *
                    </Text>
                    <TextInput
                        className="bg-card rounded-lg px-4 py-3 border border-gray-200"
                        placeholder="Например: Синяя футболка"
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    />
                </View>

                {/* Цена */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Цена
                    </Text>
                    <TextInput
                        className="bg-card rounded-lg px-4 py-3 border border-gray-200"
                        placeholder="0"
                        value={formData.price}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, price: text.replace(/[^0-9]/g, '') }))}
                        keyboardType="numeric"
                    />
                </View>

                {/* Рейтинг */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Оценка
                    </Text>
                    {renderStars()}
                </View>

                {/* Место покупки */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Место покупки
                    </Text>
                    <TextInput
                        className="bg-card rounded-lg px-4 py-3 border border-gray-200"
                        placeholder="Например: OZON, Wildberries"
                        value={formData.purchasePlace}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, purchasePlace: text }))}
                    />
                </View>

                {/* Тип карточки */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Статус
                    </Text>
                    <View className="flex-row space-x-4">
                        <TouchableOpacity
                            className={`flex-1 py-3 rounded-lg border ${
                                formData.cardType === 'purchased'
                                    ? 'bg-green-100 border-green-500'
                                    : 'bg-card border-gray-200'
                            }`}
                            onPress={() => setFormData(prev => ({ ...prev, cardType: 'purchased' }))}
                        >
                            <Text className={`text-center font-medium ${
                                formData.cardType === 'purchased' ? 'text-green-800' : 'text-gray-600'
                            }`}>
                                Куплено
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-3 rounded-lg border ${
                                formData.cardType === 'in_cart'
                                    ? 'bg-blue-100 border-blue-500'
                                    : 'bg-card border-gray-200'
                            }`}
                            onPress={() => setFormData(prev => ({ ...prev, cardType: 'in_cart' }))}
                        >
                            <Text className={`text-center font-medium ${
                                formData.cardType === 'in_cart' ? 'text-blue-800' : 'text-gray-600'
                            }`}>
                                В корзине
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Теги */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Теги
                    </Text>

                    {/* Создание нового тега */}
                    <View className="flex-row mb-4 space-x-2">
                        <TextInput
                            className="flex-1 bg-card rounded-lg px-4 py-2 border border-gray-200"
                            placeholder="Новый тег"
                            value={newTagName}
                            onChangeText={setNewTagName}
                        />
                        <Button
                            title="+"
                            onPress={handleAddTag}
                            variant="outline"
                            size="sm"
                            disabled={!newTagName.trim()}
                        />
                    </View>

                    {/* Список тегов */}
                    <View className="flex-row flex-wrap">
                        {tags.map((tag) => (
                            <TouchableOpacity
                                key={tag.id}
                                onPress={() => toggleTag(tag.id)}
                                className="mr-2 mb-2"
                            >
                                <Tag
                                    tag={tag}
                                    size="md"
                                />
                                {selectedTags.includes(tag.id) && (
                                    <View className="absolute -top-1 -right-1 bg-primary rounded-full w-4 h-4 items-center justify-center">
                                        <Text className="text-white text-xs">✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Заметки */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Заметки
                    </Text>
                    <TextInput
                        className="bg-card rounded-lg px-4 py-3 border border-gray-200 h-24"
                        placeholder="Дополнительные заметки о вещи..."
                        value={formData.notes}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Избранное */}
                <TouchableOpacity
                    className="flex-row items-center py-3"
                    onPress={() => setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                >
                    <Text className={formData.isFavorite ? 'text-red-500 text-2xl mr-3' : 'text-gray-300 text-2xl mr-3'}>
                        {formData.isFavorite ? '❤️' : '🤍'}
                    </Text>
                    <Text className="text-lg font-semibold text-gray-800">
                        Добавить в избранное
                    </Text>
                </TouchableOpacity>

                {/* Кнопка сохранения */}
                <Button
                    title="Добавить вещь"
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    disabled={!formData.name.trim() || isSubmitting}
                    size="lg"
                />
            </View>
        </ScrollView>
    );
};

export default AddItemScreen;