import * as SQLite from "expo-sqlite";
import {
  Attribute,
  Capsule,
  Category,
  Color,
  Image,
  Item,
  ItemStatus,
  ItemWithDetails,
  SavedFilterSet,
  Tag,
} from "../models";
import {
  parseSearchFilters,
  SearchFilterCriteria,
  serializeSearchFilters,
} from "../types/searchFilters";
import { SQL_BOOTSTRAP } from "./sql";

// Database connection
let db: SQLite.SQLiteDatabase | null = null;

// Database initialization
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    try {
      // Test if the connection is still valid
      await db.getFirstAsync("SELECT 1");
      return db;
    } catch (error) {
      console.log("Database connection is invalid, reinitializing...");
      db = null;
    }
  }

  try {
    console.log("Initializing database connection...");
    db = await SQLite.openDatabaseAsync("shkafchik.db");

    await applySchema();

    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Database initialization failed:", error);
    db = null;
    throw error;
  }
};

/** Applies schema, indexes, and reference seed from src/api/sql/ */
const applySchema = async () => {
  if (!db) throw new Error("Database not initialized");
  await db.execAsync(SQL_BOOTSTRAP);
  await db.runAsync(
    "DELETE FROM Categories WHERE trim(name) = '' OR name IS NULL",
  );
};

// DAO (Data Access Object) classes

export class CategoryDAO {
  static async create(
    category: Omit<Category, "id" | "date_created" | "date_modified">,
  ): Promise<number> {
    if (!db) throw new Error("Database not initialized");

    const name = category.name?.trim();
    if (!name) {
      throw new Error("Category name cannot be empty");
    }

    const result = await db.runAsync(
      "INSERT INTO Categories (name, parent_id) VALUES (?, ?)",
      [name, category.parent_id || null],
    );

    return result.lastInsertRowId!;
  }

  static async getAll(): Promise<Category[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Category>(
      `SELECT * FROM Categories
       WHERE trim(name) != ''
       ORDER BY name COLLATE NOCASE`,
    );
    return rows;
  }

