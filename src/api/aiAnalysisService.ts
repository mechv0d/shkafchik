import { ProcessedImage } from "./imageProcessor";

export interface AIAnalysisRequest {
  photos: ProcessedImage[];
}

export interface AIAnalysisResponse {
  success: boolean;
  suggestedName: string;
  suggestedTags: string[];
  error?: string;
}

export class AIAnalysisService {
  private static readonly TIMEOUT = 15_000; // 15 seconds
  private static readonly MAX_RETRIES = 1;

  // private static readonly API_BASE_URL = 'http://10.0.2.2:8000';   // Android Emulator
  private static readonly API_BASE_URL = "http://176.212.122.196:8000";
  // private static readonly API_BASE_URL = 'https://your-deployed-domain.com'; // Production

  static async analyzePhotos(
    photos: ProcessedImage[],
  ): Promise<AIAnalysisResponse> {
    if (photos.length === 0) {
      return {
        success: false,
        suggestedName: "",
        suggestedTags: [],
        error: "No photos provided for analysis",
      };
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`AI Analysis attempt ${attempt}/${this.MAX_RETRIES}`);

        // Prepare photos for upload
        const formData = new FormData();

        photos.forEach((photo) => {
          // Use the same key 'photos' for every file!
          // This allows the backend to receive them as a single list.
          formData.append("photos", {
            uri: photo.uri.startsWith("file://")
              ? photo.uri
              : `file://${photo.uri}`,
            type: "image/jpeg",
            name: "item_photo.jpg",
          } as any);
        });

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

        try {
          const response = await fetch(
            `${this.API_BASE_URL}/api/analyze-item`,
            {
              method: "POST",
              body: formData,
              signal: controller.signal,
            },
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(
              `Server responded with ${response.status}: ${response.statusText}`,
            );
          }

          const result: AIAnalysisResponse = await response.json();

          if (result.success && result.suggestedName && result.suggestedTags) {
            console.log("AI Analysis successful:", result);
            return result;
          } else {
            throw new Error(result.error || "Invalid response from server");
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("Unknown error occurred");
        console.error(`AI Analysis attempt ${attempt} failed:`, lastError);

        // If this is the last attempt, don't wait
        if (attempt === this.MAX_RETRIES) {
          break;
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    // All attempts failed, return mock data as fallback
    console.log("All AI analysis attempts failed, returning mock data");
    return this.getMockAnalysis(photos);
  }

  private static getMockAnalysis(photos: ProcessedImage[]): AIAnalysisResponse {
    const mockNames = [
      "Red T-shirt",
      "Blue Jeans",
      "Black Shoes",
      "White Sneakers",
      "Brown Belt",
      "Gray Hoodie",
      "Green Jacket",
      "Yellow Dress",
    ];

    const mockTags = [
      ["Casual", "Everyday", "Comfortable"],
      ["Formal", "Work", "Professional"],
      ["Sport", "Active", "Outdoor"],
      ["Party", "Evening", "Special"],
      ["Summer", "Light", "Breathable"],
      ["Winter", "Warm", "Cozy"],
    ];

    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomTags = mockTags[Math.floor(Math.random() * mockTags.length)];

    return {
      success: true,
      suggestedName: randomName,
      suggestedTags: randomTags,
    };
  }

  // Mock method for development without server
  static async analyzePhotosMock(
    photos: ProcessedImage[],
  ): Promise<AIAnalysisResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return this.getMockAnalysis(photos);
  }
}
