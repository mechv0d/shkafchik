import { Capsule } from '@/src/models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CapsuleCard } from './CapsuleCard';

interface CapsulesGridProps {
  capsules: Capsule[];
  title?: string;
  showItemsCount?: boolean;
  itemsCounts?: Record<number, number>;
  onCapsulePress?: (capsule: Capsule) => void;
}

export function CapsulesGrid({ 
  capsules, 
  title,
  showItemsCount = false,
  itemsCounts = {},
  onCapsulePress
}: CapsulesGridProps) {
  if (capsules.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {title && <View style={styles.sectionHeader} />}
      <View style={styles.grid}>
        {capsules.map((capsule) => (
          <CapsuleCard
            key={capsule.id}
            capsule={capsule}
            onPress={() => onCapsulePress?.(capsule)}
            showItemsCount={showItemsCount}
            itemsCount={itemsCounts[capsule.id] || 0}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
});
