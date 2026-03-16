import { StyleSheet } from 'react-native';

export const addItemStyles = StyleSheet.create({
  // Common header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 32,
    color: '#000000ff',
  },
  title: {
    flex: 1,
  },

  // Common error styles (with default red theme)
  errorContainer: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },

  // Alternative error styles (for details.tsx)
  errorContainerAlt: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  errorTextAlt: {
    color: '#d32f2f',
    fontSize: 14,
  },

  // Common next button container
  nextContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },

  // Common modal styles
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
    width: '80%',
    maxWidth: 300,
  },
  modalOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCancel: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  // Common picker style
  picker: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },

  // Common textarea style
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
