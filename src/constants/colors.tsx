export const COLORS = {
  // Main Brand Colors
  primary: "#0e4a7b",
  primaryHover: "#0a365a", // Darker shade for primary button hovers
  primaryLight: "#f0f9ff", // Very light shade for row hovers or light accents

  // Functional Colors
  success: "#16a34a",
  danger: "#dc2626",
  dangerLight: "#f87171",
  warning: "#f97316",
  info: "#60a5fa",

  // Neutrals
  white: "#ffffff",
  background: "#f9fafb", // gray-50
  neutralHover: "#e5e7eb", // gray-200 (Added for generic button hovers)

  // Borders & Text
  border: "#e5e7eb",
  borderDark: "#d1d5db",
  textPrimary: "#374151",
  textSecondary: "#4b5563",
  textMuted: "#9ca3af",

  // UI Specific
  rowHover: "#f0f9ff", // Added: Specific color for table row hovers (matches primaryLight)
  scrollbarTrack: "#f1f5f9",
  scrollbarThumb: "#0e4a7b",
  scrollbarThumbHover: "#0c3b62",
  borderTrack: "#f3f4f6",
} as const;
