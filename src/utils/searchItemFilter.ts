import { ItemWithDetails } from "@/src/models";
import { SearchFilterCriteria } from "@/src/types/searchFilters";

function getItemRating(item: ItemWithDetails): number {
  const raw = item.attributes.find((a) => a.attribute_type === "rating")?.value;
  const n = parseInt(raw ?? "0", 10);
  return Number.isNaN(n) ? 0 : n;
}

export function matchesSearchFilters(
  item: ItemWithDetails,
  filters: SearchFilterCriteria,
): boolean {
  if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(item.category_id)) {
    return false;
  }

  if (filters.statusIds.length > 0 && !filters.statusIds.includes(item.status_id)) {
    return false;
  }

  if (filters.tagIds.length > 0) {
    const itemTagIds = new Set(item.tags?.map((t) => t.id) ?? []);
    const hasAny = filters.tagIds.some((id) => itemTagIds.has(id));
    if (!hasAny) return false;
  }

  if (filters.favoritesOnly && !item.is_favorite) {
    return false;
  }

  if (filters.photoFilter === "with" && !item.images?.length) {
    return false;
  }
  if (filters.photoFilter === "without" && item.images?.length) {
    return false;
  }

  if (filters.minRating > 0 && getItemRating(item) < filters.minRating) {
    return false;
  }

  return true;
}