  static async getById(id: number): Promise<Category | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<Category>(
      "SELECT * FROM Categories WHERE id = ?",
      [id],
    );
    return row || null;
  }

  static async getByName(name: string): Promise<Category | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<Category>(
      "SELECT * FROM Categories WHERE name = ?",
      [name],
    );
    return row || null;
  }

  static async update(
    id: number,
    category: Partial<Category>,
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const fields = [];
    const values = [];

    if (category.name) {
      fields.push("name = ?");
      values.push(category.name);
    }

    fields.push("date_modified = CURRENT_TIMESTAMP");
    values.push(id);

    const result = await db.runAsync(
      `UPDATE Categories SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.changes > 0;
  }

  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync("DELETE FROM Categories WHERE id = ?", [
      id,
    ]);
    return result.changes > 0;
  }

  static async getParents(): Promise<Category[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Category>(
      `SELECT * FROM Categories
       WHERE parent_id IS NULL AND trim(name) != ''
       ORDER BY name COLLATE NOCASE`,
    );
    return rows;
  }

  static async getChildren(parentId: number): Promise<Category[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Category>(
      `SELECT * FROM Categories
       WHERE parent_id = ? AND trim(name) != ''
       ORDER BY name COLLATE NOCASE`,
      [parentId],
    );
    return rows;
  }

  static async getHierarchy(): Promise<Category[]> {
    if (!db) throw new Error("Database not initialized");

    const allCategories = await this.getAll();
    const categoryMap = new Map<number, Category>();

    // Create map of all categories
    allCategories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build hierarchy
    const parents: Category[] = [];
    categoryMap.forEach((category) => {
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
    if (!db) throw new Error("Database not initialized");

    const path: string[] = [];
    let currentId: number | null = categoryId;

    while (currentId !== null) {
      const category = await this.getById(currentId);
      if (!category) break;

      path.unshift(category.name);
      currentId = category.parent_id || null;
    }

    return path.join(" → ");
  }

  static async getCategoryWithChildren(
    categoryId: number,
  ): Promise<Category | null> {
    if (!db) throw new Error("Database not initialized");

    const category = await this.getById(categoryId);
    if (!category) return null;

    const children = await this.getChildren(categoryId);
    return { ...category, children };
  }
}

export class ItemStatusDAO {
  static async getAll(): Promise<ItemStatus[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<ItemStatus>(
      "SELECT * FROM ItemStatuses ORDER BY name",
    );
    return rows;
  }

  static async getById(id: number): Promise<ItemStatus | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<ItemStatus>(
      "SELECT * FROM ItemStatuses WHERE id = ?",
      [id],
    );
    return row || null;
  }

  static async getByName(name: string): Promise<ItemStatus | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<ItemStatus>(
      "SELECT * FROM ItemStatuses WHERE name = ?",
      [name],
    );
    return row || null;
  }

  static async getFirst(): Promise<ItemStatus | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<ItemStatus>(
      "SELECT * FROM ItemStatuses ORDER BY id LIMIT 1",
    );
    return row || null;
  }
}

export class ColorDAO {
  static async getAll(): Promise<Color[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Color>(
      "SELECT * FROM Colors ORDER BY name",
    );
    return rows;
  }

  static async getById(id: number): Promise<Color | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<Color>(
      "SELECT * FROM Colors WHERE id = ?",
      [id],
    );
    return row || null;
  }
}

export class ItemDAO {
  static async create(
    item: Omit<Item, "id" | "date_created" | "date_modified">,
  ): Promise<number> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "INSERT INTO Items (name, category_id, status_id) VALUES (?, ?, ?)",
      [item.name, item.category_id, item.status_id],
    );

    return result.lastInsertRowId!;
  }

  static async getAll(): Promise<Item[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Item>(
      "SELECT * FROM Items ORDER BY date_created DESC",
    );
    return rows;
  }

  static async getById(id: number): Promise<Item | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<Item>(
      "SELECT * FROM Items WHERE id = ?",
      [id],
    );
    return row || null;
  }

  static async getWithDetails(id: number): Promise<ItemWithDetails | null> {
    if (!db) throw new Error("Database not initialized");

    const item = await this.getById(id);
    if (!item) return null;

    const category = await CategoryDAO.getById(item.category_id);
    const status = await ItemStatusDAO.getById(item.status_id);
    const images = await ImageDAO.getByItemId(id);
    const attributes = await AttributeDAO.getByItemId(id);
    const tags = await TagDAO.getByItemId(id);

    if (!category || !status) return null;

    const row = item as Item & { is_favorite?: number };

    return {
      ...item,
      category,
      status,
      images,
      attributes,
      tags,
      is_favorite: !!row.is_favorite,
    };
  }

  static async update(id: number, item: Partial<Item>): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const fields = [];
    const values = [];

    if (item.name) {
      fields.push("name = ?");
      values.push(item.name);
    }

    if (item.category_id) {
      fields.push("category_id = ?");
      values.push(item.category_id);
    }

    if (item.status_id) {
      fields.push("status_id = ?");
      values.push(item.status_id);
    }

    fields.push("date_modified = CURRENT_TIMESTAMP");
    values.push(id);

    const result = await db.runAsync(
      `UPDATE Items SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.changes > 0;
  }

  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync("DELETE FROM Items WHERE id = ?", [id]);
    return result.changes > 0;
  }

  static async getByCategory(categoryId: number): Promise<Item[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Item>(
      "SELECT * FROM Items WHERE category_id = ? ORDER BY date_created DESC",
      [categoryId],
    );
    return rows;
  }

  static async updateFavorite(
    id: number,
    isFavorite: boolean,
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "UPDATE Items SET is_favorite = ? WHERE id = ?",
      [isFavorite ? 1 : 0, id],
    );

    return result.changes > 0;
  }

  static async updateAttribute(
    itemId: number,
    attributeType: string,
    value: string,
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "UPDATE Attributes SET value = ? WHERE item_id = ? AND attribute_type = ?",
      [value, itemId, attributeType],
    );

    return result.changes > 0;
  }

  static async createAttribute(
    itemId: number,
    attributeType: string,
    value: string,
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "INSERT INTO Attributes (item_id, attribute_type, value) VALUES (?, ?, ?)",
      [itemId, attributeType, value],
    );

    return result.changes > 0;
  }

  static async getByStatus(statusId: number): Promise<Item[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Item>(
      "SELECT * FROM Items WHERE status_id = ? ORDER BY date_created DESC",
      [statusId],
    );
    return rows;
  }
}

