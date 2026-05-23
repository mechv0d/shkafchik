import { StyleSheet } from 'react-native';

export const tagDetailStyles = StyleSheet.create({
  // Tags container
  tagsContainer: {
    flex: 1,
  },
  
  // Tags list
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  // Load more button
  loadMoreButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  
  loadMoreText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Modal content
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  
  // Modal tag display
  modalTag: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  
  modalTagText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Modal buttons
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  deleteButtonText: {
    color: '#fff',
  },
  
  // Modal items section
  modalItems: {
    maxHeight: 200,
    marginBottom: 20,
  },
  
  modalItemsTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  
  // Close button
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  
  closeButtonText: {
    color: '#333',
    fontSize: 16,
  },
  
  // Create modal
  createModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 300,
  },
  
  createModalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Color picker
  colorPicker: {
    marginBottom: 16,
  },
  
  colorLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  
  colorList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
  },
  
  selectedColorOption: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f3ff',
    minWidth: 100,
  },
  
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  colorName: {
    fontSize: 14,
    color: '#333',
  },
  
  // Create modal buttons
  createModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  
  saveButton: {
    backgroundColor: '#007AFF',
  },
  
  // Header specific styles
  headerBackButton: {
    marginRight: 16,
    padding: 8,
  },
  
  headerBackText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  
  headerTitle: {
    flex: 1,
  },
  
  createButton: {
    backgroundColor: '#000',
    // width: 32,
    // height: 32,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    // fontWeight: 'bold',
  },
  
  // Protected tag styles
  protectedTag: {
    opacity: 0.6,
  },
});
