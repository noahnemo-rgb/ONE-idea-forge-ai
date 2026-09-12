import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    isDark,
    colors: {
      background: isDark ? "#0F0A18" : "#FFFFFF",
      surface: isDark ? "#1A1425" : "#F8F8FA",
      surfaceElevated: isDark ? "#251D35" : "#FFFFFF",
      text: isDark ? "#FFFFFF" : "#0F0A18",
      textSecondary: isDark ? "rgba(255, 255, 255, 0.7)" : "#736B82",
      textTertiary: isDark ? "rgba(255, 255, 255, 0.5)" : "#A09AA8",
      primary: "#6855FF",
      primaryDark: "#5444D1",
      border: isDark ? "#2A2238" : "#EAEAEA",
      inputBackground: isDark ? "#1A1425" : "#F3F3F5",
      placeholder: isDark ? "rgba(255, 255, 255, 0.3)" : "#A09AA8",
      statusBarStyle: isDark ? "light" : "dark",
      cardBackground: isDark ? "#1A1425" : "#FFFFFF",
      cardBorder: isDark ? "#2A2238" : "#F0F0F2",
      buttonSecondary: isDark ? "#251D35" : "#ECE8FF",
      buttonSecondaryText: isDark ? "#FFFFFF" : "#6855FF",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
