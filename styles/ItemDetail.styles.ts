import { Fonts } from '@/constants/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const itemDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1000,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Fonts.sans,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  scrollView: {
    flex: 1,
    zIndex: 2, // ScrollView должен быть выше изображения
  },
  scrollContent: {
    paddingBottom: 16, // Значительно увеличиваем для эффекта инерции
  },
  backgroundImageContainer: {
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    height: width,
    zIndex: 0, // Изображение на самом заднем плане
  },
  backgroundMainImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  backgroundPlaceholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  imageSpacer: {
    height: width - 32, // Пробел чтобы изображение было видно в начале
  },
  imageContainer: {
    width: '100%',
    height: width,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  editButtonAction: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts.sans,
  },
  deleteButtonAction: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts.sans,
  },
  content: {
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    marginTop: 0,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: Fonts.sans,
  },
  categories: {
    marginBottom: 16,
    paddingBottom: 16,  
    borderBottomColor: '#00000050',
    borderBottomWidth: 1,
  },
  categoriesText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Fonts.sans,
  },
  lastCategoriesText: {
    textDecorationLine: 'underline',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Fonts.sans,
  },
  section: {
    marginBottom: 24,
  },
  description: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#000000bf',
    lineHeight: 14 * 1.5,
    fontFamily: Fonts.sans,
  },
  addLink: {
  },
  addLinkText: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  purchaseInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: Fonts.sans,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    fontFamily: Fonts.sans,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Fonts.sans,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  favoriteTag: {
    backgroundColor: '#8b0000',
  },
  darkTag: {
    backgroundColor: '#333',
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: Fonts.sans,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
  capsulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  capsuleCard: {
    width: (width - 52) / 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  capsuleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  capsuleIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    fontFamily: Fonts.sans,
  },
  capsuleName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
    fontFamily: Fonts.sans,
  },
  capsuleCount: {
    fontSize: 14,
    color: '#666',
    fontFamily: Fonts.sans,
  },
  addCapsuleCard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  addCapsuleText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: Fonts.sans,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    fontFamily: Fonts.sans,
  },
});
