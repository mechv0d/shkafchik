import { Tag } from "@/components/Tag";
import { ThemedText } from "@/components/themed-text";
import {
  CategoryDAO,
  initDatabase,
  ItemStatusDAO,
  SavedFilterSetDAO,
  TagDAO,
} from "@/src/api/database";
import { Category, ItemStatus, SavedFilterSet, Tag as TagModel } from "@/src/models";
import {
  countActiveSearchFilters,
  describeSearchFilters,
  emptySearchFilters,
  FilterLabelLookup,
  hasActiveSearchFilters,
  SearchFilterCriteria,
} from "@/src/types/searchFilters";
import { Fonts } from "@/constants/theme";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TrashIcon from "./ui/icons/TrashIcon";

type Props = {
  visible: boolean;
  initial: SearchFilterCriteria;
  onClose: () => void;
  onApply: (filters: SearchFilterCriteria) => void;
};

export function SearchFiltersModal({
  visible,
  initial,
  onClose,
  onApply,
}: Props) {
  const [draft, setDraft] = useState<SearchFilterCriteria>(initial);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagModel[]>([]);
  const [statuses, setStatuses] = useState<ItemStatus[]>([]);
  const [savedSets, setSavedSets] = useState<SavedFilterSet[]>([]);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    if (visible) {
      setDraft(initial);
      setPresetName("");
      loadOptions();
    }
  }, [visible, initial]);

  const labelLookup: FilterLabelLookup = useMemo(
    () => ({
      categories: new Map(categories.map((c) => [c.id, c.name])),
      tags: new Map(tags.map((t) => [t.id, t.name])),
      statuses: new Map(statuses.map((s) => [s.id, s.name])),
    }),
    [categories, tags, statuses],
  );

  const loadOptions = async () => {
    try {
      await initDatabase();
      const [cats, tagList, statusList, presets] = await Promise.all([
        CategoryDAO.getAll(),
        TagDAO.getAll(),
        ItemStatusDAO.getAll(),
        SavedFilterSetDAO.getAll(),
      ]);
      setCategories(cats);
      setTags(tagList);
      setStatuses(statusList);
      setSavedSets(presets);
    } catch (e) {
      console.error("Failed to load filter options:", e);
    }
  };

  const handleSavePreset = async () => {
    const name = presetName.trim();
    if (!name) {
      Alert.alert("Ошибка", "Введите название набора");
      return;
    }
    if (!hasActiveSearchFilters(draft)) {
      Alert.alert("Ошибка", "Выберите хотя бы одно условие фильтра");
      return;
    }

    try {
      await initDatabase();
      const existing = await SavedFilterSetDAO.getByName(name);
      if (existing) {
        Alert.alert(
          "Набор уже существует",
          `Перезаписать «${name}» текущими условиями?`,
          [
            { text: "Отмена", style: "cancel" },
            {
              text: "Перезаписать",
              onPress: async () => {
                await SavedFilterSetDAO.update(existing.id, draft);
                setPresetName("");
                await loadOptions();
              },
            },
          ],
        );
        return;
      }
      await SavedFilterSetDAO.create(name, draft);
      setPresetName("");
      await loadOptions();
    } catch (e) {
      console.error("Failed to save filter set:", e);
      Alert.alert("Ошибка", "Не удалось сохранить набор");
    }
  };

  const handleLoadPreset = (set: SavedFilterSet) => {
    setDraft(SavedFilterSetDAO.getCriteria(set));
  };

  const handleDeletePreset = (set: SavedFilterSet) => {
    Alert.alert("Удалить набор", `Удалить «${set.name}»?`, [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          try {
            await initDatabase();
            await SavedFilterSetDAO.delete(set.id);
            await loadOptions();
          } catch (e) {
            Alert.alert("Ошибка", "Не удалось удалить набор");
          }
        },
      },
    ]);
  };

  const handleApplyPreset = (set: SavedFilterSet) => {
    const criteria = SavedFilterSetDAO.getCriteria(set);
    onApply(criteria);
    onClose();
  };

  const toggleId = (list: number[], id: number): number[] =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Фильтры</ThemedText>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <ThemedText style={styles.close}>✕</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <FilterSection title="Мои наборы фильтров">
            <ThemedText style={styles.presetHint}>
              {savedSets.length === 0
                ? "Сохраните текущие условия, чтобы быстро применять их позже"
                : "Нажмите набор — подставить в форму · Удерживайте — сразу применить"}
            </ThemedText>
            {savedSets.map((set) => (
                <View key={set.id} style={styles.presetRow}>
                  <TouchableOpacity
                    style={styles.presetMain}
                    onPress={() => handleLoadPreset(set)}
                    onLongPress={() => handleApplyPreset(set)}
                  >
                    <ThemedText style={styles.presetName}>{set.name}</ThemedText>
                    <ThemedText style={styles.presetSummary} numberOfLines={2}>
                      {describeSearchFilters(
                        SavedFilterSetDAO.getCriteria(set),
                        labelLookup,
                      )}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.presetDelete}
                    onPress={() => handleDeletePreset(set)}
                    hitSlop={8}
                  >
                    <TrashIcon color="red" />
                    {/* <ThemedText style={styles.presetDeleteText}>✕</ThemedText> */}
                  </TouchableOpacity>
                </View>
              ))}
            <View style={styles.savePresetRow}>
              <TextInput
                style={styles.presetInput}
                placeholder="Название набора"
                placeholderTextColor="#999"
                value={presetName}
                onChangeText={setPresetName}
              />
              <TouchableOpacity
                style={[
                  styles.savePresetButton,
                  !hasActiveSearchFilters(draft) && styles.savePresetButtonDisabled,
                ]}
                onPress={handleSavePreset}
                disabled={!hasActiveSearchFilters(draft)}
              >
                <ThemedText style={styles.savePresetButtonText}>
                  Сохранить
                </ThemedText>
              </TouchableOpacity>
            </View>
            {hasActiveSearchFilters(draft) && (
              <ThemedText style={styles.presetCurrent}>
                Сейчас: {describeSearchFilters(draft, labelLookup)} (
                {countActiveSearchFilters(draft)} групп)
              </ThemedText>
            )}
          </FilterSection>

          <FilterSection title="Категория">
            <ChipRow
              items={categories.map((c) => ({ id: c.id, label: c.name }))}
              selected={draft.categoryIds}
              onToggle={(id) =>
                setDraft((d) => ({
                  ...d,
                  categoryIds: toggleId(d.categoryIds, id),
                }))
              }
            />
          </FilterSection>

          <FilterSection title="Статус вещи">
            <ChipRow
              items={statuses.map((s) => ({ id: s.id, label: s.name }))}
              selected={draft.statusIds}
              onToggle={(id) =>
                setDraft((d) => ({
                  ...d,
                  statusIds: toggleId(d.statusIds, id),
                }))
              }
            />
          </FilterSection>

          <FilterSection title="Теги">
            <View style={styles.tagWrap}>
              {tags.map((tag) => {
                const selected = draft.tagIds.includes(tag.id);
                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={[styles.tagChip, selected && styles.tagChipSelected]}
                    onPress={() =>
                      setDraft((d) => ({
                        ...d,
                        tagIds: toggleId(d.tagIds, tag.id),
                      }))
                    }
                  >
                    <Tag id={tag.id} name={tag.name} color={tag.color} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </FilterSection>

          <FilterSection title="Фото">
            <ChipRow
              items={[
                { id: 0, label: "Любое" },
                { id: 1, label: "С фото" },
                { id: 2, label: "Без фото" },
              ]}
              selected={[
                draft.photoFilter === "any"
                  ? 0
                  : draft.photoFilter === "with"
                    ? 1
                    : 2,
              ]}
              single
              onToggle={(id) => {
                const map: Record<number, SearchFilterCriteria["photoFilter"]> =
                  { 0: "any", 1: "with", 2: "without" };
                setDraft((d) => ({ ...d, photoFilter: map[id] ?? "any" }));
              }}
            />
          </FilterSection>

          <FilterSection title="Оценка (минимум)">
            <ChipRow
              items={[
                { id: 0, label: "Любая" },
                { id: 1, label: "★ 1+" },
                { id: 2, label: "★ 2+" },
                { id: 3, label: "★ 3+" },
                { id: 4, label: "★ 4+" },
                { id: 5, label: "★ 5" },
              ]}
              selected={[draft.minRating]}
              single
              onToggle={(id) => setDraft((d) => ({ ...d, minRating: id }))}
            />
          </FilterSection>

          <FilterSection title="Прочее">
            <ChipRow
              items={[{ id: 1, label: "Только избранное" }]}
              selected={draft.favoritesOnly ? [1] : []}
              onToggle={() =>
                setDraft((d) => ({ ...d, favoritesOnly: !d.favoritesOnly }))
              }
            />
          </FilterSection>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setDraft(emptySearchFilters())}
          >
            <ThemedText style={styles.resetText}>Сбросить</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              onApply(draft);
              onClose();
            }}
          >
            <ThemedText style={styles.applyText}>Применить</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );
}

