import React from 'react';
import { View, Text } from 'react-native';
import Button from './Button';

interface EmptyStateProps {
    title: string;
    description: string;
    buttonTitle?: string;
    onButtonPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   title,
                                                   description,
                                                   buttonTitle,
                                                   onButtonPress,
                                               }) => {
    return (
        <View className="flex-1 items-center justify-center px-8">
            <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                    {title}
                </Text>
                <Text className="text-base text-gray-600 text-center mb-6">
                    {description}
                </Text>
                {buttonTitle && onButtonPress && (
                    <Button
                        title={buttonTitle}
                        onPress={onButtonPress}
                        size="lg"
                    />
                )}
            </View>
        </View>
    );
};

export default EmptyState;