import { ItemsGrid } from "@/components/ItemsGrid";
import { SortButton } from "@/components/SortButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import HangerIcon from "@/components/ui/icons/HangerIcon";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import { Colors } from "@/constants/theme";
import { CapsuleItemDAO, initDatabase, ItemDAO } from "@/src/api/database";
import {
  wardrobeFilter,
  WardrobeFilterState,
} from "@/src/stores/wardrobeFilter";
import { matchesWardrobeFilter } from "@/src/utils/wardrobeItemFilter";
import { commonScreenStyles } from "@/styles/CommonScreen.styles";
import { sortButtonsStyles } from "@/styles/SortButtons.styles";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ItemWithDetails } from "../../src/models";

const FILTER_LABELS: Record<string, string> = {
  favorites: "Избранное",
  noPhoto: "Без фото",
  noTags: "Без тегов",
  noDescription: "Без описания",
  notInCapsule: "Не в капсулах",
  category: "Категория",
  tag: "Тег",
};

function getFilterBannerLabel(state: WardrobeFilterState): string {
  if (state.label) return state.label;
  return FILTER_LABELS[state.filter] ?? "Фильтр";
}

export default function ItemsScreen() {
  const [items, setItems] = useState<ItemWithDetails[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "all" | "favorites" | "cart" | "purchased"
  >("all");
  const [wardrobeFilterState, setWardrobeFilterState] =
    useState<WardrobeFilterState>({ filter: "all" });
  const [capsuleItemIds, setCapsuleItemIds] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const colors = Colors.light;

  const loadItems = async () => {
    try {
      await initDatabase();
      const itemsResult = await ItemDAO.getAll();
      // console.log("itemsResult:", itemsResult);
      const itemsWithDetails = await Promise.all(
        itemsResult.map(async (item) => {
          const details = await ItemDAO.getWithDetails(item.id);
          return details || null;
        }),
      );
      const validItems = itemsWithDetails.filter(
        (item): item is ItemWithDetails => item !== null,
      );
      // console.log("validItems:", validItems);
      setItems(validItems);
    } catch (error) {
      console.error("Failed to load items:", error);
    }
  };

  // Make loadItems available globally
  useEffect(() => {
    // Attach the refresh function to window object for global access
    (global as any).refreshItems = loadItems;
    return () => {
      delete (global as any).refreshItems;
    };
  }, []);

  useEffect(() => {
    loadItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const pending = wardrobeFilter.consume();
      if (pending.filter !== "all") {
        setWardrobeFilterState(pending);
        if (pending.filter === "favorites") {
          setSortBy("favorites");
        }
      }
      loadItems();
    }, []),
  );

  useEffect(() => {
    if (wardrobeFilterState.filter === "notInCapsule") {
      initDatabase()
        .then(() => CapsuleItemDAO.getAllItemIdsInCapsules())
        .then((ids) => setCapsuleItemIds(new Set(ids)))
        .catch(console.error);
    }
  }, [wardrobeFilterState.filter]);

  useEffect(() => {
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (wardrobeFilterState.filter !== "all") {
      filtered = filtered.filter((item) =>
        matchesWardrobeFilter(item, wardrobeFilterState, capsuleItemIds),
      );
    } else if (sortBy === "favorites") {
      filtered = filtered.filter((item) => item.is_favorite);
    } else if (sortBy === "cart") {
      filtered = filtered.filter((item) => item.in_cart);
    } else if (sortBy === "purchased") {
      filtered = filtered.filter((item) => item.is_purchased);
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, sortBy, wardrobeFilterState, capsuleItemIds]);

  const clearWardrobeFilter = () => {
    setWardrobeFilterState({ filter: "all" });
    setSortBy("all");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  return (
    <ThemedView style={commonScreenStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={commonScreenStyles.header}>
          <ThemedText type="title">
            {wardrobeFilterState.filter !== "all"
              ? getFilterBannerLabel(wardrobeFilterState)
              : "Недавние"}
          </ThemedText>
        </ThemedView>

        {wardrobeFilterState.filter !== "all" && (
          <TouchableOpacity
            style={itemsFilterStyles.banner}
            onPress={clearWardrobeFilter}
          >
            <Text style={itemsFilterStyles.bannerText}>
              Фильтр: {getFilterBannerLabel(wardrobeFilterState)} · Сбросить
            </Text>
          </TouchableOpacity>
        )}
        {/* Search Section */}
        <View
          style={[
            commonScreenStyles.searchSectionContainer,
            {
              backgroundColor: colors.background,
              borderColor: colors.tabIconDefault,
            },
          ]}
        >
          <SearchIcon color={colors.tabIconDefault} width={20} height={20} />
          <TextInput
            style={[
              commonScreenStyles.searchSectionInput,
              { color: colors.text },
            ]}
            placeholder="Быстрый поиск"
            placeholderTextColor={colors.tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={{ height: 40, marginBottom: 16 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={sortButtonsStyles.sortContainer}
            contentContainerStyle={sortButtonsStyles.sortContainerContent}
          >
            <SortButton
              title="Все"
              icon={
                <HangerIcon
                  color={"#000"}
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                />
              }
              count={items.length}
              isActive={sortBy === "all"}
              onPress={() => setSortBy("all")}
            />
            <SortButton
              title="Избранное"
              icon={<HeartIcon />}
              count={items.filter((item) => item.is_favorite).length}
              isActive={sortBy === "favorites"}
              onPress={() => setSortBy("favorites")}
            />
            {/* <SortButton
            title="В корзине"
            icon={<HangerIcon />}
            count={items.filter(item => item.in_cart).length}
            isActive={sortBy === 'cart'}
            onPress={() => setSortBy('cart')}
          />
          <SortButton
            title="Купленные"
            icon={<HangerIcon />}
            count={items.filter(item => item.is_purchased).length}
            isActive={sortBy === 'purchased'}
            onPress={() => setSortBy('purchased')}
          /> */}
          </ScrollView>
        </View>

        <ItemsGrid items={filteredItems} sortBy={sortBy} />
      </ScrollView>
    </ThemedView>
  );
}

const itemsFilterStyles = StyleSheet.create({
  banner: {
    backgroundColor: "#f0f4ff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  bannerText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
});
