// TypeScript interfaces for database models

export interface Item {
  id: number;
  name: string;
  category_id: number;
  status_id: number;
  date_created: string;
  date_modified: string;
}

export interface Image {
  id: number;
  item_id: number;
  file_path: string;
  display_order: number;
}

export interface Attribute {
  id: number;
  item_id: number;
  attribute_type: string;
  value: string;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
}

export interface ItemTag {
  item_id: number;
  tag_id: number;
}

export interface Capsule {
  id: number;
  name: string;
  start_date?: string;
  end_date?: string;
  status: string;
  type: string;
}

export interface CapsuleItem {
  capsule_id: number;
  item_id: number;
  packing_status: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface UserCategory {
  id: number;
  name: string;
  date_created: string;
  date_modified: string;
}

export interface Filter {
  id: number;
  name: string;
  filter_type: string;
}

export interface CategoryFilterValue {
  id: number;
  category_id: number;
  filter_id: number;
  value: string;
}

export interface Category {
  id: number;
  name: string;
  parent_id?: number;
  date_created: string;
  date_modified: string;
  children?: Category[];
  parent?: Category;
}

export interface ItemStatus {
  id: number;
  name: string;
  description?: string;
}

export interface Color {
  id: number;
  name: string;
  hex_code: string;
}

export interface ItemWithDetails extends Item {
  category: Category;
  status: ItemStatus;
  images: Image[];
  attributes: Attribute[];
  tags: Tag[];
  is_favorite?: boolean;
  in_cart?: boolean;
  is_purchased?: boolean;
}