export class ImageDAO {
  static async create(image: Omit<Image, "id">): Promise<number> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "INSERT INTO Images (item_id, file_path, display_order) VALUES (?, ?, ?)",
      [image.item_id, image.file_path, image.display_order],
    );

    return result.lastInsertRowId!;
  }

  static async getByItemId(itemId: number): Promise<Image[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Image>(
      "SELECT * FROM Images WHERE item_id = ? ORDER BY display_order",
      [itemId],
    );
    return rows;
  }

  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync("DELETE FROM Images WHERE id = ?", [id]);
    return result.changes > 0;
  }

  static async deleteByItemId(itemId: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync("DELETE FROM Images WHERE item_id = ?", [
      itemId,
    ]);
    return result.changes > 0;
  }
}

export class AttributeDAO {
  static async create(attribute: Omit<Attribute, "id">): Promise<number> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "INSERT INTO Attributes (item_id, attribute_type, value) VALUES (?, ?, ?)",
      [attribute.item_id, attribute.attribute_type, attribute.value],
    );

    return result.lastInsertRowId!;
  }

  static async getByItemId(itemId: number): Promise<Attribute[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Attribute>(
      "SELECT * FROM Attributes WHERE item_id = ?",
      [itemId],
    );
    return rows;
  }

  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync("DELETE FROM Attributes WHERE id = ?", [
      id,
    ]);
    return result.changes > 0;
  }

  static async deleteByItemId(itemId: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "DELETE FROM Attributes WHERE item_id = ?",
      [itemId],
    );
    return result.changes > 0;
  }
}

export class TagDAO {
  static async create(tag: Omit<Tag, "id">): Promise<number> {
    if (!db) throw new Error("Database not initialized");

    let colorId = null;
    if (tag.color) {
      // Find color by hex code
      const color = await db.getFirstAsync<{ id: number }>(
        "SELECT id FROM Colors WHERE hex_code = ?",
        [tag.color],
      );
      colorId = color?.id || null;
    }

    const result = await db.runAsync(
      "INSERT INTO Tags (name, color_id) VALUES (?, ?)",
      [tag.name, colorId],
    );

    return result.lastInsertRowId!;
  }

  static async getAll(): Promise<Tag[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<{
      id: number;
      name: string;
      hex_code: string | null;
    }>(`
      SELECT t.*, c.hex_code as hex_code 
      FROM Tags t 
      LEFT JOIN Colors c ON t.color_id = c.id 
      ORDER BY t.name
    `);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      color: row.hex_code || undefined,
    }));
  }

  static async getById(id: number): Promise<Tag | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<{
      id: number;
      name: string;
      hex_code: string | null;
    }>(
      `
      SELECT t.*, c.hex_code as hex_code 
      FROM Tags t 
      LEFT JOIN Colors c ON t.color_id = c.id 
      WHERE t.id = ?
    `,
      [id],
    );

    return row
      ? {
          id: row.id,
          name: row.name,
          color: row.hex_code || undefined,
        }
      : null;
  }

  static async getByItemId(itemId: number): Promise<Tag[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<{
      id: number;
      name: string;
      hex_code: string | null;
    }>(
      `
      SELECT t.*, c.hex_code as hex_code 
      FROM Tags t 
      LEFT JOIN Colors c ON t.color_id = c.id 
      JOIN ItemTags it ON t.id = it.tag_id 
      WHERE it.item_id = ?
      ORDER BY t.name
    `,
      [itemId],
    );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      color: row.hex_code || undefined,
    }));
  }

  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync("DELETE FROM Tags WHERE id = ?", [id]);
    return result.changes > 0;
  }

  static async update(
    id: number,
    tag: Partial<Omit<Tag, "id">>,
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    let colorId = null;
    if (tag.color) {
      // Find color by hex code
      const color = await db.getFirstAsync<{ id: number }>(
        "SELECT id FROM Colors WHERE hex_code = ?",
        [tag.color],
      );
      colorId = color?.id || null;
    }

    const result = await db.runAsync(
      "UPDATE Tags SET name = ?, color_id = ? WHERE id = ?",
      [tag.name || "", colorId, id],
    );

    return result.changes > 0;
  }
}

