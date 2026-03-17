import { CapsulesGrid } from '@/components/CapsulesGrid';
import StarRating from '@/components/StarRating';
import { Tag } from '@/components/Tag';
import { CapsuleDAO, CapsuleItemDAO, CategoryDAO, ItemDAO, initDatabase } from '@/src/api/database';
import { Capsule, ItemWithDetails } from '@/src/models';
import { itemDetailStyles } from '@/styles/ItemDetail.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function ItemDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState<ItemWithDetails | null>(null);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [capsulesItemsCount, setCapsulesItemsCount] = useState<Record<number, number>>({});
  const [categoryPath, setCategoryPath] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(4);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      console.log('Loading item with ID:', id);
      
      // Ensure database is initialized
      console.log('Initializing database...');
      await initDatabase();
      console.log('Database initialized');
      
      const itemId = parseInt(id as string);
      console.log('Parsed itemId:', itemId);
      
      if (isNaN(itemId)) {
        console.error('Invalid item ID:', id);
        Alert.alert('Ошибка', 'Некорректный ID вещи');
        return;
      }
      
      console.log('Calling ItemDAO.getWithDetails...');
      const data = await ItemDAO.getWithDetails(itemId);
      console.log('Received data:', data);
      
      setItem(data);
      setIsFavorite(data?.is_favorite || false);
      
      // Load category path
      if (data) {
        const path = await CategoryDAO.getCategoryPath(data.category.id);
        setCategoryPath(path);
      }
      
      // Load capsules containing this item
      if (data) {
        console.log('Loading capsules containing item...');
        const allCapsules = await CapsuleDAO.getAll();
        const itemCapsules = [];
        const itemsCount: Record<number, number> = {};
        
        for (const capsule of allCapsules) {
          const capsuleItemIds = await CapsuleItemDAO.getCapsuleItems(capsule.id);
          if (capsuleItemIds.includes(itemId)) {
            itemCapsules.push(capsule);
            itemsCount[capsule.id] = capsuleItemIds.length;
          }
        }
        
        setCapsules(itemCapsules);
        setCapsulesItemsCount(itemsCount);
        console.log('Found capsules:', itemCapsules);
        console.log('Items count:', itemsCount);
      }
    } catch (error) {
      console.error('Error loading item:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить информацию о вещи');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!item) return;
    
    try {
      // Create shareable text content
      const shareText = `${item.name}\n${categoryPath}\n${item.attributes.find(attr => attr.attribute_type === 'description')?.value || ''}\n\nПоделиться из приложения Шкафчик`;
      
      await Sharing.shareAsync(shareText, {
        dialogTitle: 'Поделиться вещью',
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Ошибка', 'Не удалось поделиться');
    }
  };

  const handleExport = () => {
    if (!item) return;
    
    // Create export data
    const exportData = {
      name: item.name,
      category: categoryPath,
      description: item.attributes.find(attr => attr.attribute_type === 'description')?.value || '',
      purchaseDate: item.attributes.find(attr => attr.attribute_type === 'purchase_date')?.value || '',
      store: item.attributes.find(attr => attr.attribute_type === 'store')?.value || '',
      rating: item.attributes.find(attr => attr.attribute_type === 'rating')?.value || '0',
      tags: item.tags?.map(tag => ({ name: tag.name, color: tag.color })) || [],
      images: item.images?.map(img => img.file_path) || [],
      status: item.status?.name || '',
      dateAdded: item.date_created
    };
    
    // Create text content
    const textContent = `Вещь: ${exportData.name}\n` +
      `Категория: ${exportData.category}\n` +
      `Описание: ${exportData.description || 'Нет описания'}\n` +
      `Дата покупки: ${exportData.purchaseDate || 'Не указана'}\n` +
      `Магазин: ${exportData.store || 'Не указан'}\n` +
      `Оценка: ${exportData.rating}\n` +
      `Статус: ${exportData.status}\n` +
      `Теги: ${exportData.tags.map(t => t.name).join(', ')}\n` +
      `Изображения: ${exportData.images.length} шт.\n` +
      `Дата добавления: ${new Date(exportData.dateAdded).toLocaleDateString('ru-RU')}`;
    
    Alert.alert(
      'Экспорт данных',
      textContent,
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const handleToggleFavorite = async () => {
    if (!item) return;
    
    try {
      await initDatabase();
      const newFavoriteStatus = !isFavorite;
      await ItemDAO.updateFavorite(item.id, newFavoriteStatus);
      setIsFavorite(newFavoriteStatus);
      
      Alert.alert(
        'Избранное',
        newFavoriteStatus ? 'Вещь добавлена в избранные' : 'Вещь удалена из избранных'
      );
    } catch (error) {
      console.error('Error updating favorite status:', error);
      Alert.alert('Ошибка', 'Не удалось обновить статус избранного');
    }
  };

  const handleRatingChange = async (newRating: number) => {
    if (!item) return;
    
    try {
      await initDatabase();
      setRating(newRating);
      
      // Update rating in database
      const ratingAttr = item.attributes.find(attr => attr.attribute_type === 'rating');
      if (ratingAttr) {
        await ItemDAO.updateAttribute(item.id, 'rating', newRating.toString());
      } else {
        await ItemDAO.createAttribute(item.id, 'rating', newRating.toString());
      }
      
      Alert.alert('Оценка', `Ваша оценка: ${newRating} из 5`);
    } catch (error) {
      console.error('Error updating rating:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить оценку');
    }
  };

  const handleAddDescription = async () => {
    if (!item) return;
    
    try {
      await initDatabase();
      
      // Update description in database
      const descAttr = item.attributes.find(attr => attr.attribute_type === 'description');
      if (descAttr) {
        await ItemDAO.updateAttribute(item.id, 'description', description);
      } else {
        await ItemDAO.createAttribute(item.id, 'description', description);
      }
      
      // Update local state
      setItem(prev => prev ? {
        ...prev,
        attributes: prev.attributes.map(attr => 
          attr.attribute_type === 'description' 
            ? { ...attr, value: description }
            : attr
        )
      } : null);
      
      setShowDescriptionModal(false);
      setDescription('');
      Alert.alert('Успех', 'Описание добавлено');
    } catch (error) {
      console.error('Error adding description:', error);
      Alert.alert('Ошибка', 'Не удалось добавить описание');
    }
  };

  const handleEdit = () => {
    // Navigate to edit screen
    router.push(`/edit-item?id=${id}`); // /edit-item?id=${id} <- OLD BUT GOLD
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить вещь',
      'Вы уверены, что хотите удалить эту вещь?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            // Implement delete functionality
            router.back();
          }
        }
      ]
    );
  };

  
  const renderTags = () => {
    if (!item?.tags || item.tags.length === 0) return null;

    return (
      <View style={itemDetailStyles.section}>
        <View style={itemDetailStyles.sectionHeader}>
          <Text style={itemDetailStyles.sectionTitle}>Теги</Text>
          <TouchableOpacity style={itemDetailStyles.editButton}>
            <Ionicons name="pencil" size={16} color="#666" />
            <Text style={itemDetailStyles.editText}>Править</Text>
          </TouchableOpacity>
        </View>
        <View style={itemDetailStyles.tagsContainer}>
          {item.tags.map((tag) => (
            <Tag
              key={tag.id}
              id={tag.id}
              name={tag.name}
              color={tag.color}
              isProtected={tag.name === 'Новое'}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderCapsules = () => {
    return (
      <View style={itemDetailStyles.section}>
        <Text style={itemDetailStyles.sectionTitle}>Капсулы</Text>
        <CapsulesGrid 
          capsules={capsules}
          onCapsulePress={(capsule: Capsule) => router.push(`/capsules/${capsule.id}` as any)}
          showItemsCount={true}
          itemsCounts={capsulesItemsCount}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={itemDetailStyles.loadingContainer}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={itemDetailStyles.errorContainer}>
        <Text>Вещь не найдена</Text>
      </View>
    );
  }

  const price = item.attributes.find(attr => attr.attribute_type === 'price')?.value || 'Цена не указана';
  const purchaseDate = item.attributes.find(attr => attr.attribute_type === 'purchase_date')?.value;
  const store = item.attributes.find(attr => attr.attribute_type === 'store')?.value;

  return (
      <View style={itemDetailStyles.container}>
      {/* Header */}
      <View style={[itemDetailStyles.header, { zIndex: 1000, position: 'relative' }]}>
        <TouchableOpacity onPress={() => router.back()} style={itemDetailStyles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={itemDetailStyles.headerTitle}>Вещь</Text>
        <View style={itemDetailStyles.headerRight}>
          <TouchableOpacity onPress={handleShare} style={itemDetailStyles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleFavorite} style={itemDetailStyles.headerButton}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? '#e74c3c' : '#000'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Background Image - Behind everything */}
      <View style={itemDetailStyles.backgroundImageContainer}>
        {item.images && item.images.length > 0 ? (
          <ExpoImage 
            source={{ uri: item.images[0].file_path }} 
            style={itemDetailStyles.backgroundMainImage}
            contentFit="cover"
          />
        ) : (
          <View style={itemDetailStyles.backgroundPlaceholderImage}>
            <Ionicons name="image-outline" size={60} color="#ccc" />
          </View>
        )}
      </View>

      {/* Scrollable Content - On top of image */}
      <ScrollView 
        style={itemDetailStyles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={itemDetailStyles.scrollContent}
        bounces={true}
        alwaysBounceVertical={true}
        decelerationRate="normal"
        contentInset={{ top: 0, bottom: 0 }}
        contentOffset={{ x: 0, y: 0 }}
      >
        {/* Spacer for initial image visibility */}
        <View style={itemDetailStyles.imageSpacer} />

        {/* Action Buttons */}
        <View style={itemDetailStyles.actionButtons}>
          <TouchableOpacity style={itemDetailStyles.editButtonAction} onPress={handleEdit}>
            <Ionicons name="pencil" size={16} color="#fff" />
            <Text style={itemDetailStyles.editButtonText}>Изменить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={itemDetailStyles.deleteButtonAction} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={16} color="#000" />
            <Text style={itemDetailStyles.deleteButtonText}>Удалить</Text>
          </TouchableOpacity>
        </View>

        {/* Item Info */}
        <View style={itemDetailStyles.content}>
          <Text style={itemDetailStyles.itemName}>{item.name}</Text>
          
          {/* Categories */}
          <TouchableOpacity style={itemDetailStyles.categories}>
            <Text style={itemDetailStyles.categoriesText}>
              {categoryPath} → <Text style={itemDetailStyles.lastCategoriesText}>{item.name}</Text>
            </Text>
          </TouchableOpacity>

          {/* Price
          <View style={itemDetailStyles.priceContainer}>
            <Text style={itemDetailStyles.price}>{price}</Text>
            <TouchableOpacity>
              <Ionicons name="pencil" size={16} color="#666" />
            </TouchableOpacity>
          </View> */}

          {/* Description */}
          <View style={itemDetailStyles.section}>
            <View style={itemDetailStyles.sectionHeader}>
              <Text style={itemDetailStyles.sectionTitle}>Описание</Text>
              <TouchableOpacity style={itemDetailStyles.editButton}>
                <Ionicons name="pencil" size={16} color="#666" />
                <Text style={itemDetailStyles.editText}>Править</Text>
              </TouchableOpacity>
            </View>
            <View style={itemDetailStyles.description}>
              {item.attributes.find(attr => attr.attribute_type === 'description')?.value ? (
                <Text style={itemDetailStyles.descriptionText} selectable>
                  {item.attributes.find(attr => attr.attribute_type === 'description')?.value}
                </Text>
              ) : (
                <>
                  <Text style={itemDetailStyles.descriptionText} selectable>
                    Описание отсутствует. 
                  </Text>
                  <TouchableOpacity style={itemDetailStyles.addLink} onPress={() => setShowDescriptionModal(true)}>
                    <Text style={itemDetailStyles.addLinkText}>Добавить</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Purchase Info */}
          <View style={itemDetailStyles.section}>
            <Text style={itemDetailStyles.purchaseInfo}>
              Добавлена {new Date(item.date_created).toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
            {purchaseDate && (
              <Text style={itemDetailStyles.purchaseInfo}>
                Куплена {new Date(purchaseDate).toLocaleDateString('ru-RU', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
            )}
            {store && (
              <Text style={itemDetailStyles.purchaseInfo}>
                {store} (4,4 из 5)
              </Text>
            )}
          </View>

          {/* Tags */}
          {renderTags()}

          {/* Rating */}
          <View style={itemDetailStyles.section}>
            <Text style={itemDetailStyles.sectionTitle}>Ваша оценка</Text>
            <StarRating rating={rating} onRatingChange={handleRatingChange} />
          </View>

          {/* Capsules */}
          {renderCapsules()}
        </View>
      </ScrollView>

      {/* Description Modal */}
      <Modal
        visible={showDescriptionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDescriptionModal(false)}
      >
        <View style={itemDetailStyles.modalContainer}>
          <View style={itemDetailStyles.modalContent}>
            <Text style={itemDetailStyles.sectionTitle}>Добавить описание</Text>
            <TextInput
              style={[itemDetailStyles.descriptionInput, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Введите описание вещи"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
            <View style={itemDetailStyles.modalButtons}>
              <TouchableOpacity
                style={[itemDetailStyles.modalButton, itemDetailStyles.cancelButton]}
                onPress={() => {
                  setShowDescriptionModal(false);
                  setDescription('');
                }}
              >
                <Text style={itemDetailStyles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[itemDetailStyles.modalButton, itemDetailStyles.saveButton]}
                onPress={handleAddDescription}
              >
                <Text style={itemDetailStyles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

