import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export interface ProcessedImage {
  uri: string;
  width: number;
  height: number;
}

export const requestCameraPermissions = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }
  return true;
};

export const requestMediaLibraryPermissions = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }
  return true;
};

export const captureFromCamera = async (): Promise<ProcessedImage | null> => {
  const hasPermission = await requestCameraPermissions();
  if (!hasPermission) {
    throw new Error('Camera permission is required');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    return await processImage(asset.uri, asset.width, asset.height);
  }
  return null;
};

export const pickFromGallery = async (): Promise<ProcessedImage | null> => {
  const hasPermission = await requestMediaLibraryPermissions();
  if (!hasPermission) {
    throw new Error('Media library permission is required');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    return await processImage(asset.uri, asset.width, asset.height);
  }
  return null;
};

const processImage = async (uri: string, width: number, height: number): Promise<ProcessedImage> => {
  const maxSize = 1920;
  let processedUri = uri;
  let finalWidth = width;
  let finalHeight = height;

  // Resize if needed to keep longest side <= maxSize
  if (width > maxSize || height > maxSize) {
    const scale = maxSize / Math.max(width, height);
    finalWidth = Math.round(width * scale);
    finalHeight = Math.round(height * scale);

    // Using deprecated API temporarily - modern API has import issues
    // TODO: Fix modern API import and migrate to new API
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: finalWidth, height: finalHeight } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    processedUri = manipResult.uri;
  } else {
    // Still compress if not resized
    // Using deprecated API temporarily - modern API has import issues
    // TODO: Fix modern API import and migrate to new API
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    processedUri = manipResult.uri;
  }

  return {
    uri: processedUri,
    width: finalWidth,
    height: finalHeight,
  };
};

export const saveImageToAppDirectory = async (imageUri: string, itemId: number, order: number): Promise<string> => {
  const fileName = `item_${itemId}_img_${order}_${Date.now()}.jpg`;
  const destinationUri = `${(FileSystem as any).documentDirectory || ''}${fileName}`;
  
  await FileSystem.moveAsync({
    from: imageUri,
    to: destinationUri,
  });
  
  return destinationUri;
};
