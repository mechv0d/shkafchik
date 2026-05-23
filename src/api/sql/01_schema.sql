-- shkafchik schema v1

CREATE TABLE IF NOT EXISTS Categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  parent_id INTEGER,
  date_created TEXT DEFAULT CURRENT_TIMESTAMP,
  date_modified TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES Categories (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ItemStatuses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS Colors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  hex_code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  status_id INTEGER NOT NULL,
  is_favorite INTEGER DEFAULT 0,
  date_created TEXT DEFAULT CURRENT_TIMESTAMP,
  date_modified TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE RESTRICT,
  FOREIGN KEY (status_id) REFERENCES ItemStatuses (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER,
  file_path TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  FOREIGN KEY (item_id) REFERENCES Items (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Attributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER,
  attribute_type TEXT NOT NULL,
  value TEXT,
  FOREIGN KEY (item_id) REFERENCES Items (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  color_id INTEGER,
  FOREIGN KEY (color_id) REFERENCES Colors (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ItemTags (
  item_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (item_id, tag_id),
  FOREIGN KEY (item_id) REFERENCES Items (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES Tags (id) ON DELETE CASCADE
);

-- status: активная | архивная | черновик
-- type: постоянная | временная
CREATE TABLE IF NOT EXISTS Capsules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'активная' CHECK (status IN ('активная', 'архивная', 'черновик')),
  type TEXT DEFAULT 'постоянная' CHECK (type IN ('постоянная', 'временная'))
);

CREATE TABLE IF NOT EXISTS CapsuleItems (
  capsule_id INTEGER,
  item_id INTEGER,
  packing_status TEXT DEFAULT 'не упаковано',
  PRIMARY KEY (capsule_id, item_id),
  FOREIGN KEY (capsule_id) REFERENCES Capsules (id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES Items (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS Filters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  filter_type TEXT
);

CREATE TABLE IF NOT EXISTS CategoryFilterValues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  filter_id INTEGER,
  value TEXT,
  FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE CASCADE,
  FOREIGN KEY (filter_id) REFERENCES Filters (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SavedFilterSets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  criteria_json TEXT NOT NULL,
  date_created TEXT DEFAULT CURRENT_TIMESTAMP,
  date_modified TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TEXT DEFAULT CURRENT_TIMESTAMP
);
