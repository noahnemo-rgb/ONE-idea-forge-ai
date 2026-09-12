import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import {
  History as HistoryIcon,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ideas"],
    queryFn: async () => {
      const response = await fetch("/api/ideas");
      if (!response.ok) throw new Error("Failed to fetch ideas");
      return response.json();
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HistoryIcon size={48} color={theme.colors.border} />
        <Text style={{ marginTop: 20, color: theme.colors.textSecondary }}>
          Loading history...
        </Text>
      </View>
    );
  }

  const ideas = data?.ideas || [];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.colors.statusBarStyle} />

      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
          paddingBottom: 20,
        }}
      >
        <Text
          style={{ fontSize: 28, fontWeight: "700", color: theme.colors.text }}
        >
          History
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>
          Your past generations
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {ideas.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <HistoryIcon size={64} color={theme.colors.border} />
            <Text
              style={{
                marginTop: 20,
                fontSize: 18,
                fontWeight: "600",
                color: theme.colors.text,
              }}
            >
              No history yet
            </Text>
            <Text
              style={{
                marginTop: 8,
                color: theme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              Start forging ideas to see them here.
            </Text>
          </View>
        ) : (
          ideas.map((idea, index) => (
            <TouchableOpacity
              key={idea.id}
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}
                >
                  {idea.title}
                </Text>
                <Text
                  style={{ fontSize: 14, color: theme.colors.textSecondary }}
                  numberOfLines={1}
                >
                  {idea.prompt}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.textTertiary,
                    marginTop: 4,
                  }}
                >
                  {new Date(idea.created_at).toLocaleDateString()}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
