import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../button';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  icon?: string;
  variant?: 'default' | 'search' | 'favorites';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonTitle,
  onButtonPress,
  icon,
  variant = 'default',
}) => {
  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case 'search':
        return '🔍';
      case 'favorites':
        return '❤️';
      default:
        return '👕';
    }
  };

  const getSubtitle = () => {
    switch (variant) {
      case 'search':
        return 'Попробуйте изменить поисковый запрос';
      case 'favorites':
        return 'Добавьте вещи в избранное, чтобы видеть их здесь';
      default:
        return 'Начните с добавления первой вещи в ваш гардероб';
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="card-elegant p-8 items-center max-w-sm w-full">
        {/* Иконка */}
        <View className="w-20 h-20 bg-primary-100 rounded-3xl items-center justify-center mb-6 animate-bounce-subtle">
          <Text className="text-4xl">{getIcon()}</Text>
        </View>

        {/* Заголовок */}
        <Text className="text-2xl font-bold text-text-primary text-center mb-3 leading-8">
          {title}
        </Text>

        {/* Описание */}
        <Text className="text-base text-text-secondary text-center mb-2 leading-6">
          {description}
        </Text>

        {/* Подзаголовок */}
        <Text className="text-sm text-text-tertiary text-center mb-8 leading-5">
          {getSubtitle()}
        </Text>

        {/* Кнопка */}
        {buttonTitle && onButtonPress && (
          <Button
            title={buttonTitle}
            onPress={onButtonPress}
            variant="gradient"
            size="lg"
            fullWidth
            className="animate-scale-in"
          />
        )}

        {/* Декоративные элементы */}
        <View className="flex-row mt-6 space-x-2">
          <View
            className="w-2 h-2 bg-primary-200 rounded-full animate-pulse"
            style={{ animationDelay: '0s' }}
          />
          <View
            className="w-2 h-2 bg-primary-300 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          />
          <View
            className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          />
        </View>
      </View>
    </View>
  );
};

export default EmptyState;
