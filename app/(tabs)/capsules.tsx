import PlusIcon from '@/components/ui/icons/PlusIcon';
import { Colors } from '@/constants/theme';
import { CapsuleDAO } from '@/src/api/database';
import { Capsule } from '@/src/models';
import { commonScreenStyles } from '@/styles/CommonScreen.styles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface CapsuleCardProps {
  capsule: Capsule;
  onPress: (capsule: Capsule) => void;
}

const CapsuleCard: React.FC<CapsuleCardProps> = ({ capsule, onPress }) => {
  const colors = Colors.light;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'активная':
        return '#4CAF50';
      case 'архивная':
        return '#9E9E9E';
      case 'черновик':
        return '#FF9800';
      default:
        return colors.text;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'постоянная':
        return '#2196F3';
      case 'временная':
        return '#9C27B0';
      default:
        return colors.text;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <TouchableOpacity
      style={[commonScreenStyles.card, { backgroundColor: colors.background }]}
      onPress={() => onPress(capsule)}
    >
      <View style={styles.cardHeader}>
        <Text style={[commonScreenStyles.cardTitle, { color: colors.text }]}>
          {capsule.name}
        </Text>
        <View style={styles.badges}>
          <View style={[commonScreenStyles.badge, { backgroundColor: getStatusColor(capsule.status) }]}>
            <Text style={commonScreenStyles.badgeText}>{capsule.status}</Text>
          </View>
          <View style={[commonScreenStyles.badge, { backgroundColor: getTypeColor(capsule.type) }]}>
            <Text style={commonScreenStyles.badgeText}>{capsule.type}</Text>
          </View>
        </View>
      </View>
      
      {(capsule.start_date || capsule.end_date) && (
        <View style={styles.dates}>
          {capsule.start_date && (
            <Text style={[styles.dateText, { color: colors.tabIconDefault }]}>
              С: {formatDate(capsule.start_date)}
            </Text>
          )}
          {capsule.end_date && (
            <Text style={[styles.dateText, { color: colors.tabIconDefault }]}>
              По: {formatDate(capsule.end_date)}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function CapsulesScreen() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colors = Colors.light;

  const loadCapsules = async () => {
    try {
      const data = await CapsuleDAO.getAll();
      setCapsules(data);
    } catch (error) {
      console.error('Error loading capsules:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить капсулы');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCapsules();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCapsules();
  };

  const handleAddCapsule = () => {
    router.push('/capsules/create');
  };

  const handleCapsulePress = (capsule: Capsule) => {
    router.push(`/capsules/${capsule.id}` as any);
  };

  const renderEmptyState = () => (
    <View style={commonScreenStyles.emptyState}>
      <Text style={[commonScreenStyles.emptyStateText, { color: colors.text }]}>
        У вас пока нет капсул
      </Text>
      <Text style={[commonScreenStyles.emptyStateSubtext, { color: colors.tabIconDefault }]}>
        Создайте свою первую капсулу для хранения вещей
      </Text>
    </View>
  );

  return (
    <View style={[commonScreenStyles.container, { backgroundColor: colors.background }]}>
      <View style={commonScreenStyles.header}>
        <Text style={[commonScreenStyles.title, { color: colors.text }]}>Капсулы</Text>
      </View>

      <FlatList
        data={capsules}
        renderItem={({ item }) => (
          <CapsuleCard capsule={item} onPress={handleCapsulePress} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={capsules.length === 0 ? styles.emptyContainer : commonScreenStyles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />

      <TouchableOpacity
        style={[commonScreenStyles.floatingButton, { backgroundColor: colors.tint }]}
        onPress={handleAddCapsule}
      >
        <PlusIcon color="#fff" width={24} height={24} viewBox="0 0 24 24" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
        borderWidth: 1,
    borderColor: 'red',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'column',
    gap: 4,
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
