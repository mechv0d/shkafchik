import React from 'react';
import {NavigationContainer, NavigationIndependentTree} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'expo-status-bar';
import {AppProvider} from '@/src/context/AppContext';
import HomeScreen from '@/src/screens/HomeScreen';
import AddItemScreen from '@/src/screens/AddItemScreen';
import ItemDetailScreen from '@/src/screens/ItemDetailScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';
import TabBarIcon from '@/src/components/TabBarIcon';
import {QueryProvider} from "@/src/providers/QueryProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export type RootStackParamList = {
    MainTabs: undefined;
    AddItem: undefined;
    ItemDetail: { itemId: string };
};

export type TabParamList = {
    Home: undefined;
    Settings: undefined;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60,
        },
    },
});

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#E5E5E5',
                },
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#6B7280',
                headerStyle: {
                    backgroundColor: '#3B82F6',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Гардероб',
                    tabBarIcon: ({color, size}) => (
                        <TabBarIcon icon="👕" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Настройки',
                    tabBarIcon: ({color, size}) => (
                        <TabBarIcon icon="⚙️" color={color} size={size}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default function App() {
    return (
        // 🟢 Оборачиваем все приложение в QueryProvider
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <NavigationIndependentTree>
                    <NavigationContainer>
                        <StatusBar style="auto"/>
                        <Stack.Navigator
                            screenOptions={{
                                headerStyle: {
                                    backgroundColor: '#3B82F6',
                                },
                                headerTintColor: '#FFFFFF',
                                headerTitleStyle: {
                                    fontWeight: '600',
                                },
                                contentStyle: {
                                    backgroundColor: '#F9FAFB',
                                },
                            }}
                        >
                            <Stack.Screen
                                name="MainTabs"
                                component={TabNavigator}
                                options={{headerShown: false}}
                            />
                            <Stack.Screen
                                name="AddItem"
                                component={AddItemScreen}
                                options={{
                                    title: 'Добавить вещь',
                                    presentation: 'modal',
                                }}
                            />
                            <Stack.Screen
                                name="ItemDetail"
                                component={ItemDetailScreen}
                                options={{
                                    title: 'Детали вещи',
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </NavigationIndependentTree>
            </AppProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}