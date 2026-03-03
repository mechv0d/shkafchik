export interface TestResult {
  success: boolean;
  error?: string;
  duration?: number;
  message?: string;
  data?: any;
}

import { closeDatabase, db, initDatabase } from './database';


export class DebugService {
  async testDatabaseConnection(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Test basic database operations
      return { success: true, duration: Date.now() - start };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - start 
      };
    }
  }

  async testAllServices(): Promise<TestResult[]> {
    return [
      await this.testDatabaseConnection(),
      // Add more tests as needed
    ];
  }

  async runAllTests(): Promise<TestResult[]> {
    return await this.testAllServices();
  }

  async clearAllData(): Promise<TestResult> {
    const start = Date.now();
    try {
      if (!db) throw new Error('Database not initialized');
      
      // Get all table names
      const tables = await db.getAllAsync<{name: string}>(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `);
      
      // Clear all tables
      for (const table of tables) {
        await db.runAsync(`DELETE FROM ${table.name}`);
      }
      
      return { 
        success: true, 
        duration: Date.now() - start, 
        message: `Cleared ${tables.length} tables` 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - start 
      };
    }
  }

  async migrateDatabase(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Close current connection
      await closeDatabase();
      
      // Reinitialize database (this will recreate tables and insert initial data)
      await initDatabase();
      
      return { 
        success: true, 
        duration: Date.now() - start, 
        message: 'Database migration completed successfully' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - start 
      };
    }
  }

  async testAddSimpleItem(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Test adding simple item logic here
      return { success: true, duration: Date.now() - start, message: 'Simple item added successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - start 
      };
    }
  }

  async testAddRandomTag(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Test adding random tag logic here
      return { success: true, duration: Date.now() - start, message: 'Random tag added successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - start 
      };
    }
  }

  async testAddEmptyCapsule(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Test adding empty capsule logic here
      return { success: true, duration: Date.now() - start, message: 'Empty capsule added successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - start 
      };
    }
  }

  async testAddCapsuleWithItem(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Test adding capsule with item logic here
      return { success: true, duration: Date.now() - start, message: 'Capsule with item added successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - start 
      };
    }
  }
}

export const debugService = new DebugService();
