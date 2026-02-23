import React, { Component, ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 justify-center items-center p-6 bg-background">
          <View className="bg-red-50 border border-red-200 rounded-lg p-6 w-full max-w-sm">
            <Text className="text-red-800 text-xl font-bold mb-2 text-center">
              Что-то пошло не так
            </Text>
            <Text className="text-red-700 text-sm mb-4 text-center">
              Произошла непредвиденная ошибка. Приложение будет перезапущено.
            </Text>
            <TouchableOpacity
              className="bg-red-600 rounded-lg py-3 px-6"
              onPress={() => {
                this.setState({ hasError: false, error: undefined });
              }}
            >
              <Text className="text-white text-center font-semibold">Перезапустить</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
};