export class ItemTagDAO {
  static async addTagToItem(itemId: number, tagId: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    try {
      await db.runAsync(
        "INSERT OR IGNORE INTO ItemTags (item_id, tag_id) VALUES (?, ?)",
        [itemId, tagId],
      );
      return true;
    } catch (error) {
      console.error("Error adding tag to item:", error);
      return false;
    }
  }

  static async removeTagFromItem(
    itemId: number,
    tagId: number,
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "DELETE FROM ItemTags WHERE item_id = ? AND tag_id = ?",
      [itemId, tagId],
    );

    return result.changes > 0;
  }

  static async getItemTags(itemId: number): Promise<number[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<{ tag_id: number }>(
      "SELECT tag_id FROM ItemTags WHERE item_id = ?",
      [itemId],
    );

    return rows.map((row) => row.tag_id);
  }
}

export class CapsuleDAO {
  static async create(capsule: Omit<Capsule, "id">): Promise<number> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "INSERT INTO Capsules (name, start_date, end_date, status, type) VALUES (?, ?, ?, ?, ?)",
      [
        capsule.name,
        capsule.start_date || null,
        capsule.end_date || null,
        capsule.status,
        capsule.type,
      ],
    );

    return result.lastInsertRowId!;
  }

  static async getAll(): Promise<Capsule[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<Capsule>(
      "SELECT * FROM Capsules ORDER BY name",
    );
    return rows;
  }

  static async getById(id: number): Promise<Capsule | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<Capsule>(
      "SELECT * FROM Capsules WHERE id = ?",
      [id],
    );
    return row || null;
  }

  static async update(id: number, capsule: Partial<Capsule>): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const fields = [];
    const values = [];

    if (capsule.name) {
      fields.push("name = ?");
      values.push(capsule.name);
    }

    if (capsule.start_date !== undefined) {
      fields.push("start_date = ?");
      values.push(capsule.start_date || null);
    }

    if (capsule.end_date !== undefined) {
      fields.push("end_date = ?");
      values.push(capsule.end_date || null);
    }

    if (capsule.status) {
      fields.push("status = ?");
      values.push(capsule.status);
    }

    if (capsule.type) {
      fields.push("type = ?");
      values.push(capsule.type);
    }

    values.push(id);

    const result = await db.runAsync(
      `UPDATE Capsules SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.changes > 0;
  }

  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync("DELETE FROM Capsules WHERE id = ?", [id]);
    return result.changes > 0;
  }
}

export class CapsuleItemDAO {
  static async addItemToCapsule(
    capsuleId: number,
    itemId: number,
    packingStatus: string = "не упаковано",
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    try {
      await db.runAsync(
        "INSERT OR IGNORE INTO CapsuleItems (capsule_id, item_id, packing_status) VALUES (?, ?, ?)",
        [capsuleId, itemId, packingStatus],
      );
      return true;
    } catch (error) {
      console.error("Error adding item to capsule:", error);
      return false;
    }
  }

  static async removeItemFromCapsule(
    capsuleId: number,
    itemId: number,
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "DELETE FROM CapsuleItems WHERE capsule_id = ? AND item_id = ?",
      [capsuleId, itemId],
    );

    return result.changes > 0;
  }

  static async getCapsuleItems(capsuleId: number): Promise<number[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<{ item_id: number }>(
      "SELECT item_id FROM CapsuleItems WHERE capsule_id = ?",
      [capsuleId],
    );

    return rows.map((row) => row.item_id);
  }

  static async getAllItemIdsInCapsules(): Promise<number[]> {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync<{ item_id: number }>(
      "SELECT DISTINCT item_id FROM CapsuleItems",
    );
    return rows.map((row) => row.item_id);
  }

  static async updatePackingStatus(
    capsuleId: number,
    itemId: number,
    status: string,
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "UPDATE CapsuleItems SET packing_status = ? WHERE capsule_id = ? AND item_id = ?",
      [status, capsuleId, itemId],
    );

    return result.changes > 0;
  }
}

export class SavedFilterSetDAO {
  static async getAll(): Promise<SavedFilterSet[]> {
    if (!db) throw new Error("Database not initialized");

    return db.getAllAsync<SavedFilterSet>(
      `SELECT * FROM SavedFilterSets
       ORDER BY date_modified DESC, name COLLATE NOCASE`,
    );
  }

  static async getById(id: number): Promise<SavedFilterSet | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<SavedFilterSet>(
      "SELECT * FROM SavedFilterSets WHERE id = ?",
      [id],
    );
    return row ?? null;
  }

  static async getByName(name: string): Promise<SavedFilterSet | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<SavedFilterSet>(
      "SELECT * FROM SavedFilterSets WHERE name = ?",
      [name.trim()],
    );
    return row ?? null;
  }

  static async create(
    name: string,
    criteria: SearchFilterCriteria,
  ): Promise<number> {
    if (!db) throw new Error("Database not initialized");

    const trimmed = name.trim();
    if (!trimmed) throw new Error("Filter set name cannot be empty");

    const result = await db.runAsync(
      `INSERT INTO SavedFilterSets (name, criteria_json) VALUES (?, ?)`,
      [trimmed, serializeSearchFilters(criteria)],
    );
    return result.lastInsertRowId!;
  }

  static async update(
    id: number,
    criteria: SearchFilterCriteria,
    name?: string,
  ): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    if (name !== undefined) {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Filter set name cannot be empty");
      const result = await db.runAsync(
        `UPDATE SavedFilterSets
         SET name = ?, criteria_json = ?, date_modified = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [trimmed, serializeSearchFilters(criteria), id],
      );
      return result.changes > 0;
    }

    const result = await db.runAsync(
      `UPDATE SavedFilterSets
       SET criteria_json = ?, date_modified = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [serializeSearchFilters(criteria), id],
    );
    return result.changes > 0;
  }

  static async delete(id: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync(
      "DELETE FROM SavedFilterSets WHERE id = ?",
      [id],
    );
    return result.changes > 0;
  }

  static getCriteria(set: SavedFilterSet): SearchFilterCriteria {
    return parseSearchFilters(set.criteria_json);
  }
}

export class SettingsDAO {
  static async get(key: string): Promise<string | null> {
    if (!db) throw new Error("Database not initialized");

    const row = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM Settings WHERE key = ?",
      [key],
    );
    return row?.value || null;
  }

  static async set(key: string, value: string): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    try {
      await db.runAsync(
        "INSERT OR REPLACE INTO Settings (key, value) VALUES (?, ?)",
        [key, value],
      );
      return true;
    } catch (error) {
      console.error("Error setting setting:", error);
      return false;
    }
  }

  static async delete(key: string): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");

    const result = await db.runAsync("DELETE FROM Settings WHERE key = ?", [
      key,
    ]);
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
  if (!db)
    throw new Error("Database not initialized. Call initDatabase() first.");
  return db;
};

// Export database instance for direct queries if needed
export { db };
