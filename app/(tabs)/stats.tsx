import { Tag } from "@/components/Tag";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import HangerIcon from "@/components/ui/icons/HangerIcon";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { loadWardrobeStats, WardrobeStats } from "@/src/api/statsService";
import { wardrobeFilter } from "@/src/stores/wardrobeFilter";
import { commonScreenStyles } from "@/styles/CommonScreen.styles";
import { statsStyles } from "@/styles/Stats.styles";
import MoodIcon from "@/components/ui/icons/MoodIcon";

function formatHeroSubtitle(stats: WardrobeStats): string {
  const parts = [
    `${stats.totals.items} ${pluralItems(stats.totals.items)}`,
    `${stats.totals.capsules} ${pluralCapsules(stats.totals.capsules)}`,
    `${stats.totals.favorites} в избранном`,
  ];
  if (stats.totals.addedThisMonth > 0) {
    parts.push(`+${stats.totals.addedThisMonth} за месяц`);
  }
  return parts.join(" · ");
}

function pluralItems(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "вещь";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return "вещи";
  return "вещей";
}

function pluralCapsules(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "капсула";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return "капсулы";
  return "капсул";
}

type AttentionKey = keyof WardrobeStats["attention"];

const ATTENTION_META: {
  key: AttentionKey;
  label: string;
  filter: "noPhoto" | "noTags" | "noDescription" | "notInCapsule";
}[] = [
  { key: "noPhoto", label: "Без фото", filter: "noPhoto" },
  { key: "noTags", label: "Без тегов", filter: "noTags" },
  { key: "noDescription", label: "Без описания", filter: "noDescription" },
  { key: "notInCapsule", label: "Не в капсулах", filter: "notInCapsule" },
];

