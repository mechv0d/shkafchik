import { ItemsGrid } from '@/components/ItemsGrid';
import { Colors } from '@/constants/theme';
import { CapsuleDAO, CapsuleItemDAO, ItemDAO } from '@/src/api/database';
import { Capsule, ItemWithDetails } from '@/src/models';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CapsuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [items, setItems] = useState<ItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  
  const colors = Colors.light;

  useEffect(() => {
    if (id) {
      loadCapsuleData();
    }
  }, [id]);

  const loadCapsuleData = async () => {
    try {
      const capsuleData = await CapsuleDAO.getById(Number(id));
      if (!capsuleData) {
        Alert.alert('Ошибка', 'Капсула не найдена');
        router.back();
        return;
      }
      
      setCapsule(capsuleData);
      
      // Load capsule items
      const capsuleItemIds = await CapsuleItemDAO.getCapsuleItems(capsuleData.id);
      const itemsWithDetails = await Promise.all(
        capsuleItemIds.map(async (itemId: number) => {
          const details = await ItemDAO.getWithDetails(itemId);
          return details || null;
        })
      );
      setItems(itemsWithDetails.filter(Boolean) as ItemWithDetails[]);
    } catch (error) {
      console.error('Error loading capsule:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные капсулы');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/capsules/${id}/edit` as any);
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление капсулы',
      'Вы уверены, что хотите удалить эту капсулу? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await CapsuleDAO.delete(Number(id));
              Alert.alert('Успех', 'Капсула удалена');
              router.back();
            } catch (error) {
              console.error('Error deleting capsule:', error);
              Alert.alert('Ошибка', 'Не удалось удалить капсулу');
            }
          },
        },
      ]
    );
  };

  const handleArchive = () => {
    Alert.alert(
      'Архивация капсулы',
      'Вы уверены, что хотите отправить эту капсулу в архив?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'В архив',
          onPress: async () => {
            try {
              await CapsuleDAO.update(Number(id), { status: 'архивная' });
              Alert.alert('Успех', 'Капсула отправлена в архив');
              loadCapsuleData();
            } catch (error) {
              console.error('Error archiving capsule:', error);
              Alert.alert('Ошибка', 'Не удалось архивировать капсулу');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Загрузка...</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
    );
  }

  if (!capsule) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Ошибка</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Капсула не найдена</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{capsule.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Название */}
          <Text style={[styles.capsuleName, { color: colors.text }]}>{capsule.name}</Text>

          {/* Кнопки редактировать и удалить */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton, { borderColor: colors.tint }]}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={20} color={colors.tint} />
              <Text style={[styles.actionButtonText, { color: colors.tint }]}>Изменить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton, { borderColor: '#ff4444' }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#ff4444" />
              <Text style={[styles.actionButtonText, { color: '#ff4444' }]}>Удалить</Text>
            </TouchableOpacity>
          </View>

          {/* Кнопка в архив */}
          {capsule.status !== 'архивная' && (
            <TouchableOpacity
              style={[styles.archiveButton, { backgroundColor: colors.tint }]}
              onPress={handleArchive}
            >
              <Ionicons name="archive-outline" size={20} color="#fff" />
              <Text style={styles.archiveButtonText}>В архив</Text>
            </TouchableOpacity>
          )}

          {/* Атрибуты капсулы */}
          <View style={styles.attributesContainer}>
            <View style={styles.attributeRow}>
              <Text style={[styles.attributeLabel, { color: colors.text }]}>Статус:</Text>
              <Text style={[styles.attributeValue, { color: colors.text }]}>{capsule.status}</Text>
            </View>
            <View style={styles.attributeRow}>
              <Text style={[styles.attributeLabel, { color: colors.text }]}>Тип:</Text>
              <Text style={[styles.attributeValue, { color: colors.text }]}>{capsule.type}</Text>
            </View>
            <View style={styles.attributeRow}>
              <Text style={[styles.attributeLabel, { color: colors.text }]}>Начальная дата:</Text>
              <Text style={[styles.attributeValue, { color: colors.text }]}>{formatDate(capsule.start_date)}</Text>
            </View>
            <View style={styles.attributeRow}>
              <Text style={[styles.attributeLabel, { color: colors.text }]}>Конечная дата:</Text>
              <Text style={[styles.attributeValue, { color: colors.text }]}>{formatDate(capsule.end_date)}</Text>
            </View>
          </View>

          {/* Список вещей */}
          <View style={styles.itemsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Вещи в капсуле ({items.length})
            </Text>
            {items.length > 0 ? (
              <ItemsGrid items={items} title="" />
            ) : (
              <View style={styles.emptyItemsContainer}>
                <Text style={[styles.emptyItemsText, { color: colors.tabIconDefault }]}>
                  В этой капсуле пока нет вещей
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  capsuleName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {},
  deleteButton: {},
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  archiveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  attributesContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  attributeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  attributeValue: {
    fontSize: 16,
  },
  itemsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyItemsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyItemsText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
});
