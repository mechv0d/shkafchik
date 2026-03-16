import DatePicker from '@/components/DatePicker';
import { Colors } from '@/constants/theme';
import { CapsuleDAO, CapsuleItemDAO, ItemDAO } from '@/src/api/database';
import { Capsule, ItemWithDetails } from '@/src/models';
import { commonScreenStyles } from '@/styles/CommonScreen.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateCapsuleScreen() {
  // Устанавливаем заголовок для экрана
  useEffect(() => {
    router.setParams({ title: 'Создание капсулы' });
  }, []);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState('активная');
  const [type, setType] = useState('постоянная');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [items, setItems] = useState<ItemWithDetails[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const colors = Colors.light;

  const statusOptions = ['активная', 'черновик'];
  const typeOptions = ['постоянная', 'временная'];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const allItems = await ItemDAO.getAll();
      const itemsWithDetails = await Promise.all(
        allItems.map(async (item) => {
          const details = await ItemDAO.getWithDetails(item.id);
          return details || null;
        })
      );
      setItems(itemsWithDetails.filter(Boolean) as ItemWithDetails[]);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleCreateCapsule = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите название капсулы');
      return;
    }

    setLoading(true);
    try {
      const capsuleData: Omit<Capsule, 'id'> = {
        name: name.trim(),
        start_date: startDate ? startDate.toISOString().split('T')[0] : undefined,
        end_date: endDate ? endDate.toISOString().split('T')[0] : undefined,
        status,
        type,
      };

      const capsuleId = await CapsuleDAO.create(capsuleData);

      // Add selected items to capsule
      for (const itemId of selectedItems) {
        await CapsuleItemDAO.addItemToCapsule(capsuleId, itemId);
      }

      Alert.alert('Успех', 'Капсула создана', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating capsule:', error);
      Alert.alert('Ошибка', 'Не удалось создать капсулу');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  const toggleItemSelection = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Выберите дату';
    return date.toLocaleDateString('ru-RU');
  };

  const renderStatusOptions = () => (
    <View style={styles.optionsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Статус</Text>
      <View style={styles.optionsRow}>
        {statusOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              {
                backgroundColor: status === option ? colors.tint : colors.background,
                borderColor: colors.tint,
              },
            ]}
            onPress={() => setStatus(option)}
          >
            <Text
              style={[
                styles.optionText,
                { color: status === option ? '#fff' : colors.text },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTypeOptions = () => (
    <View style={styles.optionsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Тип</Text>
      <View style={styles.optionsRow}>
        {typeOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              {
                backgroundColor: type === option ? colors.tint : colors.background,
                borderColor: colors.tint,
              },
            ]}
            onPress={() => setType(option)}
          >
            <Text
              style={[
                styles.optionText,
                { color: type === option ? '#fff' : colors.text },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderItemSelector = () => (
    <Modal
      visible={showItemSelector}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Выберите вещи
          </Text>
          <TouchableOpacity onPress={() => setShowItemSelector(false)}>
            <Text style={[styles.modalClose, { color: colors.tint }]}>Готово</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {items.map((item) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                { backgroundColor: colors.background, borderColor: colors.tabIconDefault },
              ]}
            >
              <TouchableOpacity
                style={styles.itemInfo}
                onPress={() => toggleItemSelection(item.id)}
              >
                {item.images && item.images.length > 0 ? (
                  <Image
                    source={{ uri: item.images[0].file_path }}
                    style={styles.itemImage}
                  />
                ) : (
                  <View style={[styles.itemImagePlaceholder, { backgroundColor: colors.tabIconDefault }]}>
                    <Text style={[styles.itemImagePlaceholderText, { color: colors.text }]}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemCategory, { color: colors.tabIconDefault }]}>
                    {item.category.name}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  selectedItems.has(item.id) && { backgroundColor: colors.tint }
                ]}
                onPress={() => toggleItemSelection(item.id)}
              >
                {selectedItems.has(item.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[commonScreenStyles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonScreenStyles.title, { color: colors.text }]}>Создание капсулы</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Название</Text>
            <TextInput
              style={[
                commonScreenStyles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.tabIconDefault,
                  color: colors.text,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Введите название капсулы"
              placeholderTextColor={colors.tabIconDefault}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Начальная дата</Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.tabIconDefault,
                },
              ]}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={[styles.dateText, { color: colors.text }]}>
                {formatDate(startDate)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Конечная дата</Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.tabIconDefault,
                },
              ]}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={[styles.dateText, { color: colors.text }]}>
                {formatDate(endDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {renderStatusOptions()}
          {renderTypeOptions()}

          <View style={styles.field}>
            <TouchableOpacity
              style={[
                styles.selectItemsButton,
                { backgroundColor: colors.tint },
              ]}
              onPress={() => setShowItemSelector(true)}
            >
              <Text style={styles.selectItemsText}>
                Выбрать вещи ({selectedItems.size})
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.tint }]}
            onPress={handleCreateCapsule}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Создание...' : 'Создать капсулу'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


      {renderItemSelector()}
      <DatePicker
        visible={showStartPicker}
        // title="Выберите начальную дату"
        // date to string dd.mm.yyyy
        currentDate={startDate ? startDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null}
        onDateSelect={(dateString) => handleStartDateChange(new Date(dateString))}
        onClose={() => setShowStartPicker(false)}
      />
      <DatePicker
        visible={showEndPicker}
        // title="Выберите конечную дату"
        currentDate={endDate ? endDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null}
        onDateSelect={(dateString) => handleEndDateChange(new Date(dateString))}
        onClose={() => setShowEndPicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  form: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectItemsButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectItemsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImagePlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemCategory: {
    fontSize: 14,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  dateOptionText: {
    fontSize: 16,
  },
});
