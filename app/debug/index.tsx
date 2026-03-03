import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { debugService, initDatabase, TestResult } from '../../src/api';

type TestStatus = 'idle' | 'running' | 'completed';

interface TestButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const TestButton: React.FC<TestButtonProps> = ({ title, onPress, loading, disabled }) => (
  <TouchableOpacity
    style={[
      styles.testButton,
      loading && styles.buttonDisabled,
      disabled && styles.buttonDisabled
    ]}
    onPress={onPress}
    disabled={loading || disabled}
  >
    {loading ? (
      <ActivityIndicator color="#fff" size="small" />
    ) : (
      <Text style={styles.buttonText}>{title}</Text>
    )}
  </TouchableOpacity>
);

const TestResultCard: React.FC<{ result: TestResult; index: number }> = ({ result, index }) => (
  <View
    style={[
      styles.resultCard,
      result.success ? styles.successCard : styles.errorCard
    ]}
  >
    <View style={styles.resultHeader}>
      <Text style={styles.resultIndex}>#{index + 1}</Text>
      <Text style={[
        styles.resultStatus,
        result.success ? styles.successText : styles.errorText
      ]}>
        {result.success ? '✅ УСПЕХ' : '❌ ОШИБКА'}
      </Text>
    </View>
    <Text style={styles.resultMessage}>{result.message}</Text>
    {result.error && (
      <Text style={styles.errorMessage}>Ошибка: {result.error}</Text>
    )}
    {result.data && (
      <View style={styles.dataContainer}>
        <Text style={styles.dataTitle}>Данные:</Text>
        <Text style={styles.dataContent}>
          {JSON.stringify(result.data, null, 2)}
        </Text>
      </View>
    )}
  </View>
);

export default function DebugScreen() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [dbInitialized, setDbInitialized] = useState<boolean | null>(null);
  const router = useRouter();

  const initializeDatabase = async () => {
    try {
      setTestStatus('running');
      await initDatabase();
      setDbInitialized(true);
      Alert.alert('Успех', 'База данных инициализирована');
    } catch (error) {
      setDbInitialized(false);
      Alert.alert('Ошибка', `Не удалось инициализировать базу данных: ${error}`);
    } finally {
      setTestStatus('idle');
    }
  };

  const runSingleTest = async (testName: string, testFunction: () => Promise<TestResult>) => {
    setTestStatus('running');
    try {
      const result = await testFunction();
      setTestResults(prev => [result, ...prev]);
      
      Alert.alert(
        result.success ? 'Успех' : 'Ошибка',
        result.message,
        result.error ? [{ text: 'Детали', onPress: () => console.log(result) }] : undefined
      );
    } catch (error) {
      const errorResult: TestResult = {
        success: false,
        message: `${testName}: Exception occurred`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      setTestResults(prev => [errorResult, ...prev]);
      Alert.alert('Ошибка', errorResult.message);
    } finally {
      setTestStatus('idle');
    }
  };

  const runAllTests = async () => {
    setTestStatus('running');
    try {
      const results = await debugService.runAllTests();
      setTestResults(prev => [...results, ...prev]);
      
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;
      
      Alert.alert(
        'Тесты завершены',
        `Успешно: ${successCount}, Ошибок: ${failureCount}`,
        failureCount > 0 ? [{ text: 'Детали', onPress: () => console.log(results) }] : undefined
      );
    } catch (error) {
      Alert.alert('Ошибка', `Failed to run all tests: ${error}`);
    } finally {
      setTestStatus('idle');
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
            setTestStatus('running');
            try {
              const result = await debugService.clearAllData();
              setTestResults(prev => [result, ...prev]);
              Alert.alert(
                result.success ? 'Успех' : 'Ошибка',
                result.message
              );
            } catch (error) {
              Alert.alert('Ошибка', `Failed to clear database: ${error}`);
            } finally {
              setTestStatus('idle');
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
            setTestStatus('running');
            try {
              const result = await debugService.migrateDatabase();
              setTestResults(prev => [result, ...prev]);
              Alert.alert(
                result.success ? 'Успех' : 'Ошибка',
                result.message
              );
            } catch (error) {
              Alert.alert('Ошибка', `Failed to migrate database: ${error}`);
            } finally {
              setTestStatus('idle');
            }
          }
        }
      ]
    );
  };

  const clearResults = () => {
    setTestResults([]);
  };

  React.useEffect(() => {
    // Check database status on mount
    const checkDbStatus = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (error) {
        setDbInitialized(false);
      }
    };
    checkDbStatus();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={testStatus === 'running'} onRefresh={clearResults} />
      }
    >
      <View>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <ThemedText style={styles.backText}>← Назад</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Debug</ThemedText>
      </View>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            База данных: {dbInitialized === null ? 'Проверка...' : dbInitialized ? '✅ Готова' : '❌ Ошибка'}
          </Text>
        </View>
        {/* <TouchableOpacity style={styles.logoutButton} onPress={() => router.back()}>
          <Text style={styles.logoutButtonText}>🚪 Выйти</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗄️ База данных</Text>
        <TestButton
          title="Инициализировать базу данных"
          onPress={initializeDatabase}
          loading={testStatus === 'running'}
        />
        <TestButton
          title="Очистить базу данных"
          onPress={clearDatabase}
          loading={testStatus === 'running'}
          disabled={!dbInitialized}
        />
        <TestButton
          title="Обновить базу данных (миграции)"
          onPress={migrateDatabase}
          loading={testStatus === 'running'}
          disabled={!dbInitialized}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧪 Отдельные тесты</Text>
        <TestButton
          title="Добавить простую вещь"
          onPress={() => runSingleTest('Add Simple Item', () => debugService.testAddSimpleItem())}
          loading={testStatus === 'running'}
          disabled={!dbInitialized}
        />
        <TestButton
          title="Добавить случайный тег"
          onPress={() => runSingleTest('Add Random Tag', () => debugService.testAddRandomTag())}
          loading={testStatus === 'running'}
          disabled={!dbInitialized}
        />
        <TestButton
          title="Добавить пустую капсулу"
          onPress={() => runSingleTest('Add Empty Capsule', () => debugService.testAddEmptyCapsule())}
          loading={testStatus === 'running'}
          disabled={!dbInitialized}
        />
        <TestButton
          title="Добавить капсулу с вещью"
          onPress={() => runSingleTest('Add Capsule with Item', () => debugService.testAddCapsuleWithItem())}
          loading={testStatus === 'running'}
          disabled={!dbInitialized}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Массовые операции</Text>
        <TestButton
          title="Запустить все тесты"
          onPress={runAllTests}
          loading={testStatus === 'running'}
          disabled={!dbInitialized}
        />
        <TestButton
          title="Очистить все данные"
          onPress={clearDatabase}
          loading={testStatus === 'running'}
          disabled={!dbInitialized}
        />
        <TestButton
          title="Очистить результаты"
          onPress={clearResults}
          disabled={testResults.length === 0}
        />
      </View>

      {testResults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Результаты тестов</Text>
          {testResults.map((result, index) => (
            <TestResultCard key={index} result={result} index={index} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  successCard: {
    backgroundColor: '#f0f9f0',
    borderLeftColor: '#4CAF50',
  },
  errorCard: {
    backgroundColor: '#fff5f5',
    borderLeftColor: '#f44336',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultIndex: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  successText: {
    color: '#4CAF50',
  },
  errorText: {
    color: '#f44336',
  },
  resultMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 12,
    color: '#f44336',
    fontStyle: 'italic',
  },
  dataContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  dataTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#666',
  },
  dataContent: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'monospace',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
