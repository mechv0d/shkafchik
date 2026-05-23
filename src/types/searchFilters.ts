export type PhotoFilter = "any" | "with" | "without";

export type SearchFilterCriteria = {
  categoryIds: number[];
  tagIds: number[];
  statusIds: number[];
  favoritesOnly: boolean;
  photoFilter: PhotoFilter;
  /** 0 = любая оценка, 1–5 = минимум */
  minRating: number;
};

export const emptySearchFilters = (): SearchFilterCriteria => ({
  categoryIds: [],
  tagIds: [],
  statusIds: [],
  favoritesOnly: false,
  photoFilter: "any",
  minRating: 0,
});

export function countActiveSearchFilters(
  filters: SearchFilterCriteria,
): number {
  let n = 0;
  if (filters.categoryIds.length) n += 1;
  if (filters.tagIds.length) n += 1;
  if (filters.statusIds.length) n += 1;
  if (filters.favoritesOnly) n += 1;
  if (filters.photoFilter !== "any") n += 1;
  if (filters.minRating > 0) n += 1;
  return n;
}

export function hasActiveSearchFilters(filters: SearchFilterCriteria): boolean {
  return countActiveSearchFilters(filters) > 0;
}

export function serializeSearchFilters(filters: SearchFilterCriteria): string {
  return JSON.stringify(filters);
}

export function parseSearchFilters(json: string): SearchFilterCriteria {
  try {
    const raw = JSON.parse(json) as Partial<SearchFilterCriteria>;
    return {
      categoryIds: Array.isArray(raw.categoryIds)
        ? raw.categoryIds.filter((id) => typeof id === "number")
        : [],
      tagIds: Array.isArray(raw.tagIds)
        ? raw.tagIds.filter((id) => typeof id === "number")
        : [],
      statusIds: Array.isArray(raw.statusIds)
        ? raw.statusIds.filter((id) => typeof id === "number")
        : [],
      favoritesOnly: !!raw.favoritesOnly,
      photoFilter:
        raw.photoFilter === "with" || raw.photoFilter === "without"
          ? raw.photoFilter
          : "any",
      minRating:
        typeof raw.minRating === "number" &&
        raw.minRating >= 0 &&
        raw.minRating <= 5
          ? raw.minRating
          : 0,
    };
  } catch {
    return emptySearchFilters();
  }
}

export type FilterLabelLookup = {
  categories: Map<number, string>;
  tags: Map<number, string>;
  statuses: Map<number, string>;
};

export function describeSearchFilters(
  filters: SearchFilterCriteria,
  labels?: FilterLabelLookup,
): string {
  if (!hasActiveSearchFilters(filters)) {
    return "Без условий";
  }

  const parts: string[] = [];

  if (filters.categoryIds.length) {
    const names = filters.categoryIds
      .map((id) => labels?.categories.get(id))
      .filter(Boolean) as string[];
    parts.push(
      names.length ? names.join(", ") : `${filters.categoryIds.length} кат.`,
    );
  }

  if (filters.tagIds.length) {
    const names = filters.tagIds
      .map((id) => labels?.tags.get(id))
      .filter(Boolean) as string[];
    parts.push(
      names.length ? names.join(", ") : `${filters.tagIds.length} тег.`,
    );
  }

  if (filters.statusIds.length) {
    const names = filters.statusIds
      .map((id) => labels?.statuses.get(id))
      .filter(Boolean) as string[];
    parts.push(
      names.length ? names.join(", ") : `${filters.statusIds.length} стат.`,
    );
  }

  if (filters.favoritesOnly) parts.push("избранное");
  if (filters.photoFilter === "with") parts.push("с фото");
  if (filters.photoFilter === "without") parts.push("без фото");
  if (filters.minRating > 0) parts.push(`★${filters.minRating}+`);

  return parts.join(" · ");
}
