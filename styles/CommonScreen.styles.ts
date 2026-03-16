import { Fonts } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const commonScreenStyles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    padding: 16,
    marginTop: 24,
    backgroundColor: '#ffffff',
  },
  
  // Header styles
  header: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 16, // Consistent top padding for status bar
    paddingBottom: 16,
    paddingHorizontal: 4,
    marginBottom: 16,
    gap: 16,
    justifyContent: 'flex-start',
  },
  
  // Title styles
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.sans,
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    opacity: 0.7,
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    fontFamily: Fonts.sans,
    fontSize: 16,
  },
  
  // Button styles
  button: {
    backgroundColor: '#000000ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000000ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  
  buttonSecondaryText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  
  // Card styles
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    elevation: 0,
    paddingVertical: 8,
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    marginBottom: 8,
  },
  
  cardSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    opacity: 0.7,
  },
  
  // List styles
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  
  // Empty state styles
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    textAlign: 'center',
    marginBottom: 8,
  },
  
  emptyStateSubtext: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    opacity: 0.7,
  },
  
  // Floating action button
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1000,
  },
  
  // Badge styles
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Fonts.sans,
  },
  
  // Section styles
  section: {
    marginBottom: 24,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    marginBottom: 16,
  },
  
  // Spacing utilities
  spacer: {
    height: 16,
  },
  
  smallSpacer: {
    height: 8,
  },
  
  largeSpacer: {
    height: 24,
  },

  // Search specific styles
  searchSection: {
    padding: 0,
    paddingBottom: 16,
  },
  
  searchSectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    gap: 12,
  },
  
  searchSectionInput: {
    flex: 1,
    fontSize: 16,
  },
  
  searchControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  searchButton: {
    paddingVertical: 8,
  },
  
  searchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  
  searchText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    padding: 0,
  },
  
  searchFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  
  searchFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

// Dark mode variants
export const darkScreenStyles = StyleSheet.create({
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333333',
    color: '#ffffff',
  },
  
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333333',
    color: '#ffffff',
  },
  
  card: {
    backgroundColor: '#1a1a1a',
  },
});
