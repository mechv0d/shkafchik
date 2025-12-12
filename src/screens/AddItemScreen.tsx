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
import { useAppActions } from '../context/AppContext';
import { useTags } from '../hooks/useTags';
import Button from '../components/Button';
import Tag from '../components/Tag';
import { CardType } from '../types';
import {useWardrobeMutations} from "@/src/hooks/useWardrobeMutations";
import {useItems} from "@/src/hooks/useItems";

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
        <ScrollView className="flex-1 bg-background p-4">
            <View className="space-y-6">

                {/* Название */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">Название *</Text>
                    <TextInput
                        className="bg-card rounded-lg px-4 py-3 border border-gray-200"
                        placeholder="Например: Синяя футболка"
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    />
                </View>

                {/* Цена */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">Цена</Text>
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
                    <Text className="text-lg font-semibold text-gray-800 mb-2">Оценка</Text>
                    {renderStars()}
                </View>

                {/* Тип карточки */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">Статус</Text>
                    <View className="flex-row space-x-3">
                        <TouchableOpacity
                            className={`flex-1 py-3 rounded-lg border ${formData.cardType === 'purchased' ? 'bg-green-100 border-green-500' : 'bg-card border-gray-200'}`}
                            onPress={() => setFormData(prev => ({ ...prev, cardType: 'purchased' }))}
                        >
                            <Text className={`text-center font-medium ${formData.cardType === 'purchased' ? 'text-green-800' : 'text-gray-600'}`}>
                                Куплено
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-3 rounded-lg border ${formData.cardType === 'in_cart' ? 'bg-blue-100 border-blue-500' : 'bg-card border-gray-200'}`}
                            onPress={() => setFormData(prev => ({ ...prev, cardType: 'in_cart' }))}
                        >
                            <Text className={`text-center font-medium ${formData.cardType === 'in_cart' ? 'text-blue-800' : 'text-gray-600'}`}>
                                В корзине
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Теги */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">Теги</Text>
                    <View className="flex-row mb-4 space-x-2">
                        <TextInput
                            className="flex-1 bg-card rounded-lg px-4 py-2 border border-gray-200"
                            placeholder="Новый тег"
                            value={newTagName}
                            onChangeText={setNewTagName}
                        />
                        <Button title="+" onPress={handleAddTag} variant="outline" size="sm" disabled={!newTagName.trim()} />
                    </View>

                    <View className="flex-row flex-wrap">
                        {tags.map((tag) => (
                            <TouchableOpacity key={tag.id} onPress={() => toggleTag(tag.id)} className="mr-2 mb-2">
                                <Tag tag={tag} size="md" />
                                {selectedTags.includes(tag.id) && (
                                    <View className="absolute -top-1 -right-1 bg-primary rounded-full w-4 h-4 items-center justify-center">
                                        <Text className="text-white text-xs">Checkmark</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Заметки */}
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-2">Заметки</Text>
                    <TextInput
                        className="bg-card rounded-lg px-4 py-3 border border-gray-200 h-24"
                        placeholder="Дополнительные заметки..."
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
                        {formData.isFavorite ? 'Heart' : 'Empty Heart'}
                    </Text>
                    <Text className="text-lg font-semibold text-gray-800">Добавить в избранное</Text>
                </TouchableOpacity>

                {/* Кнопка */}
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