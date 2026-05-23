CREATE INDEX IF NOT EXISTS idx_items_category_id ON Items (category_id);
CREATE INDEX IF NOT EXISTS idx_items_status_id ON Items (status_id);
CREATE INDEX IF NOT EXISTS idx_items_date_created ON Items (date_created);
CREATE INDEX IF NOT EXISTS idx_tags_name ON Tags (name);
CREATE INDEX IF NOT EXISTS idx_item_tags_tag_id ON ItemTags (tag_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON Categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_saved_filter_sets_name ON SavedFilterSets (name);
