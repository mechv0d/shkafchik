import { initDatabase, CategoryDAO, getDatabase } from './database';

/**
 * Migration script to convert flat category structure to hierarchical
 * This should be run once after updating the database schema
 */
export async function migrateCategoriesToHierarchy() {
  try {
    await initDatabase();
    const db = getDatabase();
    
    console.log('Starting category migration...');
    
    // Check if migration already ran by looking for parent categories
    const existingParents = await db.getAllAsync<{id: number}>(
      'SELECT id FROM Categories WHERE parent_id IS NULL AND name IN (?, ?, ?)',
      ['Одежда', 'Обувь', 'Аксессуары']
    );
    
    if (existingParents.length > 0) {
      console.log('Migration appears to have already run. Skipping.');
      return;
    }
    
    // Create parent categories
    const parentCategories = [
      { name: 'Одежда' },
      { name: 'Обувь' },
      { name: 'Аксессуары' }
    ];
    
    const parentIds: Record<string, number> = {};
    
    for (const parent of parentCategories) {
      const result = await db.runAsync(
        'INSERT INTO Categories (name, parent_id) VALUES (?, ?)',
        [parent.name, null]
      );
      parentIds[parent.name] = result.lastInsertRowId!;
      console.log(`Created parent category: ${parent.name} (ID: ${parentIds[parent.name]})`);
    }
    
    // Map existing categories to new hierarchy
    const categoryMapping: Record<string, string> = {
      'верхняя одежда': 'Одежда',
      'обувь': 'Обувь', 
      'нижняя одежда': 'Одежда',
      'аксессуары': 'Аксессуары'
    };
    
    // Update existing categories to have parent_id
    for (const [oldName, parentName] of Object.entries(categoryMapping)) {
      const parentId = parentIds[parentName];
      if (parentId) {
        await db.runAsync(
          'UPDATE Categories SET parent_id = ? WHERE name = ? AND parent_id IS NULL',
          [parentId, oldName]
        );
        console.log(`Updated ${oldName} to be child of ${parentName}`);
      }
    }
    
    // Create specific subcategories if they don't exist
    const subcategories = [
      { name: 'Футболки', parent: 'Одежда' },
      { name: 'Джинсы', parent: 'Одежда' },
      { name: 'Платья', parent: 'Одежда' },
      { name: 'Кроссовки', parent: 'Обувь' },
      { name: 'Ботинки', parent: 'Обувь' },
      { name: 'Туфли', parent: 'Обувь' },
      { name: 'Сандалии', parent: 'Обувь' },
      { name: 'Сумки', parent: 'Аксессуары' },
      { name: 'Шапки', parent: 'Аксессуары' },
      { name: 'Очки', parent: 'Аксессуары' },
      { name: 'Ювелирка', parent: 'Аксессуары' }
    ];
    
    for (const sub of subcategories) {
      const parentId = parentIds[sub.parent];
      if (parentId) {
        // Check if subcategory already exists
        const existing = await db.getFirstAsync<{id: number}>(
          'SELECT id FROM Categories WHERE name = ?',
          [sub.name]
        );
        
        if (!existing) {
          await db.runAsync(
            'INSERT INTO Categories (name, parent_id) VALUES (?, ?)',
            [sub.name, parentId]
          );
          console.log(`Created subcategory: ${sub.name} under ${sub.parent}`);
        }
      }
    }
    
    console.log('Category migration completed successfully!');
    
  } catch (error) {
    console.error('Category migration failed:', error);
    throw error;
  }
}

/**
 * Utility function to check current category structure
 */
export async function checkCategoryStructure() {
  try {
    await initDatabase();
    const categories = await CategoryDAO.getAll();
    
    console.log('Current category structure:');
    categories.forEach(cat => {
      const parentInfo = cat.parent_id ? ` (parent: ${cat.parent_id})` : ' (parent)';
      console.log(`- ${cat.name} (ID: ${cat.id})${parentInfo}`);
    });
    
    const hierarchy = await CategoryDAO.getHierarchy();
    console.log('\nHierarchical view:');
    hierarchy.forEach(parent => {
      console.log(`${parent.name}`);
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach(child => {
          console.log(`  └── ${child.name}`);
        });
      }
    });
    
  } catch (error) {
    console.error('Failed to check category structure:', error);
  }
}
