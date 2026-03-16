import { Fonts } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const itemsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingTop: 30,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontFamily: Fonts.sans,
  },
});
