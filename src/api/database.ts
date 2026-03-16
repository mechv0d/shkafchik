import * as SQLite from 'expo-sqlite';
import {
    Attribute,
    Capsule,
    Category,
    Color,
    Image,
    Item,
    ItemStatus,
    ItemWithDetails,
    Tag
} from '../models';

// Database connection
let db: SQLite.SQLiteDatabase | null = null;

// Database initialization
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    try {
      // Test if the connection is still valid
      await db.getFirstAsync('SELECT 1');
      return db;
    } catch (error) {
      console.log('Database connection is invalid, reinitializing...');
      db = null;
    }
  }
  
  try {
    console.log('Initializing database connection...');
    db = await SQLite.openDatabaseAsync('shkafchik.db');
    
    // Create tables (will skip existing ones)
    await createTables();
    
    await insertInitialData();
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    db = null;
    throw error;
  }
};

// Run database migrations
const runMigrations = async () => {
  if (!db) throw new Error('Database not initialized');
  
  try {
    // Add is_favorite column to Items table if it doesn't exist
    await db.execAsync(`
      ALTER TABLE Items ADD COLUMN is_favorite INTEGER DEFAULT 0;
    `);
    console.log('Added is_favorite column to Items table');
  } catch (error) {
    // Column might already exist, which is fine
    console.log('is_favorite column already exists or migration not needed');
  }
};

// Create tables based on SQL schema
const createTables = async () => {
  if (!db) throw new Error('Database not initialized');
  
  const tables = [
    // Categories table
    `CREATE TABLE IF NOT EXISTS Categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      parent_id INTEGER,
      date_created TEXT DEFAULT CURRENT_TIMESTAMP,
      date_modified TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES Categories (id) ON DELETE SET NULL
    );`,
    
    // ItemStatuses table
    `CREATE TABLE IF NOT EXISTS ItemStatuses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );`,
    
    // Colors table
    `CREATE TABLE IF NOT EXISTS Colors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      hex_code TEXT NOT NULL
    );`,
    
    // Items table
    `CREATE TABLE IF NOT EXISTS Items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      status_id INTEGER NOT NULL,
      is_favorite INTEGER DEFAULT 0,
      date_created TEXT DEFAULT CURRENT_TIMESTAMP,
      date_modified TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE RESTRICT,
      FOREIGN KEY (status_id) REFERENCES ItemStatuses (id) ON DELETE RESTRICT
    );`,
    
    // Images table
    `CREATE TABLE IF NOT EXISTS Images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      file_path TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (item_id) REFERENCES Items (id) ON DELETE CASCADE
    );`,
    
    // Attributes table
    `CREATE TABLE IF NOT EXISTS Attributes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      attribute_type TEXT NOT NULL,
      value TEXT,
      FOREIGN KEY (item_id) REFERENCES Items (id) ON DELETE CASCADE
    );`,
    
    // Tags table
    `CREATE TABLE IF NOT EXISTS Tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      color_id INTEGER,
      FOREIGN KEY (color_id) REFERENCES Colors (id) ON DELETE SET NULL
    );`,
    
    // ItemTags table
    `CREATE TABLE IF NOT EXISTS ItemTags (
      item_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (item_id, tag_id),
      FOREIGN KEY (item_id) REFERENCES Items (id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES Tags (id) ON DELETE CASCADE
    );`,
    
    // Capsules table
    `CREATE TABLE IF NOT EXISTS Capsules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'активная' CHECK (status IN ('активная', 'архивная', 'черновик')),
      type TEXT DEFAULT 'постоянная' CHECK (type IN ('постоянная', 'временная'))
    );`,
    
    // CapsuleItems table
    `CREATE TABLE IF NOT EXISTS CapsuleItems (
      capsule_id INTEGER,
      item_id INTEGER,
      packing_status TEXT DEFAULT 'не упаковано',
      PRIMARY KEY (capsule_id, item_id),
      FOREIGN KEY (capsule_id) REFERENCES Capsules (id) ON DELETE CASCADE,
      FOREIGN KEY (item_id) REFERENCES Items (id) ON DELETE CASCADE
    );`,
    
    // Settings table
    `CREATE TABLE IF NOT EXISTS Settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );`,
    
    // Filters table
    `CREATE TABLE IF NOT EXISTS Filters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      filter_type TEXT
    );`,
    
    // CategoryFilterValues table
    `CREATE TABLE IF NOT EXISTS CategoryFilterValues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      filter_id INTEGER,
      value TEXT,
      FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE CASCADE,
      FOREIGN KEY (filter_id) REFERENCES Filters (id) ON DELETE CASCADE
    );`
  ];
  
  for (const table of tables) {
    await db.execAsync(table);
  }
  
  // Create indexes
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_items_category_id ON Items (category_id);',
    'CREATE INDEX IF NOT EXISTS idx_items_status_id ON Items (status_id);',
    'CREATE INDEX IF NOT EXISTS idx_items_date_created ON Items (date_created);',
    'CREATE INDEX IF NOT EXISTS idx_tags_name ON Tags (name);',
    'CREATE INDEX IF NOT EXISTS idx_item_tags_tag_id ON ItemTags (tag_id);',
    'CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON Categories (parent_id);'
  ];
  
  for (const index of indexes) {
    await db.execAsync(index);
  }
  
  // Run migrations for existing databases
  await runMigrations();
};

