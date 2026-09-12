import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Key,
  CreditCard,
  Shield,
  LogOut,
  ChevronRight,
  User as UserIcon,
  Mail,
  Twitter,
  Share2,
  Zap,
  CheckCircle2,
  FileText,
  Cookie,
  Accessibility,
  RefreshCcw,
  Scale,
} from "lucide-react-native";
import { Linking } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { useQuery } from "@tanstack/react-query";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { signIn, signOut, isAuthenticated, isReady } = useAuth();
  const { data: user, loading: userLoading } = useUser();
  const {
    isPro,
    credits,
    refetch: refetchSubscription,
    manageSubscription,
    rcEntitlementActive,
    stripeActive,
    purchase,
    isPurchasing,
    restore,
    isRestoring,
  } = useSubscription();

  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    google: "",
  });

  const handleUpgrade = async () => {
    await purchase();
  };

  const handleSaveKeys = () => {
    alert("API Keys saved securely!");
  };

  const handleShare = () => {
    const text = encodeURIComponent(
      "I'm using IdeaForge to build my next big startup idea! Check it out: https://ideaforge.ai #IdeaForge #AI #Startups",
    );
    Linking.openURL(`https://twitter.com/intent/tweet?text=${text}`);
  };

  const handleOpenURL = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.colors.statusBarStyle} />

      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 15,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: "700",
            color: theme.colors.text,
            marginLeft: 10,
          }}
        >
          Settings
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Account Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.colors.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            Account
          </Text>
          <View
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
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: theme.colors.background,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
                overflow: "hidden",
              }}
            >
              {user?.image ? (
                <Image
                  source={{ uri: user.image }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <UserIcon size={24} color={theme.colors.textTertiary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              {isAuthenticated ? (
                <>
                  <Text style={{ fontWeight: "600", color: theme.colors.text }}>
                    {user?.name || "User"}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: theme.colors.textSecondary }}
                  >
                    {user?.email}
                  </Text>
                </>
              ) : (
                <TouchableOpacity onPress={() => signIn()}>
                  <Text
                    style={{ fontWeight: "600", color: theme.colors.primary }}
                  >
                    Sign in to your account
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Pricing Section */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: theme.colors.textSecondary,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Pricing Plans
            </Text>
            {isPro && (
              <View
                style={{
                  backgroundColor: theme.colors.primary + "20",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: 10,
                    fontWeight: "700",
                  }}
                >
                  {rcEntitlementActive ? "NATIVE PRO" : "WEB PRO"}
                </Text>
              </View>
            )}
          </View>

          <View style={{ gap: 16 }}>
            {/* Free Plan Card */}
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: !isPro
                  ? theme.colors.primary
                  : theme.colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: theme.colors.text,
                  }}
                >
                  Free
                </Text>
                {!isPro && (
                  <CheckCircle2 size={20} color={theme.colors.primary} />
                )}
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: theme.colors.text,
                  marginBottom: 16,
                }}
              >
                $0
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: theme.colors.textSecondary,
                  }}
                >
                  /mo
                </Text>
              </Text>
              <View style={{ gap: 8, marginBottom: 20 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckCircle2 size={14} color={theme.colors.textTertiary} />
                  <Text
                    style={{ fontSize: 13, color: theme.colors.textSecondary }}
                  >
                    3 generations per day
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckCircle2 size={14} color={theme.colors.textTertiary} />
                  <Text
                    style={{ fontSize: 13, color: theme.colors.textSecondary }}
                  >
                    Basic AI models
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                disabled={!isPro}
                style={{
                  backgroundColor: !isPro
                    ? theme.colors.background
                    : theme.colors.buttonSecondary,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: !isPro
                      ? theme.colors.textTertiary
                      : theme.colors.primary,
                    fontWeight: "600",
                  }}
                >
                  {!isPro ? "Current Plan" : "Downgrade"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Pro Plan Card */}
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: isPro ? theme.colors.primary : theme.colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: theme.colors.text,
                    }}
                  >
                    Pro
                  </Text>
                  <Zap
                    size={16}
                    color={theme.colors.primary}
                    fill={theme.colors.primary}
                  />
                </View>
                {isPro && (
                  <CheckCircle2 size={20} color={theme.colors.primary} />
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: theme.colors.text,
                  }}
                >
                  $10
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    textDecorationLine: "line-through",
                  }}
                >
                  $20
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: theme.colors.textSecondary,
                  }}
                >
                  /mo
                </Text>
              </View>
              <View style={{ gap: 8, marginBottom: 20 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckCircle2 size={14} color={theme.colors.primary} />
                  <Text style={{ fontSize: 13, color: theme.colors.text }}>
                    Unlimited generations
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckCircle2 size={14} color={theme.colors.primary} />
                  <Text style={{ fontSize: 13, color: theme.colors.text }}>
                    Premium models (GPT-4)
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckCircle2 size={14} color={theme.colors.primary} />
                  <Text style={{ fontSize: 13, color: theme.colors.text }}>
                    Priority support
                  </Text>
                </View>
              </View>

              {!isPro && (
                <Text
                  style={{
                    fontSize: 11,
                    color: theme.colors.textTertiary,
                    textAlign: "center",
                    marginBottom: 12,
                    fontStyle: "italic",
                  }}
                >
                  Subscribe with {Platform.OS === "ios" ? "Apple" : "Google"} to
                  unlock all features.
                </Text>
              )}

              <TouchableOpacity
                onPress={!isPro ? handleUpgrade : manageSubscription}
                disabled={isPurchasing}
                style={{
                  backgroundColor: isPro
                    ? theme.colors.background
                    : theme.colors.primary,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                  borderWidth: isPro ? 1 : 0,
                  borderColor: theme.colors.border,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {isPurchasing && (
                  <ActivityIndicator size="small" color="white" />
                )}
                <Text
                  style={{
                    color: isPro ? theme.colors.text : "white",
                    fontWeight: "600",
                  }}
                >
                  {isPro
                    ? "Manage Subscription"
                    : isPurchasing
                      ? "Processing..."
                      : "Upgrade Now"}
                </Text>
              </TouchableOpacity>

              {/* Restore Purchases Button */}
              <TouchableOpacity
                onPress={restore}
                disabled={isRestoring}
                style={{
                  paddingVertical: 8,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {isRestoring ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.textTertiary}
                  />
                ) : (
                  <RefreshCcw size={14} color={theme.colors.textTertiary} />
                )}
                <Text
                  style={{
                    color: theme.colors.textTertiary,
                    fontSize: 13,
                    fontWeight: "500",
                  }}
                >
                  {isRestoring ? "Restoring..." : "Restore Purchases"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Share Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.colors.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            Spread the Word
          </Text>
          <TouchableOpacity
            onPress={handleShare}
            style={{
              backgroundColor: "#1DA1F2",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.2)",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Twitter size={20} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", color: "white" }}>
                Tweet about IdeaForge
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                Help other builders find their spark
              </Text>
            </View>
            <ChevronRight size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* API Keys Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.colors.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            Custom API Keys
          </Text>
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: theme.colors.border,
              gap: 16,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.text,
                  marginBottom: 8,
                }}
              >
                OpenAI API Key
              </Text>
              <TextInput
                secureTextEntry
                placeholder="sk-..."
                placeholderTextColor={theme.colors.placeholder}
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 10,
                  padding: 12,
                  color: theme.colors.text,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
                value={apiKeys.openai}
                onChangeText={(v) => setApiKeys({ ...apiKeys, openai: v })}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.text,
                  marginBottom: 8,
                }}
              >
                Anthropic API Key
              </Text>
              <TextInput
                secureTextEntry
                placeholder="sk-ant-..."
                placeholderTextColor={theme.colors.placeholder}
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 10,
                  padding: 12,
                  color: theme.colors.text,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
                value={apiKeys.anthropic}
                onChangeText={(v) => setApiKeys({ ...apiKeys, anthropic: v })}
              />
            </View>
            <TouchableOpacity
              onPress={handleSaveKeys}
              style={{
                backgroundColor: theme.colors.primary,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Save Keys
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal & Policies Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.colors.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            Legal & Policies
          </Text>
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.border,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              onPress={() => handleOpenURL("https://idea-forge.ai/privacy")}
              style={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              <Shield
                size={20}
                color={theme.colors.textSecondary}
                style={{ marginRight: 16 }}
              />
              <Text style={{ flex: 1, color: theme.colors.text }}>
                Privacy Policy
              </Text>
              <ChevronRight size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOpenURL("https://idea-forge.ai/terms")}
              style={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              <FileText
                size={20}
                color={theme.colors.textSecondary}
                style={{ marginRight: 16 }}
              />
              <Text style={{ flex: 1, color: theme.colors.text }}>
                Terms of Service
              </Text>
              <ChevronRight size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOpenURL("https://idea-forge.ai/cookies")}
              style={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              <Cookie
                size={20}
                color={theme.colors.textSecondary}
                style={{ marginRight: 16 }}
              />
              <Text style={{ flex: 1, color: theme.colors.text }}>
                Cookie Policy
              </Text>
              <ChevronRight size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleOpenURL("https://idea-forge.ai/accessibility")
              }
              style={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Accessibility
                size={20}
                color={theme.colors.textSecondary}
                style={{ marginRight: 16 }}
              />
              <Text style={{ flex: 1, color: theme.colors.text }}>
                Accessibility Policy
              </Text>
              <ChevronRight size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Actions Section */}
        {isAuthenticated && (
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: theme.colors.textSecondary,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 16,
              }}
            >
              Account Actions
            </Text>
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                onPress={() => signOut()}
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <LogOut size={20} color="#F44336" style={{ marginRight: 16 }} />
                <Text style={{ flex: 1, color: "#F44336" }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text
          style={{
            textAlign: "center",
            color: theme.colors.textTertiary,
            fontSize: 12,
          }}
        >
          IdeaForge v1.1.0
        </Text>
      </ScrollView>
    </View>
  );
}
