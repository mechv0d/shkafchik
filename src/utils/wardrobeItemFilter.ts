import { ItemWithDetails } from "@/src/models";
import { WardrobeFilterState } from "@/src/stores/wardrobeFilter";

export function matchesWardrobeFilter(
  item: ItemWithDetails,
  state: WardrobeFilterState,
  capsuleItemIds: Set<number>,
): boolean {
  switch (state.filter) {
    case "all":
      return true;
    case "favorites":
      return !!item.is_favorite;
    case "noPhoto":
      return !item.images?.length;
    case "noTags":
      return !item.tags?.length;
    case "noDescription": {
      const desc = item.attributes.find(
        (a) => a.attribute_type === "description",
      )?.value;
      return !desc?.trim();
    }
    case "notInCapsule":
      return !capsuleItemIds.has(item.id);
    case "category":
      return state.categoryId != null && item.category_id === state.categoryId;
    case "tag":
      return (
        state.tagId != null &&
        !!item.tags?.some((t) => t.id === state.tagId)
      );
    default:
      return true;
  }
}
