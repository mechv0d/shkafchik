import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { addItemStyles } from "../../styles/AddItem.styles";
import { commonScreenStyles } from "../../styles/CommonScreen.styles";
import { useFormData } from "./_layout";

export default function NameScreen() {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();
  const [error, setError] = useState("");
  const [showAISuggestions, setShowAISuggestions] = useState(true);

  useEffect(() => {
    // If we have AI suggestions, pre-fill the form
    if (formData.aiSuggestions && showAISuggestions) {
      updateFormData({
        name: formData.aiSuggestions.name,
        tags: formData.aiSuggestions.tags,
      });
    }
  }, [formData.aiSuggestions, showAISuggestions, updateFormData]);

  const handleNext = () => {
    if (!formData.name.trim()) {
      setError("Наименование обязательно для заполнения");
      return;
    }
    setError("");
    router.push("./details");
  };

  const handleBack = () => {
    router.back();
  };

  const handleAcceptAISuggestions = () => {
    if (formData.aiSuggestions) {
      updateFormData({
        name: formData.aiSuggestions.name,
        tags: formData.aiSuggestions.tags,
      });
      setShowAISuggestions(false);
    }
  };

  const handleRejectAISuggestions = () => {
    setShowAISuggestions(false);
    // Clear the pre-filled values
    updateFormData({
      name: "",
      tags: [],
    });
  };

  return (
    <ScrollView style={commonScreenStyles.container}>
      <View style={addItemStyles.header}>
        <TouchableOpacity onPress={handleBack} style={addItemStyles.backButton}>
          <ThemedText style={addItemStyles.backText}>×</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={addItemStyles.title}>
          Название
        </ThemedText>
      </View>

      {/* AI Suggestions Section */}
      {formData.aiSuggestions && showAISuggestions && (
        <ThemedView style={commonScreenStyles.section}>
          <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
            Предложение от ИИ
          </ThemedText>
          <ThemedView
            style={{
              backgroundColor: "#f0f9ff",
              borderColor: "#0ea5e9",
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <ThemedText style={{ fontSize: 14, marginBottom: 8 }}>
              <ThemedText style={{ fontWeight: "600" }}>
                Название:
              </ThemedText>{" "}
              {formData.aiSuggestions.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 14, marginBottom: 12 }}>
              <ThemedText style={{ fontWeight: "600" }}>
                Теги:
              </ThemedText>{" "}
              {formData.aiSuggestions.tags.join(", ")}
            </ThemedText>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[commonScreenStyles.button, { flex: 1 }]}
                onPress={handleAcceptAISuggestions}
              >
                <ThemedText style={commonScreenStyles.buttonText}>
                  Принять
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonScreenStyles.buttonSecondary, { flex: 1 }]}
                onPress={handleRejectAISuggestions}
              >
                <ThemedText style={commonScreenStyles.buttonSecondaryText}>
                  Сбросить
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </ThemedView>
      )}

      {/* AI Error Display */}
      {formData.aiError && (
        <ThemedView style={commonScreenStyles.section}>
          <ThemedView
            style={{
              backgroundColor: "#fef2f2",
              borderColor: "#ef4444",
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <ThemedText style={{ fontSize: 14, color: "#dc2626" }}>
              <ThemedText style={{ fontWeight: "600" }}>
                Ошибка ИИ:
              </ThemedText>{" "}
              {formData.aiError}
            </ThemedText>
            <ThemedText
              style={{ fontSize: 12, color: "#7f1d1d", marginTop: 4 }}
            >
              Пожалуйста, введите данные вручную.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}

      {error ? (
        <ThemedView style={addItemStyles.errorContainer}>
          <ThemedText style={addItemStyles.errorText}>{error}</ThemedText>
        </ThemedView>
      ) : null}

      <ThemedView style={commonScreenStyles.section}>
        <ThemedText type="subtitle">Наименование *</ThemedText>
        <TextInput
          style={commonScreenStyles.input}
          placeholder="Введите название вещи"
          value={formData.name}
          onChangeText={(text) => updateFormData({ name: text })}
        />

        <ThemedText type="subtitle">Описание</ThemedText>
        <TextInput
          style={[commonScreenStyles.input, addItemStyles.textarea]}
          placeholder="Введите описание вещи"
          value={formData.description}
          onChangeText={(text) => updateFormData({ description: text })}
          multiline
          numberOfLines={4}
        />
      </ThemedView>

      <ThemedView style={addItemStyles.nextContainer}>
        <TouchableOpacity
          style={commonScreenStyles.button}
          onPress={handleNext}
        >
          <ThemedText style={commonScreenStyles.buttonText}>Далее</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}
