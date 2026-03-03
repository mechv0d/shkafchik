import { ThemedText } from '@/components/themed-text';
import { ItemWithDetails } from '@/src/models';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ItemCard } from './ItemCard';

interface ItemsGridProps {
  items: ItemWithDetails[];
  title?: string;
  sortBy?: 'all' | 'favorites' | 'cart' | 'purchased';
}

export function ItemsGrid({ items, title = 'Вещи', sortBy = 'all' }: ItemsGridProps) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>Вещи не найдены</ThemedText>
      </View>
    );
  }

  const renderRows = () => {
    const rows = [];

    // Все карточки в сетке 2 колонки
    for (let i = 0; i < items.length; i += 2) {
      const rowItems = items.slice(i, i + 2);
      rows.push(
        <View key={i} style={styles.row}>
          {rowItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {rowItems.length === 1 && <View style={styles.placeholder} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      {title && (
        <ThemedText type="subtitle" style={styles.sectionHeader}>
          {title}
        </ThemedText>
      )}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderRows()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  placeholder: {
    flex: 1,
    margin: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
