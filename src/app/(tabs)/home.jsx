import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Sparkles,
  TrendingUp,
  Settings as SettingsIcon,
  Zap,
  LogOut,
  Star,
  Rocket,
  X,
  BarChart3,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { signIn, signOut, isAuthenticated, isReady } = useAuth();
  const { data: user, loading: userLoading } = useUser();
  const { isPro, credits, refetch: refetchSubscription } = useSubscription();

  const [prompt, setPrompt] = useState("");
  const [isTrendingEnabled, setIsTrendingEnabled] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [showMigrationModal, setShowMigrationModal] = useState(false);

  const inspirations = [
    {
      name: "Notion",
      description: "All-in-one workspace",
      prompt:
        "A modular workspace for teams to collaborate on docs, tasks, and databases with a clean, block-based interface.",
    },
    {
      name: "Duolingo",
      description: "Gamified learning",
      prompt:
        "A gamified education app that uses streaks, leaderboards, and bite-sized lessons to teach new skills.",
    },
    {
      name: "Calm",
      description: "Mental wellness app",
      prompt:
        "A mental wellness app focused on guided meditations, sleep stories, and ambient soundscapes for stress relief.",
    },
    {
      name: "Airbnb",
      description: "Travel marketplace",
      prompt:
        "A marketplace for unique travel stays and experiences, connecting hosts with travelers worldwide.",
    },
    {
      name: "Uber",
      description: "On-demand logistics",
      prompt:
        "A real-time logistics platform for on-demand transportation and food delivery with seamless payments.",
    },
    {
      name: "Slack",
      description: "Team communication",
      prompt:
        "A channel-based communication platform for teams with deep integrations and searchable message history.",
    },
    {
      name: "Spotify",
      description: "Music streaming",
      prompt:
        "A music streaming service that uses AI to provide personalized playlists and discovery for millions of tracks.",
    },
    {
      name: "Tinder",
      description: "Social discovery",
      prompt:
        "A social discovery app using a swipe-based interface to connect people based on location and interests.",
    },
    {
      name: "Robinhood",
      description: "Investing platform",
      prompt:
        "A simplified investing platform that makes stock and crypto trading accessible to everyone with zero commissions.",
    },
    {
      name: "Strava",
      description: "Social fitness network",
      prompt:
        "A fitness tracking app that combines GPS data with social features like segments, clubs, and leaderboards.",
    },
  ];

  const handleReverseEngineer = (seedPrompt) => {
    setPrompt(seedPrompt);
    // Scroll to top is handled by the ScrollView naturally if we just set the state
  };

  const profile = user; // Fallback to user data if needed
  const hasAskedMigration = profile?.has_asked_migration;

  // Check for anonymous data and show migration modal
  useEffect(() => {
    const checkMigration = async () => {
      if (isAuthenticated && isReady && hasAskedMigration === false) {
        try {
          const res = await fetch("/api/auth/migrate");
          const data = await res.json();

          if (data.exists) {
            setShowMigrationModal(true);
          }
        } catch (err) {
          console.error("Migration check failed", err);
        }
      }
    };

    checkMigration();
  }, [isAuthenticated, isReady, hasAskedMigration]);

  const handleApproveMigration = async () => {
    try {
      const res = await fetch("/api/auth/migrate", { method: "POST" });
      const data = await res.json();
      console.log(`Migrated ${data.migratedCount} ideas.`);
      setShowMigrationModal(false);
      refetchSubscription();
    } catch (err) {
      console.error("Migration failed", err);
    }
  };

  const handleDeclineMigration = async () => {
    try {
      await fetch("/api/auth/migrate", { method: "PATCH" });
      setShowMigrationModal(false);
      refetchSubscription();
    } catch (err) {
      console.error("Failed to decline migration", err);
    }
  };

  const exampleSeeds = [
    "Fitness tracker for seniors",
    "AI-powered meal planner",
    "Mental health journal for devs",
    "Sustainable travel planner",
    "Local community marketplace",
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    if (!isAuthenticated) {
      signIn();
      return;
    }

    if (!isPro && credits <= 0) {
      router.push("/settings");
      return;
    }

    router.push({
      pathname: "/results",
      params: { prompt, trending: isTrendingEnabled },
    });
  };

  // Fetch Market Trends
  const { data: trendsData, isLoading: trendsLoading } = useQuery({
    queryKey: ["marketTrends"],
    queryFn: async () => {
      const res = await fetch("/api/trends");
      if (!res.ok) throw new Error("Failed to fetch trends");
      return res.json();
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.colors.statusBarStyle} />

      <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Launch Promo Banner */}
          {showPromo && (
            <View
              style={{
                backgroundColor: theme.colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Rocket size={16} color="white" style={{ marginRight: 8 }} />
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  fontWeight: "700",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                Launch Special: 50% OFF Pro! Use code LAUNCH50
              </Text>
              <TouchableOpacity onPress={() => setShowPromo(false)}>
                <X size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
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
                  IdeaForge
                </Text>
                <Text
                  style={{ fontSize: 16, color: theme.colors.textSecondary }}
                >
                  {isAuthenticated
                    ? `Welcome, ${user?.name || "Builder"}`
                    : "AI App Idea Generator"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => router.push("/settings")}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.colors.surface,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  }}
                >
                  <SettingsIcon size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Credits Counter for Free Users */}
            {isAuthenticated && !isPro && (
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  padding: 12,
                  borderRadius: 16,
                  marginBottom: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Zap
                  size={16}
                  color={theme.colors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: theme.colors.text, fontWeight: "600" }}>
                  {credits} generations left today
                </Text>
              </View>
            )}

            {/* Main Input Area */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                What are you building?
              </Text>
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  minHeight: 160,
                }}
              >
                <TextInput
                  multiline
                  placeholder="Enter a seed idea, niche, or problem..."
                  placeholderTextColor={theme.colors.placeholder}
                  style={{
                    fontSize: 18,
                    color: theme.colors.text,
                    textAlignVertical: "top",
                    flex: 1,
                  }}
                  value={prompt}
                  onChangeText={setPrompt}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={handleGenerate}
                    disabled={!prompt.trim()}
                    style={{
                      backgroundColor: prompt.trim()
                        ? theme.colors.primary
                        : theme.colors.border,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Sparkles
                      size={18}
                      color="white"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={{ color: "white", fontWeight: "600" }}>
                      {!isAuthenticated
                        ? "Sign in to Forge"
                        : !isPro && credits <= 0
                          ? "Upgrade to Forge"
                          : "Forge Ideas"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Market Trends Dashboard */}
            <View style={{ marginBottom: 32 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: "#E8F5E9",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <BarChart3 size={20} color="#2E7D32" />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: theme.colors.text,
                      }}
                    >
                      Market Trends
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.colors.textSecondary,
                      }}
                    >
                      Emerging opportunities
                    </Text>
                  </View>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ gap: 12 }}
              >
                {trendsLoading
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <View
                          key={i}
                          style={{
                            width: 160,
                            height: 100,
                            backgroundColor: theme.colors.surface,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                          }}
                        />
                      ))
                  : trendsData?.trends?.map((trend) => (
                      <View
                        key={trend.id}
                        style={{
                          width: 160,
                          backgroundColor: theme.colors.surface,
                          padding: 16,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: theme.colors.border,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: "700",
                            color: "#2E7D32",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          {trend.category}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: theme.colors.text,
                            marginBottom: 4,
                          }}
                          numberOfLines={2}
                        >
                          {trend.topic}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: theme.colors.textTertiary,
                          }}
                        >
                          {trend.source}
                        </Text>
                      </View>
                    ))}
              </ScrollView>
            </View>

            {/* Example Seeds */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: theme.colors.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 12,
                }}
              >
                Example Seeds
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {exampleSeeds.map((seed, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setPrompt(seed)}
                    style={{
                      backgroundColor: theme.colors.surface,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 14,
                      }}
                    >
                      {seed}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Inspiration Section */}
            <View style={{ marginBottom: 32 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "#FFF9C4",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Star size={20} color="#FBC02D" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: theme.colors.text,
                    }}
                  >
                    Get Inspired
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: theme.colors.textSecondary }}
                  >
                    Reverse engineer successful apps
                  </Text>
                </View>
              </View>

              <View style={{ gap: 12 }}>
                {inspirations.map((app, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleReverseEngineer(app.prompt)}
                    style={{
                      backgroundColor: theme.colors.surface,
                      padding: 16,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontWeight: "700",
                          color: theme.colors.text,
                          fontSize: 15,
                        }}
                      >
                        {app.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {app.description}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: theme.colors.primary + "10",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: theme.colors.primary,
                          fontSize: 10,
                          fontWeight: "700",
                        }}
                      >
                        REVERSE
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Toggles */}
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "#E8F5E9",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <TrendingUp size={20} color="#2E7D32" />
                </View>
                <View>
                  <Text style={{ fontWeight: "600", color: theme.colors.text }}>
                    Trend Integration
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: theme.colors.textSecondary }}
                  >
                    Mix in current market trends
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setIsTrendingEnabled(!isTrendingEnabled)}
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: isTrendingEnabled
                    ? theme.colors.primary
                    : theme.colors.border,
                  padding: 2,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "white",
                    transform: [{ translateX: isTrendingEnabled ? 22 : 0 }],
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Pro Banner */}
            {!isPro && (
              <TouchableOpacity
                onPress={() => router.push("/settings")}
                style={{
                  marginTop: 24,
                  backgroundColor: theme.colors.primary,
                  borderRadius: 16,
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Zap size={24} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: "white", fontWeight: "700", fontSize: 16 }}
                  >
                    Upgrade to Pro
                  </Text>
                  <Text
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}
                  >
                    Unlimited generations & premium models
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingAnimatedView>

      {/* Migration Consent Modal */}
      <Modal
        visible={showMigrationModal}
        transparent
        animationType="slide"
        onRequestClose={handleDeclineMigration}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15, 10, 24, 0.95)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#1A1425",
              borderRadius: 32,
              padding: 32,
              width: "100%",
              borderWidth: 1,
              borderColor: theme.colors.primary + "40",
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: theme.colors.primary,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
              }}
            >
              <Sparkles size={32} color="white" />
            </View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "white",
                marginBottom: 12,
                letterSpacing: -0.5,
              }}
            >
              Keep your{" "}
              <Text style={{ color: theme.colors.primary }}>sparks?</Text>
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 24,
                marginBottom: 32,
              }}
            >
              We found some ideas you created while exploring. Would you like to
              save them to your account so you never lose them?
            </Text>
            <View style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={handleApproveMigration}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 18,
                  borderRadius: 16,
                  alignItems: "center",
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "700", fontSize: 18 }}
                >
                  Yes, Save My Ideas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeclineMigration}
                style={{
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <Text
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  No thanks, start fresh
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
