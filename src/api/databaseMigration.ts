import { SQL_DROP_ALL } from "./sql";

/**
 * Legacy migration for flat → hierarchical categories.
 * Not run on fresh installs; see categoryMigration.ts.
 * @deprecated Use categoryMigration.migrateCategoriesToHierarchy for existing DBs only.
 */
export async function migrateDatabase() {
  try {
    console.log("Starting legacy database migration...");

    const { getDatabase } = await import("./database");
    const db = getDatabase();

    const tableInfo = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Categories'",
    );
    if (tableInfo.length === 0) {
      console.log("Categories table does not exist yet, skipping migration");
      return;
    }

    const columnInfo = await db.getAllAsync<{ name: string }>(
      "PRAGMA table_info(Categories)",
    );
    const hasParentId = columnInfo.some((column) => column.name === "parent_id");

    const existingCategories = await db.getAllAsync<{ id: number }>(
      "SELECT id FROM Categories LIMIT 1",
    );
    const hasExistingData = existingCategories.length > 0;

    if (!hasParentId) {
      await db.execAsync(`
        ALTER TABLE Categories ADD COLUMN parent_id INTEGER REFERENCES Categories (id) ON DELETE SET NULL
      `);
      await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON Categories (parent_id)
      `);
    }

    if (hasExistingData) {
      const { migrateCategoriesToHierarchy } = await import("./categoryMigration");
      await migrateCategoriesToHierarchy();
    }

    console.log("Legacy database migration completed");
  } catch (error) {
    console.error("Database migration failed:", error);
    throw error;
  }
}

/** Drops all tables and re-runs schema bootstrap (development/testing). */
export async function resetDatabase() {
  try {
    console.log("Resetting database...");

    const { getDatabase, initDatabase } = await import("./database");
    const db = getDatabase();

    await db.execAsync(SQL_DROP_ALL);
    console.log("All tables dropped");

    await initDatabase();
    console.log("Database reset and reinitialized");
  } catch (error) {
    console.error("Database reset failed:", error);
    throw error;
  }
}
