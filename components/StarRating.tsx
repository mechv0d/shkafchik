import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  useThemedText?: boolean;
  size?: number;
  color?: string;
  unselectedColor?: string;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  useThemedText = false,
  size = 24,
  color = '#000',
  unselectedColor = '#ccc'
}: StarRatingProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onRatingChange(i)}
          style={styles.star}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={size}
            color={i <= rating ? color : unselectedColor}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.starsContainer}>
      {renderStars()}
    </View>
  );
}

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 8,
  },
});
