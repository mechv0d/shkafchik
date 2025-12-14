import { AppProvider } from '@/src/context/AppContext';
import AddItemScreen from '@/src/screens/AddItemScreen';
import HomeScreen from '@/src/screens/HomeScreen';
import ItemDetailScreen from '@/src/screens/ItemDetailScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

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
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9',
        },
        headerTintColor: '#0F172A',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          color: '#0F172A',
        },
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Мой гардероб',
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center ${focused ? 'scale-110' : ''}`}>
              <Text className="text-2xl mb-1">{focused ? '👔' : '👕'}</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Настройки',
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center ${focused ? 'scale-110' : ''}`}>
              <Text className="text-2xl mb-1">{focused ? '⚙️' : '🔧'}</Text>
            </View>
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
            <StatusBar style="auto" />
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#FFFFFF',
                },
                headerTintColor: '#0F172A',
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#0F172A',
                },
                headerShadowVisible: false,
                contentStyle: {
                  backgroundColor: '#FFFFFF',
                },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddItem"
                component={AddItemScreen}
                options={{
                  title: 'Новая вещь',
                  presentation: 'modal',
                  headerStyle: {
                    backgroundColor: '#FFFFFF',
                  },
                  headerTintColor: '#0F172A',
                  headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#0F172A',
                  },
                }}
              />
              <Stack.Screen
                name="ItemDetail"
                component={ItemDetailScreen}
                options={{
                  title: 'Детали вещи',
                  headerStyle: {
                    backgroundColor: '#FFFFFF',
                  },
                  headerTintColor: '#0F172A',
                  headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#0F172A',
                  },
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
