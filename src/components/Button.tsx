import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
                                           title,
                                           onPress,
                                           variant = 'primary',
                                           size = 'md',
                                           disabled = false,
                                           loading = false,
                                           className = '',
                                       }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return 'bg-primary';
            case 'secondary':
                return 'bg-secondary';
            case 'outline':
                return 'bg-transparent border border-primary';
            default:
                return 'bg-primary';
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-2';
            case 'md':
                return 'px-4 py-3';
            case 'lg':
                return 'px-6 py-4';
            default:
                return 'px-4 py-3';
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'outline':
                return 'text-primary';
            default:
                return 'text-white';
        }
    };

    return (
        <TouchableOpacity
            className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        rounded-lg
        items-center
        justify-center
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator size="small" color={variant === 'outline' ? '#3B82F6' : '#FFFFFF'} />
            ) : (
                <Text className={`${getTextColor()} font-semibold text-base`}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;