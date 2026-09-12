import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bookmark, Plus, Folder } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function CollectionsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const collections = [
    { id: 1, name: "SaaS Ideas", count: 12 },
    { id: 2, name: "Mobile Apps", count: 8 },
    { id: 3, name: "AI Tools", count: 5 },
    { id: 4, name: "E-commerce", count: 3 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.colors.statusBarStyle} />

      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
          paddingBottom: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: theme.colors.text,
            }}
          >
            Saved
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>
            Your curated collections
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {collections.map((collection) => (
            <TouchableOpacity
              key={collection.id}
              style={{
                width: "47%",
                backgroundColor: theme.colors.surface,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: theme.colors.border,
                aspectRatio: 1,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: theme.colors.buttonSecondary,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Folder size={24} color={theme.colors.primary} />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: theme.colors.text,
                  marginBottom: 4,
                }}
              >
                {collection.name}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                {collection.count} ideas
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginTop: 40 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: theme.colors.text,
              marginBottom: 16,
            }}
          >
            All Favorites
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: theme.colors.border,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: "#FFF9C4",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Bookmark size={20} color="#FBC02D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600", color: theme.colors.text }}>
                View all bookmarked ideas
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                28 items
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
