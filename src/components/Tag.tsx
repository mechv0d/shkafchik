import React from 'react';
import { View, Text } from 'react-native';
import { Tag as TagType } from '../types';

interface TagProps {
    tag: TagType;
    onPress?: () => void;
    size?: 'sm' | 'md';
}

const Tag: React.FC<TagProps> = ({ tag, onPress, size = 'md' }) => {
    const getTextSize = () => {
        return size === 'sm' ? 'text-xs' : 'text-sm';
    };

    const getPadding = () => {
        return size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5';
    };

    return (
        <View
            className={`
        ${getPadding()}
        rounded-full
        border
        border-gray-200
        ${onPress ? 'active:opacity-70' : ''}
      `}
            style={{ backgroundColor: tag.color }}
            onTouchEnd={onPress}
        >
            <Text className={`${getTextSize()} font-medium text-white`}>
                {tag.name}
            </Text>
        </View>
    );
};

export default Tag;