// Clean up duplicate colors
const cleanupDuplicateColors = async () => {
  if (!db) throw new Error('Database not initialized');
  
  // Delete duplicate colors, keeping only the first occurrence (lowest id)
  await db.runAsync(`
    DELETE FROM Colors 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM Colors 
      GROUP BY name
    )
  `);
};

// Insert initial data
const insertInitialData = async () => {
  if (!db) throw new Error('Database not initialized');
  
  // Insert item statuses
  const statuses = [
    'в использовании',
    'на хранении',
    'на выброс/в переработку',
    'потеряна/отдана'
  ];
  
  for (const status of statuses) {
    await db.runAsync('INSERT OR IGNORE INTO ItemStatuses (name) VALUES (?)', [status]);
  }
  
  // Insert basic categories (migration will handle hierarchy)
  const categories = [
    'верхняя одежда',
    'обувь',
    'нижняя одежда',
    'аксессуары'
  ];
  
  for (const cat of categories) {
    await db.runAsync('INSERT OR IGNORE INTO Categories (name) VALUES (?)', [cat]);
  }
  
  // Insert colors
  const colors = [
    ['Чёрный', '#000000'],
    ['Белый', '#FFFFFF'],
    ['Серый', '#808080'],
    ['Тёмно-серый', '#A9A9A9'],
    ['Светло-серый', '#D3D3D3'],
    ['Бежевый', '#F5F5DC'],
    ['Кремовый', '#FFFDD0'],
    ['Слоновая кость', '#FFFFF0'],
    ['Коричневый', '#A52A2A'],
    ['Тёмно-коричневый', '#654321'],
    ['Синий', '#0000FF'],
    ['Тёмно-синий', '#000080'],
    ['Голубой', '#ADD8E6'],
    ['Небесно-голубой', '#87CEEB'],
    ['Бирюзовый', '#40E0D0'],
    ['Индиго', '#4B0082'],
    ['Васильковый', '#6495ED'],
    ['Зелёный', '#008000'],
    ['Тёмно-зелёный', '#006400'],
    ['Оливковый', '#808000'],
    ['Мятный', '#98FF98'],
    ['Изумрудный', '#50C878'],
    ['Салатовый', '#99FF99'],
    ['Красный', '#FF0000'],
    ['Бордовый', '#800000'],
    ['Винный', '#722F37'],
    ['Алый', '#FF2400'],
    ['Розовый', '#FFC0CB'],
    ['Пудровый', '#FDE9E0'],
    ['Коралловый', '#FF7F50'],
    ['Фуксия', '#FF00FF'],
    ['Жёлтый', '#FFFF00'],
    ['Горчичный', '#FFDB58'],
    ['Оранжевый', '#FFA500'],
    ['Персиковый', '#FFDAB9'],
    ['Фиолетовый', '#800080'],
    ['Сиреневый', '#C8A2C8'],
    ['Лавандовый', '#E6E6FA'],
    ['Песочный', '#C2B280'],
    ['Хаки', '#C3B091']
  ];
  
  for (const [name, hex] of colors) {
    await db.runAsync('INSERT OR IGNORE INTO Colors (name, hex_code) VALUES (?, ?)', [name, hex]);
  }
  
  // Clean up any duplicate colors that might exist
  await cleanupDuplicateColors();
  
  // Insert initial tags
  const tags = [
    ['Домашнее', 'Светло-серый'],
    ['Выходное', 'Красный'],
    ['Парадное', 'Жёлтый'],
    ['Деловое', 'Тёмно-синий'],
    ['На выброс', 'Коричневый']
  ];
  
  for (const [tagName, colorName] of tags) {
    await db.runAsync(`
      INSERT OR IGNORE INTO Tags (name, color_id) 
      VALUES (?, (SELECT id FROM Colors WHERE name = ?))
    `, [tagName, colorName]);
  }
};

