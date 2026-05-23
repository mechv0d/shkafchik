import { initDatabase, getDatabase } from "./database";

export type CategoryStat = { id: number; name: string; count: number };
export type TagStat = { id: number; name: string; color?: string; count: number };
export type StatusStat = { name: string; count: number };
export type RecentItemStat = {
  id: number;
  name: string;
  imagePath?: string;
};

export type WardrobeStats = {
  totals: {
    items: number;
    capsules: number;
    favorites: number;
    tags: number;
    addedThisMonth: number;
  };
  attention: {
    noPhoto: number;
    noTags: number;
    noDescription: number;
    notInCapsule: number;
  };
  averageRating: number | null;
  byCategory: CategoryStat[];
  byStatus: StatusStat[];
  topTags: TagStat[];
  capsules: {
    active: number;
    itemsInActive: number;
    unpacked: number;
  };
  recentItems: RecentItemStat[];
};

async function countQuery(
  sql: string,
  params: (string | number | null)[] = [],
): Promise<number> {
  const database = getDatabase();
  const row = await database.getFirstAsync<{ count: number }>(sql, params);
  return row?.count ?? 0;
}

export async function loadWardrobeStats(): Promise<WardrobeStats> {
  await initDatabase();
  const database = getDatabase();

  const [
    items,
    capsules,
    favorites,
    tags,
    addedThisMonth,
    noPhoto,
    noTags,
    noDescription,
    notInCapsule,
    averageRatingRow,
    byCategory,
    byStatus,
    topTags,
    activeCapsules,
    itemsInActive,
    unpacked,
    recentItems,
  ] = await Promise.all([
    countQuery("SELECT COUNT(*) as count FROM Items"),
    countQuery("SELECT COUNT(*) as count FROM Capsules"),
    countQuery(
      "SELECT COUNT(*) as count FROM Items WHERE is_favorite = 1",
    ),
    countQuery("SELECT COUNT(*) as count FROM Tags"),
    countQuery(
      `SELECT COUNT(*) as count FROM Items
       WHERE date_created >= date('now', 'start of month')`,
    ),
    countQuery(
      `SELECT COUNT(*) as count FROM Items i
       WHERE NOT EXISTS (SELECT 1 FROM Images img WHERE img.item_id = i.id)`,
    ),
    countQuery(
      `SELECT COUNT(*) as count FROM Items i
       WHERE NOT EXISTS (SELECT 1 FROM ItemTags it WHERE it.item_id = i.id)`,
    ),
    countQuery(
      `SELECT COUNT(*) as count FROM Items i
       WHERE NOT EXISTS (
         SELECT 1 FROM Attributes a
         WHERE a.item_id = i.id
           AND a.attribute_type = 'description'
           AND trim(a.value) != ''
       )`,
    ),
    countQuery(
      `SELECT COUNT(*) as count FROM Items i
       WHERE NOT EXISTS (
         SELECT 1 FROM CapsuleItems ci WHERE ci.item_id = i.id
       )`,
    ),
    database.getFirstAsync<{ avg: number | null }>(
      `SELECT AVG(CAST(value AS REAL)) as avg FROM Attributes
       WHERE attribute_type = 'rating'
         AND value IS NOT NULL AND trim(value) != '' AND value != '0'`,
    ),
    database.getAllAsync<CategoryStat>(
      `SELECT c.id, c.name, COUNT(i.id) as count
       FROM Categories c
       INNER JOIN Items i ON i.category_id = c.id
       GROUP BY c.id
       ORDER BY count DESC, c.name`,
    ),
    database.getAllAsync<StatusStat>(
      `SELECT s.name, COUNT(i.id) as count
       FROM ItemStatuses s
       INNER JOIN Items i ON i.status_id = s.id
       GROUP BY s.id
       ORDER BY count DESC`,
    ),
    database.getAllAsync<TagStat>(
      `SELECT t.id, t.name, c.hex_code as color, COUNT(it.item_id) as count
       FROM Tags t
       LEFT JOIN Colors c ON t.color_id = c.id
       INNER JOIN ItemTags it ON it.tag_id = t.id
       GROUP BY t.id
       ORDER BY count DESC
       LIMIT 5`,
    ),
    countQuery(
      `SELECT COUNT(*) as count FROM Capsules WHERE status = 'активная'`,
    ),
    countQuery(
      `SELECT COUNT(DISTINCT ci.item_id) as count
       FROM CapsuleItems ci
       INNER JOIN Capsules c ON c.id = ci.capsule_id
       WHERE c.status = 'активная'`,
    ),
    countQuery(
      `SELECT COUNT(*) as count
       FROM CapsuleItems ci
       INNER JOIN Capsules c ON c.id = ci.capsule_id
       WHERE c.status = 'активная' AND ci.packing_status = 'не упаковано'`,
    ),
    database.getAllAsync<RecentItemStat>(
      `SELECT i.id, i.name,
        (SELECT img.file_path FROM Images img
         WHERE img.item_id = i.id
         ORDER BY img.display_order, img.id
         LIMIT 1) as imagePath
       FROM Items i
       ORDER BY i.date_created DESC
       LIMIT 5`,
    ),
  ]);

  const avg = averageRatingRow?.avg;
  const averageRating =
    avg != null && !Number.isNaN(avg) ? Math.round(avg * 10) / 10 : null;

  return {
    totals: {
      items,
      capsules,
      favorites,
      tags,
      addedThisMonth,
    },
    attention: { noPhoto, noTags, noDescription, notInCapsule },
    averageRating,
    byCategory,
    byStatus,
    topTags: topTags.map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
      count: t.count,
    })),
    capsules: {
      active: activeCapsules,
      itemsInActive,
      unpacked,
    },
    recentItems,
  };
}
