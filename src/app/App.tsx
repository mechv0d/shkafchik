import { AppProvider } from '@/src/context/AppContext';
import AddItemScreen from '@/src/screens/AddItemScreen';
import CategoriesScreen from '@/src/screens/CategoriesScreen';
import HomeScreen from '@/src/screens/HomeScreen';
import ItemDetailScreen from '@/src/screens/ItemDetailScreen';
import SearchScreen from '@/src/screens/SearchScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { AnimatedTabIcon } from '../components/icons/AnimatedTabIcon';
import { HangerIcon } from '../components/icons/HangerIcon';
import { LookDownIcon } from '../components/icons/LookDownIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { ProfileIcon } from '../components/icons/ProfileIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { ErrorBoundary } from '../components/ui/errorBoundary/ErrorBoundary';
import { GlobalErrorDisplay } from '../components/ui/errorBoundary/GlobalErrorDisplay';
import { store } from '../store/store';

export type RootStackParamList = {
  MainTabs: undefined;
  AddItem: undefined;
  ItemDetail: { itemId: string };
};

export type TabParamList = {
  Wardrobe: undefined;
  Search: undefined;
  Add: undefined;
  Categories: undefined;
  Profile: undefined;
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
          height: 50,
          paddingBottom: 4,
          paddingTop: 4,
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
        tabBarShowLabel: false,
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
        name="Wardrobe"
        component={HomeScreen}
        options={{
          title: 'Гардероб',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon iconComponent={HangerIcon} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Поиск',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon iconComponent={SearchIcon} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddItemScreen}
        options={{
          title: 'Добавить',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon iconComponent={PlusIcon} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: 'Категории',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon iconComponent={LookDownIcon} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsScreen}
        options={{
          title: 'Профиль',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon iconComponent={ProfileIcon} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    // 🟢 Оборачиваем все приложение в ErrorBoundary
    <ErrorBoundary>
      {/* 🟢 Оборачиваем все приложение в Redux Provider */}
      <Provider store={store}>
        {/* 🟢 Оборачиваем все приложение в QueryProvider */}
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
            <GlobalErrorDisplay />
          </AppProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}