function ChipRow({
  items,
  selected,
  onToggle,
  single = false,
}: {
  items: { id: number; label: string; value?: string }[];
  selected: number[];
  onToggle: (id: number) => void;
  single?: boolean;
}) {
  return (
    <View style={styles.chipRow}>
      {items.map((item) => {
        const isOn = selected.includes(item.id);
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.chip, isOn && styles.chipOn]}
            onPress={() => onToggle(item.id)}
          >
            <ThemedText style={[styles.chipText, isOn && styles.chipTextOn]}>
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  close: {
    fontSize: 22,
    color: "#666",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: Fonts.sans,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  chipOn: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  chipText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
  chipTextOn: {
    color: "#fff",
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    opacity: 0.55,
  },
  tagChipSelected: {
    opacity: 1,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  resetText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#000",
    alignItems: "center",
  },
  applyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: Fonts.sans,
  },
  presetHint: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 12,
    fontFamily: Fonts.sans,
  },
  presetRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 8,
    overflow: "hidden",
  },
  presetMain: {
    flex: 1,
    padding: 12,
  },
  presetName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: Fonts.sans,
    marginBottom: 4,
  },
  presetSummary: {
    fontSize: 13,
    opacity: 0.75,
    fontFamily: Fonts.sans,
  },
  presetDelete: {
    padding: 12,
    paddingLeft: 4,
  },
  presetDeleteText: {
    fontSize: 18,
    color: "#FF3B30",
    fontWeight: "600",
  },
  savePresetRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  presetInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    // paddingVertical: 10,
    fontSize: 14,
    fontFamily: Fonts.sans,
    justifyContent: "center",
    alignItems: "center",
    // textAlign: "center",
  },
  savePresetButton: {
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  savePresetButtonDisabled: {
    opacity: 0.35,
  },
  savePresetButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  presetCurrent: {
    fontSize: 12,
    opacity: 0.55,
    marginTop: 10,
    fontFamily: Fonts.sans,
  },
});
