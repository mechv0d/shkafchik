import { ItemsGrid } from "@/components/ItemsGrid";
import { Tag, TagProps } from "@/components/Tag";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import PlusIcon from "@/components/ui/icons/PlusIcon";
import { ColorDAO, initDatabase, ItemDAO, TagDAO } from "@/src/api/database";
import { ItemWithDetails } from "@/src/models";
import { commonScreenStyles } from "@/styles/CommonScreen.styles";
import { tagDetailStyles } from "@/styles/TagDetail.styles";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Color {
  id: number;
  name: string;
  hex_code: string;
}

export default function TagsManagementScreen() {
  const [tags, setTags] = useState<TagProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagProps | null>(null);
  const [tagItems, setTagItems] = useState<ItemWithDetails[]>([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagProps | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState<string | null>(null);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreTags, setHasMoreTags] = useState(true);
  const pageSize = 100;

  useEffect(() => {
    loadTags();
    loadColors();
  }, [currentPage]);

  const loadColors = async () => {
    try {
      await initDatabase();
      const colors = await ColorDAO.getAll();
      setAvailableColors(colors);
    } catch (error) {
      console.error("Failed to load colors:", error);
    }
  };

  const loadTags = async () => {
    try {
      setIsLoading(true);
      await initDatabase();
      const allTags = await TagDAO.getAll();

      const sortedTags = allTags.sort((a, b) => b.id - a.id);

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTags = sortedTags.slice(startIndex, endIndex);

      if (currentPage === 1) {
        setTags(paginatedTags);
      } else {
        setTags((prev) => [...prev, ...paginatedTags]);
      }

      setHasMoreTags(endIndex < sortedTags.length);
    } catch (error) {
      console.error("Failed to load tags:", error);
      Alert.alert("Ошибка", "Не удалось загрузить теги");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTagItems = async (tag: TagProps) => {
    try {
      await initDatabase();
      // Get all items with details and filter by tag
      const allItems = await ItemDAO.getAll();
      const itemsWithTag: ItemWithDetails[] = [];

      for (const item of allItems) {
        const itemTags = await TagDAO.getByItemId(item.id);
        if (itemTags.some((t) => t.id === tag.id)) {
          const itemWithDetails = await ItemDAO.getWithDetails(item.id);
          if (itemWithDetails) {
            itemsWithTag.push(itemWithDetails);
          }
        }
      }

      setTagItems(itemsWithTag);
    } catch (error) {
      console.error("Failed to load tag items:", error);
      setTagItems([]);
    }
  };

  const handleTagPress = (tag: TagProps) => {
    setSelectedTag(tag);
    loadTagItems(tag);
    setShowTagModal(true);
  };

  const handleEditTag = () => {
    if (selectedTag) {
      setEditingTag(selectedTag);
      setNewTagName(selectedTag.name);
      setNewTagColor(selectedTag.color || "#007AFF");
      setShowTagModal(false);
      setShowCreateModal(true);
    }
  };

  const handleDeleteTag = () => {
    if (!selectedTag) return;

    Alert.alert(
      "Подтверждение",
      `Вы уверены, что хотите удалить тег "${selectedTag.name}"?`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              await initDatabase();
              await TagDAO.delete(selectedTag.id);
              setTags((prev) => prev.filter((t) => t.id !== selectedTag.id));
              setShowTagModal(false);
              setSelectedTag(null);
              Alert.alert("Успех", "Тег удален");
            } catch (error) {
              console.error("Failed to delete tag:", error);
              Alert.alert("Ошибка", "Не удалось удалить тег");
            }
          },
        },
      ],
    );
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      Alert.alert("Ошибка", "Введите название тега");
      return;
    }

    if (!newTagColor) {
      Alert.alert("Ошибка", "Выберите цвет тега");
      return;
    }

    try {
      setIsLoading(true);
      await initDatabase();

      if (editingTag) {
        const success = await TagDAO.update(editingTag.id, {
          name: newTagName.trim(),
          color: newTagColor,
        });

        if (success) {
          setTags((prev) =>
            prev.map((t) =>
              t.id === editingTag.id
                ? { ...t, name: newTagName.trim(), color: newTagColor }
                : t,
            ),
          );
        } else {
          throw new Error("Failed to update tag");
        }
      } else {
        const tagId = await TagDAO.create({
          name: newTagName.trim(),
          color: newTagColor,
        });
        const newTag = {
          id: tagId,
          name: newTagName.trim(),
          color: newTagColor,
        };
        setTags((prev) => [newTag, ...prev]);
      }

      setShowCreateModal(false);
      setEditingTag(null);
      setNewTagName("");
      setNewTagColor(null);
      Alert.alert("Успех", editingTag ? "Тег обновлен" : "Тег создан");
    } catch (error) {
      console.error("Failed to save tag:", error);
      Alert.alert("Ошибка", "Не удалось сохранить тег");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const loadMoreTags = () => {
    if (!isLoading && hasMoreTags) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <ThemedView style={commonScreenStyles.container}>
      <View style={commonScreenStyles.header}>
        {/* <TouchableOpacity onPress={handleBack} style={tagDetailStyles.headerBackButton}>
          <ThemedText style={tagDetailStyles.headerBackText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={tagDetailStyles.headerTitle}>Теги</ThemedText> */}
        <TouchableOpacity
          style={tagDetailStyles.createButton}
          onPress={() => {
            setEditingTag(null);
            setNewTagName("");
            setNewTagColor(null);
            setShowCreateModal(true);
          }}
        >
          <PlusIcon color="#fff" />
          <ThemedText style={tagDetailStyles.createButtonText}>
            Добавить
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={tagDetailStyles.tagsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={tagDetailStyles.tagsList}>
          {tags.map((tag) => (
            <Tag
              key={tag.id}
              id={tag.id}
              name={tag.name}
              color={tag.color}
              onPress={() => handleTagPress(tag)}
            />
          ))}
        </View>

        {hasMoreTags && (
          <TouchableOpacity
            style={tagDetailStyles.loadMoreButton}
            onPress={loadMoreTags}
            disabled={isLoading}
          >
            <ThemedText style={tagDetailStyles.loadMoreText}>
              {isLoading ? "Загрузка..." : "Загрузить еще"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Tag Details Modal */}
      <Modal
        visible={showTagModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTagModal(false)}
      >
        <View style={tagDetailStyles.modalOverlay}>
          <View style={tagDetailStyles.modalContent}>
            {selectedTag && (
              <>
                <View
                  style={[
                    tagDetailStyles.modalTag,
                    { backgroundColor: selectedTag.color || "#007AFF" },
                  ]}
                >
                  <ThemedText style={tagDetailStyles.modalTagText}>
                    {selectedTag.name}
                  </ThemedText>
                </View>

                <View style={tagDetailStyles.modalButtons}>
                  <TouchableOpacity
                    style={tagDetailStyles.modalButton}
                    onPress={handleEditTag}
                  >
                    <ThemedText style={tagDetailStyles.modalButtonText}>
                      Редактировать
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      tagDetailStyles.modalButton,
                      tagDetailStyles.deleteButton,
                    ]}
                    onPress={handleDeleteTag}
                  >
                    <ThemedText
                      style={[
                        tagDetailStyles.modalButtonText,
                        tagDetailStyles.deleteButtonText,
                      ]}
                    >
                      Удалить
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                {tagItems.length > 0 && (
                  <View style={tagDetailStyles.modalItems}>
                    <ThemedText
                      type="subtitle"
                      style={tagDetailStyles.modalItemsTitle}
                    >
                      Вещи с этим тегом
                    </ThemedText>
                    <ItemsGrid items={tagItems} />
                  </View>
                )}
              </>
            )}

            <TouchableOpacity
              style={tagDetailStyles.closeButton}
              onPress={() => setShowTagModal(false)}
            >
              <ThemedText style={tagDetailStyles.closeButtonText}>
                Закрыть
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create/Edit Tag Modal */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={tagDetailStyles.modalOverlay}>
          <View style={tagDetailStyles.createModalContent}>
            <ThemedText
              type="subtitle"
              style={tagDetailStyles.createModalTitle}
            >
              {editingTag ? "Редактировать тег" : "Создать тег"}
            </ThemedText>

            <TextInput
              style={commonScreenStyles.input}
              placeholder="Название тега"
              value={newTagName}
              onChangeText={setNewTagName}
            />

            <View style={tagDetailStyles.colorPicker}>
              <ThemedText style={tagDetailStyles.colorLabel}>Цвет:</ThemedText>
            </View>

            <ScrollView
              style={tagDetailStyles.colorList}
              showsVerticalScrollIndicator={false}
            >
              <View style={tagDetailStyles.colorGrid}>
                {availableColors.map((color) => (
                  <TouchableOpacity
                    key={color.id}
                    style={[
                      tagDetailStyles.colorOption,
                      newTagColor === color.hex_code &&
                        tagDetailStyles.selectedColorOption,
                    ]}
                    onPress={() => setNewTagColor(color.hex_code)}
                  >
                    <View
                      style={[
                        tagDetailStyles.colorCircle,
                        { backgroundColor: color.hex_code },
                      ]}
                    />
                    {newTagColor === color.hex_code && (
                      <ThemedText style={tagDetailStyles.colorName}>
                        {color.name}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={tagDetailStyles.createModalButtons}>
              <TouchableOpacity
                style={[
                  tagDetailStyles.modalButton,
                  tagDetailStyles.cancelButton,
                ]}
                onPress={() => setShowCreateModal(false)}
              >
                <ThemedText style={tagDetailStyles.modalButtonText}>
                  Отмена
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tagDetailStyles.modalButton,
                  tagDetailStyles.saveButton,
                ]}
                onPress={handleCreateTag}
                disabled={isLoading}
              >
                <ThemedText style={tagDetailStyles.modalButtonText}>
                  {editingTag ? "Сохранить" : "Создать"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}