// DAO (Data Access Object) classes

export class CategoryDAO {
  static async create(category: Omit<Category, 'id' | 'date_created' | 'date_modified'>): Promise<number> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'INSERT INTO Categories (name, parent_id) VALUES (?, ?)',
      [category.name, category.parent_id || null]
    );
    
    return result.lastInsertRowId!;
  }
  
  static async getAll(): Promise<Category[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Category>('SELECT * FROM Categories ORDER BY name');
    return rows;
  }
  
  static async getById(id: number): Promise<Category | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<Category>('SELECT * FROM Categories WHERE id = ?', [id]);
    return row || null;
  }
  
  static async getByName(name: string): Promise<Category | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<Category>('SELECT * FROM Categories WHERE name = ?', [name]);
    return row || null;
  }
  
  static async update(id: number, category: Partial<Category>): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const fields = [];
    const values = [];
    
    if (category.name) {
      fields.push('name = ?');
      values.push(category.name);
    }
    
    fields.push('date_modified = CURRENT_TIMESTAMP');
    values.push(id);
    
    const result = await db.runAsync(
      `UPDATE Categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return result.changes > 0;
  }
  
  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync('DELETE FROM Categories WHERE id = ?', [id]);
    return result.changes > 0;
  }
  
  static async getParents(): Promise<Category[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Category>(
      'SELECT * FROM Categories WHERE parent_id IS NULL ORDER BY name'
    );
    return rows;
  }
  
  static async getChildren(parentId: number): Promise<Category[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Category>(
      'SELECT * FROM Categories WHERE parent_id = ? ORDER BY name',
      [parentId]
    );
    return rows;
  }
  
  static async getHierarchy(): Promise<Category[]> {
    if (!db) throw new Error('Database not initialized');
    
    const allCategories = await this.getAll();
    const categoryMap = new Map<number, Category>();
    
    // Create map of all categories
    allCategories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });
    
    // Build hierarchy
    const parents: Category[] = [];
    categoryMap.forEach(category => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children!.push(category);
        }
      } else {
        parents.push(category);
      }
    });
    
    return parents;
  }
  
  static async getCategoryPath(categoryId: number): Promise<string> {
    if (!db) throw new Error('Database not initialized');
    
    const path: string[] = [];
    let currentId: number | null = categoryId;
    
    while (currentId !== null) {
      const category = await this.getById(currentId);
      if (!category) break;
      
      path.unshift(category.name);
      currentId = category.parent_id || null;
    }
    
    return path.join(' → ');
  }
  
  static async getCategoryWithChildren(categoryId: number): Promise<Category | null> {
    if (!db) throw new Error('Database not initialized');
    
    const category = await this.getById(categoryId);
    if (!category) return null;
    
    const children = await this.getChildren(categoryId);
    return { ...category, children };
  }
}

export class ItemStatusDAO {
  static async getAll(): Promise<ItemStatus[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<ItemStatus>('SELECT * FROM ItemStatuses ORDER BY name');
    return rows;
  }
  
  static async getById(id: number): Promise<ItemStatus | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<ItemStatus>('SELECT * FROM ItemStatuses WHERE id = ?', [id]);
    return row || null;
  }
  
  static async getByName(name: string): Promise<ItemStatus | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<ItemStatus>('SELECT * FROM ItemStatuses WHERE name = ?', [name]);
    return row || null;
  }

  static async getFirst(): Promise<ItemStatus | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<ItemStatus>('SELECT * FROM ItemStatuses ORDER BY id LIMIT 1');
    return row || null;
  }
}

export class ColorDAO {
  static async getAll(): Promise<Color[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Color>('SELECT * FROM Colors ORDER BY name');
    return rows;
  }
  
  static async getById(id: number): Promise<Color | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<Color>('SELECT * FROM Colors WHERE id = ?', [id]);
    return row || null;
  }
}

export class ItemDAO {
  static async create(item: Omit<Item, 'id' | 'date_created' | 'date_modified'>): Promise<number> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'INSERT INTO Items (name, category_id, status_id) VALUES (?, ?, ?)',
      [item.name, item.category_id, item.status_id]
    );
    
    return result.lastInsertRowId!;
  }
  
  static async getAll(): Promise<Item[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Item>('SELECT * FROM Items ORDER BY date_created DESC');
    return rows;
  }
  
  static async getById(id: number): Promise<Item | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<Item>('SELECT * FROM Items WHERE id = ?', [id]);
    return row || null;
  }
  
  static async getWithDetails(id: number): Promise<ItemWithDetails | null> {
    if (!db) throw new Error('Database not initialized');
    
    const item = await this.getById(id);
    if (!item) return null;
    
    const category = await CategoryDAO.getById(item.category_id);
    const status = await ItemStatusDAO.getById(item.status_id);
    const images = await ImageDAO.getByItemId(id);
    const attributes = await AttributeDAO.getByItemId(id);
    const tags = await TagDAO.getByItemId(id);
    
    if (!category || !status) return null;
    
    return {
      ...item,
      category,
      status,
      images,
      attributes,
      tags
    };
  }
  
  static async update(id: number, item: Partial<Item>): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const fields = [];
    const values = [];
    
    if (item.name) {
      fields.push('name = ?');
      values.push(item.name);
    }
    
    if (item.category_id) {
      fields.push('category_id = ?');
      values.push(item.category_id);
    }
    
    if (item.status_id) {
      fields.push('status_id = ?');
      values.push(item.status_id);
    }
    
    fields.push('date_modified = CURRENT_TIMESTAMP');
    values.push(id);
    
    const result = await db.runAsync(
      `UPDATE Items SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return result.changes > 0;
  }
  
  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync('DELETE FROM Items WHERE id = ?', [id]);
    return result.changes > 0;
  }
  
  static async getByCategory(categoryId: number): Promise<Item[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Item>(
      'SELECT * FROM Items WHERE category_id = ? ORDER BY date_created DESC',
      [categoryId]
    );
    return rows;
  }
  
  static async updateFavorite(id: number, isFavorite: boolean): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'UPDATE Items SET is_favorite = ? WHERE id = ?',
      [isFavorite ? 1 : 0, id]
    );
    
    return result.changes > 0;
  }
  
  static async updateAttribute(itemId: number, attributeType: string, value: string): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'UPDATE Attributes SET value = ? WHERE item_id = ? AND attribute_type = ?',
      [value, itemId, attributeType]
    );
    
    return result.changes > 0;
  }
  
  static async createAttribute(itemId: number, attributeType: string, value: string): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'INSERT INTO Attributes (item_id, attribute_type, value) VALUES (?, ?, ?)',
      [itemId, attributeType, value]
    );
    
    return result.changes > 0;
  }
  
  static async getByStatus(statusId: number): Promise<Item[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Item>(
      'SELECT * FROM Items WHERE status_id = ? ORDER BY date_created DESC',
      [statusId]
    );
    return rows;
  }
}

