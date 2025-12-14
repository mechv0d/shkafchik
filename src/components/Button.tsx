import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
                                           title,
                                           onPress,
                                           variant = 'primary',
                                           size = 'md',
                                           disabled = false,
                                           loading = false,
                                           className = '',
                                           icon,
                                           fullWidth = false,
                                       }) => {
    const getVariantStyles = () => {
        const baseStyles = 'items-center justify-center transition-all duration-200';

        switch (variant) {
            case 'primary':
                return `${baseStyles} bg-primary-500 active:bg-primary-600 shadow-button`;
            case 'secondary':
                return `${baseStyles} bg-secondary-100 active:bg-secondary-200 border border-secondary-300`;
            case 'outline':
                return `${baseStyles} bg-transparent border-2 border-primary-500 active:bg-primary-50`;
            case 'gradient':
                return `${baseStyles} btn-gradient active:scale-95`;
            case 'success':
                return `${baseStyles} bg-success-500 active:bg-success-600 shadow-button`;
            case 'danger':
                return `${baseStyles} bg-danger-500 active:bg-danger-600 shadow-button`;
            default:
                return `${baseStyles} bg-primary-500 active:bg-primary-600 shadow-button`;
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-2 rounded-xl';
            case 'md':
                return 'px-4 py-3 rounded-xl';
            case 'lg':
                return 'px-6 py-4 rounded-2xl';
            default:
                return 'px-4 py-3 rounded-xl';
        }
    };

    const getTextStyles = () => {
        const baseText = 'font-semibold text-center';
        switch (variant) {
            case 'outline':
                return `${baseText} text-primary-600`;
            case 'secondary':
                return `${baseText} text-secondary-700`;
            default:
                return `${baseText} text-white`;
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'sm':
                return 'text-sm';
            case 'lg':
                return 'text-lg';
            default:
                return 'text-base';
        }
    };

    const getActivityIndicatorColor = () => {
        switch (variant) {
            case 'outline':
            case 'secondary':
                return '#3B82F6';
            default:
                return '#FFFFFF';
        }
    };

    return (
        <TouchableOpacity
            className={`
                ${getVariantStyles()}
                ${getSizeStyles()}
                ${fullWidth ? 'w-full' : ''}
                ${disabled || loading ? 'opacity-60' : 'active:scale-95'}
                ${className}
            `}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            <View className="flex-row items-center justify-center">
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={getActivityIndicatorColor()}
                        className="mr-2"
                    />
                ) : icon ? (
                    <View className="mr-2">{icon}</View>
                ) : null}

                <Text className={`${getTextStyles()} ${getTextSize()}`}>
                    {loading ? 'Загрузка...' : title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default Button;