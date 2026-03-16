
/**
 * Database migration script to add parent_id column to Categories table
 * This should be run once to upgrade existing databases
 * This migration is now deprecated and should not be used
 */
export async function migrateDatabase() {
  try {
    console.log('Starting database migration...');
    
    // Get the database instance that should already be initialized
    const { getDatabase } = await import('./database');
    const db = getDatabase();
    
    if (!db) {
      console.log('Database not initialized, skipping migration');
      return;
    }
    
    // Check if Categories table exists
    const tableInfo = await db.getAllAsync<{name: string}>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Categories'"
    );
    const categoriesTableExists = tableInfo.length > 0;
    
    if (!categoriesTableExists) {
      console.log('Categories table does not exist yet, skipping migration');
      return;
    }
    
    // Check if parent_id column already exists
    const columnInfo = await db.getAllAsync<{name: string}>('PRAGMA table_info(Categories)');
    const hasParentId = columnInfo.some(column => column.name === 'parent_id');
    
    // Check if there are existing categories (to determine if this is a new database)
    const existingCategories = await db.getAllAsync<{id: number}>('SELECT id FROM Categories LIMIT 1');
    const hasExistingData = existingCategories.length > 0;
    
    if (!hasParentId) {
      console.log('Adding parent_id column to Categories table...');
      
      // Add parent_id column
      await db.execAsync(`
        ALTER TABLE Categories ADD COLUMN parent_id INTEGER REFERENCES Categories (id) ON DELETE SET NULL
      `);
      
      console.log('✓ parent_id column added');
      
      // Add index for performance
      await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON Categories (parent_id)
      `);
      
      console.log('✓ parent_id index added');
      
      // Only run category hierarchy migration if there's existing data
      if (hasExistingData) {
        const { migrateCategoriesToHierarchy } = await import('./categoryMigration');
        await migrateCategoriesToHierarchy();
        console.log('✓ Category hierarchy migration completed');
      } else {
        console.log('New database detected, skipping category hierarchy migration');
      }
      
    } else {
      console.log('parent_id column already exists, checking hierarchy...');
      
      // Only run category hierarchy migration if there's existing data and no proper hierarchy
      if (hasExistingData) {
        const { migrateCategoriesToHierarchy } = await import('./categoryMigration');
        await migrateCategoriesToHierarchy();
        console.log('✓ Category hierarchy migration completed');
      } else {
        console.log('New database with schema, skipping category hierarchy migration');
      }
    }
    
    console.log('Database migration completed successfully!');
    
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  }
}

/**
 * Reset database completely (for development/testing)
 */
export async function resetDatabase() {
  try {
    console.log('Resetting database...');
    
    // Get the database instance
    const { getDatabase } = await import('./database');
    const db = getDatabase();
    
    if (!db) {
      console.log('Database not initialized, nothing to reset');
      return;
    }
    
    // Drop all tables
    await db.execAsync(`
      DROP TABLE IF EXISTS ItemTags;
      DROP TABLE IF EXISTS CapsuleItems;
      DROP TABLE IF EXISTS CategoryFilterValues;
      DROP TABLE IF EXISTS Filters;
      DROP TABLE IF EXISTS Settings;
      DROP TABLE IF EXISTS Capsules;
      DROP TABLE IF EXISTS Tags;
      DROP TABLE IF EXISTS Attributes;
      DROP TABLE IF EXISTS Images;
      DROP TABLE IF EXISTS Items;
      DROP TABLE IF EXISTS Colors;
      DROP TABLE IF EXISTS ItemStatuses;
      DROP TABLE IF EXISTS Categories;
    `);
    
    console.log('✓ All tables dropped');
    
    // Reinitialize database (will recreate tables with new schema)
    const { initDatabase } = await import('./database');
    await initDatabase();
    
    console.log('✓ Database reset and reinitialized');
    
  } catch (error) {
    console.error('Database reset failed:', error);
    throw error;
  }
}
