import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useUI } from '../../../store/hooks/useUI';

export const GlobalErrorDisplay: React.FC = () => {
  const { globalError, setGlobalError } = useUI();

  useEffect(() => {
    if (globalError) {
      Alert.alert('Ошибка', globalError, [
        {
          text: 'OK',
          onPress: () => setGlobalError(null),
        },
      ]);
    }
  }, [globalError, setGlobalError]);

  // Компонент не рендерит ничего, только показывает Alert
  return null;
};
