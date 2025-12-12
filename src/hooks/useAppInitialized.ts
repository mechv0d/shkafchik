// hooks/useAppInitialized.ts
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from "@react-native-async-storage/async-storage";

const checkAppInitialized = async (): Promise<boolean> => {
    // Например: проверка, есть ли данные в AsyncStorage
    const data = await AsyncStorage.getItem('wardrobe_initialized');
    return data === 'true';
};

export const useAppInitialized = () => {
    return useQuery({
        queryKey: ['appInitialized'],
        queryFn: checkAppInitialized,
        staleTime: Infinity,
    });
};