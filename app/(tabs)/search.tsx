import { ItemsGrid } from "@/components/ItemsGrid";
import { SearchFiltersModal } from "@/components/SearchFiltersModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import FilterIcon from "@/components/ui/icons/FilterIcon";
import ListIcon from "@/components/ui/icons/ListIcon";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import { Colors } from "@/constants/theme";
import { initDatabase, ItemDAO } from "@/src/api/database";
import { ItemWithDetails } from "@/src/models";
import {
  countActiveSearchFilters,
  emptySearchFilters,
  hasActiveSearchFilters,
  SearchFilterCriteria,
} from "@/src/types/searchFilters";
import { matchesSearchFilters } from "@/src/utils/searchItemFilter";
import { commonScreenStyles } from "@/styles/CommonScreen.styles";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<ItemWithDetails[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<
    "price_desc" | "price_asc" | "date_desc" | "date_asc" | "name"
  >("name");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilterCriteria>(
    emptySearchFilters(),
  );

  const colors = Colors.light;
  const activeFilterCount = countActiveSearchFilters(filters);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [searchQuery, items, sortBy, filters]);

  const loadItems = async () => {
    try {
      setLoading(true);
      await initDatabase();
      const allItems = await ItemDAO.getAll();
      const itemsWithDetails = await Promise.all(
        allItems.map(async (item) => {
          const details = await ItemDAO.getWithDetails(item.id);
          return details || null;
        }),
      );
      setItems(itemsWithDetails.filter(Boolean) as ItemWithDetails[]);
    } catch (error) {
      console.error("Error loading items:", error);
      Alert.alert("Ошибка", "Не удалось загрузить вещи");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = useCallback(() => {
    let filtered = items;

    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (hasActiveSearchFilters(filters)) {
      filtered = filtered.filter((item) => matchesSearchFilters(item, filters));
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price_desc": {
          const priceA =
            a.attributes.find((attr) => attr.attribute_type === "price")
              ?.value || "0";
          const priceB =
            b.attributes.find((attr) => attr.attribute_type === "price")
              ?.value || "0";
          return parseFloat(priceB) - parseFloat(priceA);
        }
        case "price_asc": {
          const priceA =
            a.attributes.find((attr) => attr.attribute_type === "price")
              ?.value || "0";
          const priceB =
            b.attributes.find((attr) => attr.attribute_type === "price")
              ?.value || "0";
          return parseFloat(priceA) - parseFloat(priceB);
        }
        case "date_desc":
          return (
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
          );
        case "date_asc":
          return (
            new Date(a.date_created).getTime() -
            new Date(b.date_created).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [searchQuery, items, sortBy, filters]);

  const getSortLabel = () => {
    switch (sortBy) {
      case "name":
        return "Название";
      case "price_desc":
        return "Дорогое";
      case "price_asc":
        return "Дешевое";
      case "date_desc":
        return "Новое";
      case "date_asc":
        return "Старое";
      default:
        return "Название";
    }
  };

  const handleSortSelect = (
    sortType: "price_desc" | "price_asc" | "date_desc" | "date_asc" | "name",
  ) => {
    setSortBy(sortType);
    setShowSortDropdown(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const clearFilters = () => setFilters(emptySearchFilters());

  const getEmptyMessage = () => {
    if (searchQuery.trim() && hasActiveSearchFilters(filters)) {
      return "Ничего не найдено по запросу и фильтрам";
    }
    if (searchQuery.trim()) return "Ничего не найдено";
    if (hasActiveSearchFilters(filters)) {
      return "Нет вещей по выбранным фильтрам";
    }
    return "Введите запрос или откройте фильтры";
  };

  return (
    <ThemedView style={commonScreenStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ThemedView style={commonScreenStyles.header}>
          <ThemedText type="title">Поиск</ThemedText>
        </ThemedView>

        <View style={commonScreenStyles.searchSection}>
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
              placeholder="Введите название..."
              placeholderTextColor={colors.tabIconDefault}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={commonScreenStyles.searchControlsRow}>
            <TouchableOpacity
              onPress={() => setShowSortDropdown(true)}
              style={commonScreenStyles.searchButton}
            >
              <View style={commonScreenStyles.searchButtonContent}>
                <ListIcon
                  color={colors.tint}
                  width={24}
                  height={24}
                  viewBox="0 0 24 16"
                />
                <Text style={[commonScreenStyles.searchText, { color: colors.tint }]}>
                  {getSortLabel()}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowFilters(true)}
              style={[
                commonScreenStyles.searchFilterButton,
                {
                  backgroundColor: colors.background,
                  borderColor: activeFilterCount
                    ? colors.tint
                    : colors.tabIconDefault,
                },
                activeFilterCount > 0 && styles.filterButtonActive,
              ]}
            >
              <FilterIcon color={colors.tint} width={20} height={20} />
              <Text
                style={[commonScreenStyles.searchFilterText, { color: colors.tint }]}
              >
                Фильтры
              </Text>
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {activeFilterCount > 0 && (
            <TouchableOpacity
              style={styles.activeFiltersBar}
              onPress={clearFilters}
            >
              <Text style={styles.activeFiltersText}>
                Активно групп фильтров: {activeFilterCount} · Сбросить
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {showSortDropdown && (
          <TouchableOpacity
            style={styles.dropdownOverlay}
            onPress={() => setShowSortDropdown(false)}
            activeOpacity={1}
          >
            <View
              style={[
                styles.dropdownContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.tabIconDefault,
                },
              ]}
            >
              {(
                [
                  ["price_desc", "Дорогое"],
                  ["price_asc", "Дешевое"],
                  ["date_desc", "Новое"],
                  ["date_asc", "Старое"],
                  ["name", "Название"],
                ] as const
              ).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleSortSelect(key)}
                  style={styles.dropdownItem}
                >
                  <Text style={[styles.dropdownText, { color: colors.text }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.resultsContainer}>
          {!loading && filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
                {getEmptyMessage()}
              </Text>
            </View>
          ) : (
            <ItemsGrid items={filteredItems} title="" />
          )}
        </View>
      </ScrollView>

      <SearchFiltersModal
        visible={showFilters}
        initial={filters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  filterButtonActive: {
    borderWidth: 2,
  },
  filterBadge: {
    marginLeft: 6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  activeFiltersBar: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f0f4ff",
    borderRadius: 8,
  },
  activeFiltersText: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },
  dropdownContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownText: {
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    zIndex: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    zIndex: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
    zIndex: 100,
  },
});