export class ImageDAO {
  static async create(image: Omit<Image, 'id'>): Promise<number> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'INSERT INTO Images (item_id, file_path, display_order) VALUES (?, ?, ?)',
      [image.item_id, image.file_path, image.display_order]
    );
    
    return result.lastInsertRowId!;
  }
  
  static async getByItemId(itemId: number): Promise<Image[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Image>(
      'SELECT * FROM Images WHERE item_id = ? ORDER BY display_order',
      [itemId]
    );
    return rows;
  }
  
  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync('DELETE FROM Images WHERE id = ?', [id]);
    return result.changes > 0;
  }
  
  static async deleteByItemId(itemId: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync('DELETE FROM Images WHERE item_id = ?', [itemId]);
    return result.changes > 0;
  }
}

export class AttributeDAO {
  static async create(attribute: Omit<Attribute, 'id'>): Promise<number> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'INSERT INTO Attributes (item_id, attribute_type, value) VALUES (?, ?, ?)',
      [attribute.item_id, attribute.attribute_type, attribute.value]
    );
    
    return result.lastInsertRowId!;
  }
  
  static async getByItemId(itemId: number): Promise<Attribute[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Attribute>(
      'SELECT * FROM Attributes WHERE item_id = ?',
      [itemId]
    );
    return rows;
  }
  
  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync('DELETE FROM Attributes WHERE id = ?', [id]);
    return result.changes > 0;
  }
  
  static async deleteByItemId(itemId: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync('DELETE FROM Attributes WHERE item_id = ?', [itemId]);
    return result.changes > 0;
  }
}

