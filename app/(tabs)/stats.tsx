import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CapsuleDAO, initDatabase, ItemDAO, TagDAO } from '@/src/api/database';
import { debugService } from '@/src/api/debugService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function StatsScreen() {
  const [stats, setStats] = useState({
    items: 0,
    capsules: 0,
    tags: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      await initDatabase();
      const items = await ItemDAO.getAll();
      const capsules = await CapsuleDAO.getAll();
      const tags = await TagDAO.getAll();
      setStats({
        items: items.length,
        capsules: capsules.length,
        tags: tags.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const clearDatabase = () => {
    Alert.alert(
      'Предупреждение',
      'Это действие удалит ВСЕ данные из базы данных. Вы уверены?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await debugService.clearAllData();
              Alert.alert(
                result.success ? 'Успех' : 'Ошибка',
                result.message
              );
              if (result.success) {
                await loadStats(); // Reload stats after clearing
                // Refresh items screen if it exists
                if ((global as any).refreshItems) {
                  (global as any).refreshItems();
                }
              }
            } catch (error) {
              Alert.alert('Ошибка', `Failed to clear database: ${error}`);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const cleanupColors = () => {
    Alert.alert(
      'Очистка дубликатов',
      'Это действие удалит все дублирующиеся цвета из базы данных. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'default',
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await debugService.cleanupDuplicateColors();
              Alert.alert(
                result.success ? 'Успех' : 'Ошибка',
                result.message || (result.error ? 'Произошла ошибка' : '')
              );
            } catch (error) {
              Alert.alert('Ошибка', `Failed to cleanup colors: ${error}`);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const migrateDatabase = () => {
    Alert.alert(
      'Предупреждение',
      'Это действие выполнит миграцию базы данных. Все данные будут сохранены, но структура может измениться. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Обновить',
          style: 'default',
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await debugService.migrateDatabase();
              Alert.alert(
                result.success ? 'Успех' : 'Ошибка',
                result.message
              );
              if (result.success) {
                await loadStats(); // Reload stats after migration
                // Refresh items screen if it exists
                if ((global as any).refreshItems) {
                  (global as any).refreshItems();
                }
              }
            } catch (error) {
              Alert.alert('Ошибка', `Failed to migrate database: ${error}`);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Статистика</ThemedText>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText type="subtitle">Вещи</ThemedText>
          <ThemedText style={styles.statNumber}>{stats.items}</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <ThemedText type="subtitle">Капсулы</ThemedText>
          <ThemedText style={styles.statNumber}>{stats.capsules}</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <ThemedText type="subtitle">Теги</ThemedText>
          <ThemedText style={styles.statNumber}>{stats.tags}</ThemedText>
          <TouchableOpacity
            style={styles.tagsButton}
            onPress={() => router.push('/tags' as any)}
          >
            <ThemedText style={styles.tagsButtonText}>Управлять</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.debugSection}>
        <ThemedText type="subtitle" style={styles.debugTitle}>Debug</ThemedText>
        <TouchableOpacity 
          style={[styles.debugButton, styles.clearButton]} 
          onPress={clearDatabase}
          disabled={isLoading}
        >
          <ThemedText style={styles.debugButtonText}>Очистить базу данных</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.debugButton, styles.cleanupButton]} 
          onPress={cleanupColors}
          disabled={isLoading}
        >
          <ThemedText style={styles.debugButtonText}>Очистить дубликаты цветов</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.debugButton, styles.migrateButton]} 
          onPress={migrateDatabase}
          disabled={isLoading}
        >
          <ThemedText style={styles.debugButtonText}>Обновить базу данных (миграции)</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    minWidth: 100,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  debugSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  debugTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  debugButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  cleanupButton: {
    backgroundColor: '#FF9500',
  },
  migrateButton: {
    backgroundColor: '#007AFF',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tagsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 8,
  },
  tagsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
