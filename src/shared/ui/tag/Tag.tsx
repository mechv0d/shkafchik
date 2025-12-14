import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Tag as TagType } from '../../../types';

interface TagProps {
  tag: TagType;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'subtle';
  selected?: boolean;
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  tag,
  onPress,
  size = 'md',
  variant = 'filled',
  selected = false,
  className = '',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getVariantStyles = () => {
    if (selected) {
      return 'bg-primary-500 border-primary-600 text-white shadow-sm';
    }

    switch (variant) {
      case 'filled':
        return 'text-white border-transparent shadow-sm';
      case 'outline':
        return 'bg-transparent border-primary-300 text-primary-700';
      case 'subtle':
        return 'bg-primary-50 border-primary-200 text-primary-700';
      default:
        return 'text-white border-transparent shadow-sm';
    }
  };

  const TagComponent = onPress ? TouchableOpacity : View;

  const tagStyle = {
    backgroundColor: variant === 'filled' && !selected ? tag.color : undefined,
    borderColor: variant === 'filled' && !selected ? tag.color : undefined,
  };

  return (
    <TagComponent
      className={`
                ${getSizeStyles()}
                ${getVariantStyles()}
                rounded-full border font-medium
                items-center justify-center
                transition-all duration-200
                ${onPress ? 'active:scale-95' : ''}
                ${selected ? 'ring-2 ring-primary-200 ring-offset-1' : ''}
                ${className}
            `}
      style={tagStyle}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        className={`
                    font-semibold text-center
                    ${selected || variant === 'filled' ? 'text-white' : 'text-primary-700'}
                `}
        numberOfLines={1}
      >
        {tag.name}
      </Text>
    </TagComponent>
  );
};

export default Tag;