export class TagDAO {
  static async create(tag: Omit<Tag, 'id'>): Promise<number> {
    if (!db) throw new Error('Database not initialized');
    
    let colorId = null;
    if (tag.color) {
      // Find color by hex code
      const color = await db.getFirstAsync<{id: number}>('SELECT id FROM Colors WHERE hex_code = ?', [tag.color]);
      colorId = color?.id || null;
    }
    
    const result = await db.runAsync(
      'INSERT INTO Tags (name, color_id) VALUES (?, ?)',
      [tag.name, colorId]
    );
    
    return result.lastInsertRowId!;
  }
  
  static async getAll(): Promise<Tag[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<{id: number, name: string, hex_code: string | null}>(`
      SELECT t.*, c.hex_code as hex_code 
      FROM Tags t 
      LEFT JOIN Colors c ON t.color_id = c.id 
      ORDER BY t.name
    `);
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      color: row.hex_code || undefined
    }));
  }
  
  static async getById(id: number): Promise<Tag | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<{id: number, name: string, hex_code: string | null}>(`
      SELECT t.*, c.hex_code as hex_code 
      FROM Tags t 
      LEFT JOIN Colors c ON t.color_id = c.id 
      WHERE t.id = ?
    `, [id]);
    
    return row ? {
      id: row.id,
      name: row.name,
      color: row.hex_code || undefined
    } : null;
  }
  
  static async getByItemId(itemId: number): Promise<Tag[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<{id: number, name: string, hex_code: string | null}>(`
      SELECT t.*, c.hex_code as hex_code 
      FROM Tags t 
      LEFT JOIN Colors c ON t.color_id = c.id 
      JOIN ItemTags it ON t.id = it.tag_id 
      WHERE it.item_id = ?
      ORDER BY t.name
    `, [itemId]);
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      color: row.hex_code || undefined
    }));
  }
  
  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync('DELETE FROM Tags WHERE id = ?', [id]);
    return result.changes > 0;
  }
  
  static async update(id: number, tag: Partial<Omit<Tag, 'id'>>): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    let colorId = null;
    if (tag.color) {
      // Find color by hex code
      const color = await db.getFirstAsync<{id: number}>('SELECT id FROM Colors WHERE hex_code = ?', [tag.color]);
      colorId = color?.id || null;
    }
    
    const result = await db.runAsync(
      'UPDATE Tags SET name = ?, color_id = ? WHERE id = ?',
      [tag.name || '', colorId, id]
    );
    
    return result.changes > 0;
  }
}

export class ItemTagDAO {
  static async addTagToItem(itemId: number, tagId: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      await db.runAsync(
        'INSERT OR IGNORE INTO ItemTags (item_id, tag_id) VALUES (?, ?)',
        [itemId, tagId]
      );
      return true;
    } catch (error) {
      console.error('Error adding tag to item:', error);
      return false;
    }
  }
  
  static async removeTagFromItem(itemId: number, tagId: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'DELETE FROM ItemTags WHERE item_id = ? AND tag_id = ?',
      [itemId, tagId]
    );
    
    return result.changes > 0;
  }
  
  static async getItemTags(itemId: number): Promise<number[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<{tag_id: number}>(
      'SELECT tag_id FROM ItemTags WHERE item_id = ?',
      [itemId]
    );
    
    return rows.map(row => row.tag_id);
  }
}

