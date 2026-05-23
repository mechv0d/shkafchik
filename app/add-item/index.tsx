import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import TrashIcon from "../../components/ui/icons/TrashIcon";
import { AIAnalysisService } from "../../src/api/aiAnalysisService";
import {
  captureFromCamera,
  pickFromGallery,
  ProcessedImage,
} from "../../src/api/imageProcessor";
import { commonScreenStyles } from "../../styles/CommonScreen.styles";
import { useFormData } from "./_layout";

export default function AddItemScreen() {
  const { formData, updateFormData } = useFormData();
  // const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleCaptureFromCamera = async () => {
    try {
      const image = await captureFromCamera();
      if (image) {
        updateFormData({ photos: [...formData.photos, image] });
      }
    } catch (error) {
      Alert.alert(
        "Ошибка",
        error instanceof Error
          ? error.message
          : "Не удалось сделать фотографию",
      );
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const image = await pickFromGallery();
      if (image) {
        updateFormData({ photos: [...formData.photos, image] });
      }
    } catch (error) {
      Alert.alert(
        "Ошибка",
        error instanceof Error
          ? error.message
          : "Не удалось выбрать фотографию",
      );
    }
  };

  const removeImage = (index: number) => {
    updateFormData({
      photos: formData.photos.filter(
        (_: ProcessedImage, i: number) => i !== index,
      ),
    });
  };

  const resetPhotos = () => {
    Alert.alert("Сбросить фото", "Вы уверены, что хотите удалить все фото?", [
      { text: "Отмена", style: "cancel" },
      { text: "Сбросить", onPress: () => updateFormData({ photos: [] }) },
    ]);
  };

  const handleBack = () => {
    router.push("/items");
  };

  const handleNext = () => {
    router.push("/add-item/name");
  };

  const handleAIAnalysis = async () => {
    if (formData.photos.length === 0) {
      Alert.alert("Ошибка", "Пожалуйста, добавьте хотя бы одну фотографию");
      return;
    }

    // Set loading state
    updateFormData({
      isAnalyzing: true,
      aiError: null,
      aiSuggestions: null,
    });

    try {
      console.log("Starting AI analysis for", formData.photos.length, "photos");

      // Use mock service for development, switch to real service when ready
      const result = await AIAnalysisService.analyzePhotos(formData.photos);

      if (result.success) {
        console.log("AI analysis successful:", result);
        updateFormData({
          aiSuggestions: {
            name: result.suggestedName,
            tags: result.suggestedTags,
          },
          isAnalyzing: false,
          aiError: null,
        });

        // Navigate to name screen with AI suggestions
        router.push("/add-item/name");
      } else {
        throw new Error(result.error || "AI analysis failed");
      }
    } catch (error) {
      console.error("AI analysis failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to analyze photos";

      updateFormData({
        isAnalyzing: false,
        aiError: errorMessage,
      });

      // Show user-friendly error and offer to continue manually
      Alert.alert(
        "Анализ ИИ не удался",
        "Не удалось проанализировать фотографии с помощью ИИ. Вы можете продолжить с ручным вводом.",
        [
          { text: "Отмена", style: "cancel" },
          {
            text: "Продолжить вручную",
            onPress: () => router.push("/add-item/name"),
          },
        ],
      );
    }
  };

  return (
    <ThemedView style={[commonScreenStyles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: "#ffffff" }}
      >
        <ThemedView style={commonScreenStyles.header}>
          <TouchableOpacity style={{ paddingVertical: 5 }} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText type="title">Новая вещь</ThemedText>
        </ThemedView>

        <ThemedView style={commonScreenStyles.section}>
          <ThemedView style={{ gap: 12 }}>
            <TouchableOpacity
              style={commonScreenStyles.button}
              onPress={handleCaptureFromCamera}
            >
              <ThemedText style={commonScreenStyles.buttonText}>
                Сделать фото
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={commonScreenStyles.buttonSecondary}
              onPress={handlePickFromGallery}
            >
              <ThemedText style={commonScreenStyles.buttonSecondaryText}>
                Выбрать из галереи
              </ThemedText>
            </TouchableOpacity>

            {formData.photos.length > 0 && (
              <TouchableOpacity
                style={commonScreenStyles.buttonSecondary}
                onPress={resetPhotos}
              >
                <ThemedText style={commonScreenStyles.buttonSecondaryText}>
                  Сбросить все
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ThemedView>

        {formData.photos.length > 0 && (
          <ThemedView style={commonScreenStyles.section}>
            <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
              Изображения ({formData.photos.length})
            </ThemedText>
            {formData.photos.map((image: ProcessedImage, index: number) => (
              <ThemedView key={index} style={commonScreenStyles.card}>
                <ThemedView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    paddingBottom: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "#e0e0e0",
                  }}
                >
                  <Image
                    source={{ uri: image.uri }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                  <ThemedText style={commonScreenStyles.cardTitle}>
                    Фото {index + 1}
                  </ThemedText>
                  <TouchableOpacity
                    style={commonScreenStyles.button}
                    onPress={() => removeImage(index)}
                  >
                    <ThemedText style={commonScreenStyles.buttonText}>
                      <TrashIcon color={"#fff"} />
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ScrollView>

      <ThemedView style={{ marginTop: "auto", paddingTop: 24 }}>
        <TouchableOpacity
          style={[
            commonScreenStyles.button,
            {
              backgroundColor:
                formData.photos.length > 0 ? "#000000ff" : "#8E8E93",
            },
          ]}
          onPress={handleNext}
          disabled={formData.photos.length === 0}
        >
          <ThemedText style={commonScreenStyles.buttonText}>Далее</ThemedText>
        </TouchableOpacity>

        {formData.photos.length > 0 && (
          <TouchableOpacity
            style={[commonScreenStyles.buttonSecondary, { marginTop: 12 }]}
            onPress={handleAIAnalysis}
            disabled={formData.isAnalyzing}
          >
            <ThemedText style={commonScreenStyles.buttonSecondaryText}>
              {formData.isAnalyzing ? "Анализируем..." : "Продолжить с ИИ"}
            </ThemedText>
          </TouchableOpacity>
        )}

        {formData.photos.length === 0 && (
          <ThemedText
            style={{
              textAlign: "center",
              fontSize: 14,
              opacity: 0.6,
              marginTop: 8,
            }}
          >
            Добавьте хотя бы одно фото
          </ThemedText>
        )}
      </ThemedView>

      {/* AI Analysis Loading Modal */}
      <Modal
        visible={formData.isAnalyzing}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ThemedView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <ThemedView
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 24,
              alignItems: "center",
              maxWidth: 300,
            }}
          >
            <ActivityIndicator
              size="large"
              color="#000000"
              style={{ marginBottom: 16 }}
            />
            <ThemedText
              style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}
            >
              Анализируем фото
            </ThemedText>
            <ThemedText
              style={{ fontSize: 14, textAlign: "center", opacity: 0.7 }}
            >
              ИИ анализирует ваши фото для предложения названия и тегов...
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}
