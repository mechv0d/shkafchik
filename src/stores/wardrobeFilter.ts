export type WardrobeFilter =
  | "all"
  | "favorites"
  | "noPhoto"
  | "noTags"
  | "noDescription"
  | "notInCapsule"
  | "category"
  | "tag";

export type WardrobeFilterState = {
  filter: WardrobeFilter;
  categoryId?: number;
  tagId?: number;
  label?: string;
};

const defaultState: WardrobeFilterState = { filter: "all" };

let pending: WardrobeFilterState = { ...defaultState };

export const wardrobeFilter = {
  set(state: WardrobeFilterState) {
    pending = state;
  },
  consume(): WardrobeFilterState {
    const current = pending;
    pending = { ...defaultState };
    return current;
  },
  peek(): WardrobeFilterState {
    return pending;
  },
};