export default function StatsScreen() {
  const [stats, setStats] = useState<WardrobeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await loadWardrobeStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load wardrobe stats:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const goToItems = (
    filter: Parameters<typeof wardrobeFilter.set>[0]["filter"],
    extra?: Partial<Parameters<typeof wardrobeFilter.set>[0]>,
  ) => {
    wardrobeFilter.set({ filter, ...extra });
    router.push("/(tabs)/items");
  };

  const maxCategoryCount =
    stats?.byCategory.reduce((m, c) => Math.max(m, c.count), 0) ?? 1;

  const attentionEntries = stats
    ? ATTENTION_META.filter((m) => stats.attention[m.key] > 0)
    : [];

  if (loading && !stats) {
    return (
      <ThemedView style={commonScreenStyles.container}>
        <View style={statsStyles.headerRow}>
          <ThemedText type="title">Мой гардероб</ThemedText>
        </View>
        <View style={statsStyles.skeletonBlock} />
        <View style={statsStyles.skeletonBlock} />
        <ActivityIndicator style={{ marginTop: 24 }} />
      </ThemedView>
    );
  }

  if (stats && stats.totals.items === 0) {
    return (
      <ThemedView style={commonScreenStyles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={statsStyles.scrollContent}
        >
          <View style={statsStyles.headerRow}>
            <ThemedText type="title">Мой гардероб</ThemedText>
          </View>
          <View style={statsStyles.emptyBlock}>
            <HangerIcon color="#000" width={48} height={48} viewBox="0 0 24 24" />
            <ThemedText style={statsStyles.emptyTitle}>
              Гардероб пока пуст
            </ThemedText>
            <ThemedText style={statsStyles.emptyText}>
              Добавьте первую вещь, чтобы увидеть статистику и подсказки по
              каталогу
            </ThemedText>
            <TouchableOpacity
              style={statsStyles.emptyButton}
              onPress={() => router.push("/(tabs)/add-item")}
            >
              <ThemedText style={statsStyles.emptyButtonText}>
                Добавить вещь
              </ThemedText>
            </TouchableOpacity>
          </View>
          <Shortcuts onTags={() => router.push("/tags" as never)} />
        </ScrollView>
      </ThemedView>
    );
  }

  if (!stats) {
    return (
      <ThemedView style={commonScreenStyles.container}>
        <ThemedText>Не удалось загрузить данные</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={commonScreenStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={statsStyles.scrollContent}
      >
        <View style={statsStyles.headerRow}>
          <ThemedText type="title">Мой гардероб</ThemedText>
          {__DEV__ && (
            <TouchableOpacity
              onPress={() => router.push("/debug" as never)}
              hitSlop={12}
            >
              <Ionicons name="settings-outline" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <ThemedText style={statsStyles.heroSubtitle}>
          {formatHeroSubtitle(stats)}
        </ThemedText>

        {stats.averageRating != null && stats.averageRating > 0 && (
          <View style={statsStyles.ratingBadge}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <ThemedText style={statsStyles.ratingText}>
              Средняя оценка: {stats.averageRating} из 5
            </ThemedText>
          </View>
        )}

        <View style={statsStyles.kpiRow}>
          <KpiTile
            value={stats.totals.items}
            label="Вещи"
            onPress={() => goToItems("all")}
            icon={<HangerIcon color="#000" />}
          />
          <KpiTile
            value={stats.totals.capsules}
            label="Капсулы"
            onPress={() => router.push("/(tabs)/capsules")}
            icon={<MoodIcon color="#000" />}
          />
          <KpiTile
            value={stats.totals.favorites}
            label="Избранное"
            accent
            onPress={() => goToItems("favorites")}
            icon={<HeartIcon />}
          />
        </View>

        {attentionEntries.length > 0 && (
          <View style={statsStyles.section}>
            <ThemedText style={statsStyles.sectionTitle}>
              Нужно внимание
            </ThemedText>
            <View style={statsStyles.card}>
              {attentionEntries.map((meta, index) => (
                <TouchableOpacity
                  key={meta.key}
                  style={[
                    statsStyles.attentionRow,
                    index === attentionEntries.length - 1 &&
                      statsStyles.attentionRowLast,
                  ]}
                  onPress={() => goToItems(meta.filter)}
                >
                  <ThemedText style={statsStyles.attentionLabel}>
                    {meta.label}
                  </ThemedText>
                  <ThemedText style={statsStyles.attentionCount}>
                    {stats.attention[meta.key]}
                  </ThemedText>
                  <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {stats.byCategory.length > 0 && (
          <View style={statsStyles.section}>
            <ThemedText style={statsStyles.sectionTitle}>
              Состав гардероба
            </ThemedText>
            {stats.byCategory.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={statsStyles.barRow}
                onPress={() =>
                  goToItems("category", {
                    categoryId: cat.id,
                    label: cat.name,
                  })
                }
              >
                <View style={statsStyles.barHeader}>
                  <ThemedText style={statsStyles.barLabel} numberOfLines={1}>
                    {cat.name}
                  </ThemedText>
                  <ThemedText style={statsStyles.barCount}>
                    {cat.count}
                  </ThemedText>
                </View>
                <View style={statsStyles.barTrack}>
                  <View
                    style={[
                      statsStyles.barFill,
                      {
                        width: `${(cat.count / maxCategoryCount) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {stats.byStatus.length > 0 && (
          <View style={statsStyles.section}>
            <ThemedText style={statsStyles.sectionTitle}>По статусу</ThemedText>
            <View style={statsStyles.card}>
              {stats.byStatus.map((s, index) => (
                <View
                  key={s.name}
                  style={[
                    statsStyles.attentionRow,
                    index === stats.byStatus.length - 1 &&
                      statsStyles.attentionRowLast,
                  ]}
                >
                  <ThemedText style={statsStyles.attentionLabel}>
                    {s.name}
                  </ThemedText>
                  <ThemedText style={statsStyles.attentionCount}>
                    {s.count}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {stats.topTags.length > 0 && (
          <View style={statsStyles.section}>
            <ThemedText style={statsStyles.sectionTitle}>
              Популярные теги
            </ThemedText>
            {stats.topTags.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={statsStyles.tagStatRow}
                onPress={() =>
                  goToItems("tag", { tagId: t.id, label: t.name })
                }
              >
                <Tag id={t.id} name={t.name} color={t.color} />
                <ThemedText style={statsStyles.tagStatCount}>
                  {t.count}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={statsStyles.section}>
          <ThemedText style={statsStyles.sectionTitle}>Капсулы</ThemedText>
          <View style={statsStyles.capsuleSummary}>
            <ThemedText style={statsStyles.capsuleLine}>
              Активных: {stats.capsules.active}
            </ThemedText>
            <ThemedText style={statsStyles.capsuleLine}>
              Вещей в активных капсулах: {stats.capsules.itemsInActive}
            </ThemedText>
            {stats.capsules.unpacked > 0 && (
              <ThemedText style={statsStyles.capsuleLine}>
                Не упаковано: {stats.capsules.unpacked}
              </ThemedText>
            )}
            <TouchableOpacity onPress={() => router.push("/(tabs)/capsules")}>
              <ThemedText style={statsStyles.capsuleLink}>
                Открыть капсулы →
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {stats.recentItems.length > 0 && (
          <View style={statsStyles.section}>
            <ThemedText style={statsStyles.sectionTitle}>
              Недавно добавленные
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={statsStyles.recentScroll}
              contentContainerStyle={statsStyles.recentList}
            >
              {stats.recentItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={statsStyles.recentCard}
                  onPress={() => router.push(`/item/${item.id}` as never)}
                >
                  <Image
                    source={
                      item.imagePath
                        ? { uri: item.imagePath }
                        : require("@/assets/images/icon.png")
                    }
                    style={statsStyles.recentImage}
                    contentFit="cover"
                  />
                  <ThemedText
                    style={statsStyles.recentName}
                    numberOfLines={2}
                  >
                    {item.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={statsStyles.section}>
          <ThemedText style={statsStyles.sectionTitle}>Быстрые действия</ThemedText>
          <Shortcuts onTags={() => router.push("/tags" as never)} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function KpiTile({
  value,
  label,
  onPress,
  accent,
  icon,
}: {
  value: number;
  label: string;
  onPress: () => void;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[statsStyles.kpiTile, accent && statsStyles.kpiTileAccent]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <ThemedText
        style={[statsStyles.kpiValue, accent && statsStyles.kpiValueLight]}
      >
        {value}
      </ThemedText>
      <ThemedText
        style={[statsStyles.kpiLabel, accent && statsStyles.kpiLabelLight]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

function Shortcuts({ onTags }: { onTags: () => void }) {
  return (
    <View style={statsStyles.shortcutRow}>
      <TouchableOpacity style={statsStyles.shortcutChip} onPress={onTags}>
        <ThemedText style={statsStyles.shortcutText}>Теги</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={statsStyles.shortcutChip}
        onPress={() => router.push("/(tabs)/search")}
      >
        <ThemedText style={statsStyles.shortcutText}>Поиск</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={statsStyles.shortcutChip}
        onPress={() => router.push("/(tabs)/items")}
      >
        <ThemedText style={statsStyles.shortcutText}>Все вещи</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
