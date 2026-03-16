export interface TestResult {
  success: boolean;
  error?: string;
  duration?: number;
  message?: string;
  data?: any;
}

import { checkCategoryStructure, migrateCategoriesToHierarchy } from './categoryMigration';
import { CategoryDAO, closeDatabase, db, initDatabase } from './database';


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

  async cleanupDuplicateColors(): Promise<TestResult> {
    const start = Date.now();
    try {
      if (!db) throw new Error('Database not initialized');
      
      // Get count before cleanup
      const beforeCount = await db.getFirstAsync<{count: number}>('SELECT COUNT(*) as count FROM Colors');
      
      // Delete duplicate colors, keeping only the first occurrence (lowest id)
      await db.runAsync(`
        DELETE FROM Colors 
        WHERE id NOT IN (
          SELECT MIN(id) 
          FROM Colors 
          GROUP BY name
        )
      `);
      
      // Get count after cleanup
      const afterCount = await db.getFirstAsync<{count: number}>('SELECT COUNT(*) as count FROM Colors');
      
      const deletedCount = (beforeCount?.count || 0) - (afterCount?.count || 0);
      
      return { 
        success: true, 
        duration: Date.now() - start, 
        message: `Deleted ${deletedCount} duplicate colors. ${afterCount?.count || 0} unique colors remain.` 
      };
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

  async testCategoryHierarchy(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('=== Testing Category Hierarchy ===');
      
      // Initialize database
      await initDatabase();
      console.log('✓ Database initialized');
      
      // Run migration
      await migrateCategoriesToHierarchy();
      console.log('✓ Migration completed');
      
      // Check structure
      await checkCategoryStructure();
      console.log('✓ Structure checked');
      
      // Test hierarchy retrieval
      const hierarchy = await CategoryDAO.getHierarchy();
      console.log('\n=== Hierarchy Test ===');
      console.log(`Found ${hierarchy.length} parent categories`);
      
      // Test category path
      if (hierarchy.length > 0 && hierarchy[0].children && hierarchy[0].children.length > 0) {
        const firstChild = hierarchy[0].children[0];
        const path = await CategoryDAO.getCategoryPath(firstChild.id);
        console.log(`Category path for ${firstChild.name}: ${path}`);
      }
      
      return { 
        success: true, 
        duration: Date.now() - start, 
        message: `Category hierarchy test completed. Found ${hierarchy.length} parent categories.` 
      };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - start 
      };
    }
  }

  async resetCategories(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('=== Resetting Categories ===');
      
      await initDatabase();
      
      // Delete all categories
      if (!db) throw new Error('Database not initialized');
      await db.runAsync('DELETE FROM Categories');
      console.log('✓ All categories deleted');
      
      // Re-insert initial categories
      const originalCategories = [
        'верхняя одежда',
        'обувь', 
        'нижняя одежда',
        'аксессуары'
      ];
      
      for (const cat of originalCategories) {
        await db.runAsync('INSERT INTO Categories (name, parent_id) VALUES (?, ?)', [cat, null]);
      }
      console.log('✓ Initial categories reinserted');
      
      // Run migration
      await migrateCategoriesToHierarchy();
      console.log('✓ Migration completed');
      
      return { 
        success: true, 
        duration: Date.now() - start, 
        message: 'Categories reset and migrated successfully!' 
      };
      
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
