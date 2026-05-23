import { Fonts } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const statsStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    opacity: 0.65,
    fontFamily: Fonts.sans,
    marginBottom: 20,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  kpiTile: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiTileAccent: {
    backgroundColor: "#000",
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    fontFamily: Fonts.sans,
  },
  kpiValueLight: {
    color: "#fff",
  },
  kpiLabel: {
    fontSize: 11,
    marginTop: 4,
    color: "#666",
    fontFamily: Fonts.sans,
    textAlign: "center",
  },
  kpiLabelLight: {
    color: "rgba(255,255,255,0.75)",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.sans,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
  },
  attentionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  attentionRowLast: {
    borderBottomWidth: 0,
  },
  attentionLabel: {
    fontSize: 15,
    fontFamily: Fonts.sans,
    flex: 1,
  },
  attentionCount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 8,
    fontFamily: Fonts.sans,
  },
  barRow: {
    marginBottom: 12,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    flex: 1,
    marginRight: 8,
  },
  barCount: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  barTrack: {
    height: 8,
    backgroundColor: "#e8e8e8",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 4,
  },
  tagStatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  tagStatCount: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  capsuleSummary: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  capsuleLine: {
    fontSize: 15,
    fontFamily: Fonts.sans,
    marginBottom: 6,
  },
  capsuleLink: {
    marginTop: 8,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  recentScroll: {
    marginHorizontal: -4,
  },
  recentList: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 4,
  },
  recentCard: {
    width: 88,
    alignItems: "center",
  },
  recentImage: {
    width: 88,
    height: 88,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  recentName: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
    fontFamily: Fonts.sans,
  },
  shortcutRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  shortcutChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  shortcutText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
  emptyBlock: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Fonts.sans,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.65,
    marginBottom: 24,
    fontFamily: Fonts.sans,
  },
  emptyButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  skeletonBlock: {
    height: 80,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginBottom: 16,
  },
  mutedText: {
    fontSize: 14,
    opacity: 0.5,
    fontFamily: Fonts.sans,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff8e6",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  ratingText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
});
