import { Colors } from '@/constants/theme';
import { Capsule } from '@/src/models';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CapsuleCardProps {
  capsule: Capsule;
  onPress?: () => void;
  showItemsCount?: boolean;
  itemsCount?: number;
}

export function CapsuleCard({ 
  capsule, 
  onPress, 
  showItemsCount = false,
  itemsCount = 0 
}: CapsuleCardProps) {
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

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {capsule.name}
        </Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(capsule.status) }]}>
            <Text style={styles.badgeText}>{capsule.status}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getTypeColor(capsule.type) }]}>
            <Text style={styles.badgeText}>{capsule.type}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        {showItemsCount && (
          <View style={styles.itemsInfo}>
            <Ionicons name="cube-outline" size={16} color={colors.tabIconDefault} />
            <Text style={[styles.itemsCount, { color: colors.tabIconDefault }]}>
              {itemsCount} вещей
            </Text>
          </View>
        )}
        
        {capsule.start_date && (
          <View style={styles.dateInfo}>
            <Ionicons name="calendar-outline" size={16} color={colors.tabIconDefault} />
            <Text style={[styles.dateText, { color: colors.tabIconDefault }]}>
              {new Date(capsule.start_date).toLocaleDateString('ru-RU')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  cardContent: {
    gap: 4,
  },
  itemsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemsCount: {
    fontSize: 13,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 13,
  },
});
