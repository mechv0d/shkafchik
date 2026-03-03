import { ThemedText } from '@/components/themed-text';
import { ItemWithDetails } from '@/src/models';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ItemCardProps {
  item: ItemWithDetails;
  isFeatured?: boolean;
}

export function ItemCard({ item, isFeatured = false }: ItemCardProps) {
  const getImageSource = () => {
    if (item.images && item.images.length > 0) {
      return { uri: item.images[0].file_path };
    }
    return require('@/assets/images/icon.png');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <View style={[styles.card, isFeatured && styles.featuredCard]}>
      <Image 
        source={getImageSource()} 
        style={[styles.image, isFeatured && styles.featuredImage]}
        contentFit="cover"
      />
      <ThemedText style={[styles.name, isFeatured && styles.featuredName]} numberOfLines={2}>
        {item.name}
      </ThemedText>
      <ThemedText style={[styles.price, isFeatured && styles.featuredPrice]}>
        {item.attributes.find(attr => attr.attribute_type === 'price')?.value || 'Цена не указана'}
      </ThemedText>
      <ThemedText style={[styles.date, isFeatured && styles.featuredDate]}>
        {formatDate(item.date_created)}
      </ThemedText>
      <ThemedText style={[styles.status, isFeatured && styles.featuredStatus]}>
        {item.status.name}
      </ThemedText>
      
      {/* All attributes section */}
      <View style={styles.attributesContainer}>
        {item.attributes
          .filter(attr => attr.attribute_type !== 'price') // Exclude price as it's already shown
          .map((attr, index) => (
            <View key={attr.id || index} style={styles.attributeRow}>
              <ThemedText style={styles.attributeType}>
                {attr.attribute_type}:
              </ThemedText>
              <ThemedText style={styles.attributeValue}>
                {attr.value}
              </ThemedText>
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    minHeight: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredCard: {
    minHeight: 300,
    marginHorizontal: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  featuredImage: {
    height: 200,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    minHeight: 36,
  },
  featuredName: {
    fontSize: 18,
    minHeight: 48,
  },
  price: {
    fontSize: 13,
    color: '#007AFF',
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  featuredDate: {
    fontSize: 14,
  },
  status: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  featuredStatus: {
    fontSize: 14,
  },
  attributesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  attributeType: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  attributeValue: {
    fontSize: 11,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
});