export class CapsuleDAO {
  static async create(capsule: Omit<Capsule, 'id'>): Promise<number> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'INSERT INTO Capsules (name, start_date, end_date, status, type) VALUES (?, ?, ?, ?, ?)',
      [capsule.name, capsule.start_date || null, capsule.end_date || null, capsule.status, capsule.type]
    );
    
    return result.lastInsertRowId!;
  }
  
  static async getAll(): Promise<Capsule[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<Capsule>('SELECT * FROM Capsules ORDER BY name');
    return rows;
  }
  
  static async getById(id: number): Promise<Capsule | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<Capsule>('SELECT * FROM Capsules WHERE id = ?', [id]);
    return row || null;
  }
  
  static async update(id: number, capsule: Partial<Capsule>): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const fields = [];
    const values = [];
    
    if (capsule.name) {
      fields.push('name = ?');
      values.push(capsule.name);
    }
    
    if (capsule.start_date !== undefined) {
      fields.push('start_date = ?');
      values.push(capsule.start_date || null);
    }
    
    if (capsule.end_date !== undefined) {
      fields.push('end_date = ?');
      values.push(capsule.end_date || null);
    }
    
    if (capsule.status) {
      fields.push('status = ?');
      values.push(capsule.status);
    }
    
    if (capsule.type) {
      fields.push('type = ?');
      values.push(capsule.type);
    }
    
    values.push(id);
    
    const result = await db.runAsync(
      `UPDATE Capsules SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return result.changes > 0;
  }
  
  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync('DELETE FROM Capsules WHERE id = ?', [id]);
    return result.changes > 0;
  }
}

export class CapsuleItemDAO {
  static async addItemToCapsule(capsuleId: number, itemId: number, packingStatus: string = 'не упаковано'): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      await db.runAsync(
        'INSERT OR IGNORE INTO CapsuleItems (capsule_id, item_id, packing_status) VALUES (?, ?, ?)',
        [capsuleId, itemId, packingStatus]
      );
      return true;
    } catch (error) {
      console.error('Error adding item to capsule:', error);
      return false;
    }
  }
  
  static async removeItemFromCapsule(capsuleId: number, itemId: number): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'DELETE FROM CapsuleItems WHERE capsule_id = ? AND item_id = ?',
      [capsuleId, itemId]
    );
    
    return result.changes > 0;
  }
  
  static async getCapsuleItems(capsuleId: number): Promise<number[]> {
    if (!db) throw new Error('Database not initialized');
    
    const rows = await db.getAllAsync<{item_id: number}>(
      'SELECT item_id FROM CapsuleItems WHERE capsule_id = ?',
      [capsuleId]
    );
    
    return rows.map(row => row.item_id);
  }
  
  static async updatePackingStatus(capsuleId: number, itemId: number, status: string): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync(
      'UPDATE CapsuleItems SET packing_status = ? WHERE capsule_id = ? AND item_id = ?',
      [status, capsuleId, itemId]
    );
    
    return result.changes > 0;
  }
}

export class SettingsDAO {
  static async get(key: string): Promise<string | null> {
    if (!db) throw new Error('Database not initialized');
    
    const row = await db.getFirstAsync<{value: string}>('SELECT value FROM Settings WHERE key = ?', [key]);
    return row?.value || null;
  }
  
  static async set(key: string, value: string): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      await db.runAsync('INSERT OR REPLACE INTO Settings (key, value) VALUES (?, ?)', [key, value]);
      return true;
    } catch (error) {
      console.error('Error setting setting:', error);
      return false;
    }
  }
  
  static async delete(key: string): Promise<boolean> {
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.runAsync('DELETE FROM Settings WHERE key = ?', [key]);
    return result.changes > 0;
  }
}

// Utility functions
export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
};

// Export database instance for direct queries if needed
export { db };

