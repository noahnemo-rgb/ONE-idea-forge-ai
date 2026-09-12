import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, FileText, Shield, Scale, Info } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function TermsOfServiceScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        'IdeaForge ("we," "us," or "our") provides an AI-powered tool for generating and validating app ideas. These Terms govern your access and use. We may update them; continued use constitutes acceptance.',
      icon: <Info size={20} color={theme.colors.primary} />,
    },
    {
      title: "2. Account and Responsibilities",
      content:
        "• You must be 13 or older to use the App.\n• You are responsible for your account security and activity.\n• You agree not to use the App for unlawful, harmful, or abusive purposes, including generating content that promotes hate, violence, or illegal activity.",
      icon: <Shield size={20} color={theme.colors.primary} />,
    },
    {
      title: "3. Pro Plan Subscription",
      content:
        "• The Pro Plan offers unlimited generations and premium features.\n• On mobile: Purchased via Apple In-App Purchases (iOS) or Google Play Billing (Android).\n• On web: Purchased via Stripe.\n• Subscriptions auto-renew until canceled. Refunds per platform policies (Apple, Google, Stripe).\n• All revenue, after platform fees, supports charitable programs and projects of the ONE Church Trust.",
      icon: <Scale size={20} color={theme.colors.primary} />,
    },
    {
      title: "4. User Content and Generated Ideas",
      content:
        '• Prompts and generated ideas ("Content") are your responsibility.\n• You own your Content but grant us a worldwide, non-exclusive, royalty-free license to use, store, and display it as needed to provide the service.\n• We do not claim ownership of ideas generated. You are free to build, launch, or monetize them.',
      icon: <FileText size={20} color={theme.colors.primary} />,
    },
    {
      title: "5. Third-Party AI Models and API Keys",
      content:
        "• You may provide your own API keys for third-party AI services (e.g., OpenAI, Anthropic).\n• Use is subject to those providers' terms and pricing. We are not responsible for their services or charges.",
      icon: <Info size={20} color={theme.colors.primary} />,
    },
    {
      title: "6. Intellectual Property",
      content:
        "• The App, design, code, and branding are owned by IdeaForge or its licensors.\n• You may not copy, modify, reverse-engineer, or distribute the App except as permitted.",
      icon: <Shield size={20} color={theme.colors.primary} />,
    },
    {
      title: "7. Disclaimer and Limitation of Liability",
      content:
        '• The App is provided "as is" without warranties.\n• Generated ideas are AI outputs—not guaranteed accurate, novel, or commercially viable.\n• We are not liable for indirect damages or losses from use (e.g., business decisions based on ideas).\n• Liability limited to fees paid in the prior 12 months.',
      icon: <Scale size={20} color={theme.colors.primary} />,
    },
    {
      title: "8. Termination",
      content:
        "• We may suspend or terminate access for violations of these Terms.\n• You may delete your account anytime via Settings.",
      icon: <Shield size={20} color={theme.colors.primary} />,
    },
    {
      title: "9. Governing Law",
      content:
        "These Terms are governed by the laws of Monroe County, Florida, the United States. Disputes resolved through binding arbitration or small claims court, at our discretion.",
      icon: <Scale size={20} color={theme.colors.primary} />,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.colors.statusBarStyle} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 15,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.background,
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
          Terms of Service
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            IdeaForge Terms
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
              backgroundColor: theme.colors.primary + "15",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.colors.primary + "30",
              gap: 6,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.colors.primary,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: theme.colors.primary,
              }}
            >
              Last updated: December 21, 2025
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginBottom: 32,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.text,
              lineHeight: 24,
              marginBottom: 24,
              opacity: 0.8,
            }}
          >
            Welcome to IdeaForge. By using our mobile and web application (the
            "App"), you agree to these Terms of Service ("Terms"). If you do not
            agree, please do not use the App.
          </Text>

          {sections.map((section, index) => (
            <View key={index} style={{ marginBottom: 32 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: theme.colors.primary + "15",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {section.icon}
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: theme.colors.text,
                  }}
                >
                  {section.title}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 15,
                  color: theme.colors.textSecondary,
                  lineHeight: 22,
                  paddingLeft: 48,
                }}
              >
                {section.content}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            backgroundColor: theme.colors.primary + "10",
            borderRadius: 20,
            padding: 24,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.colors.primary + "30",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Questions?
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.textSecondary,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            If you have any questions about these Terms, please contact us.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              terms-of-service@idea-forge.ai
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 40, alignItems: "center", gap: 12 }}>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.textTertiary,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Thank you for co-creating with IdeaForge. May your sparks become
            validated light in the world.
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "800",
              color: theme.colors.primary,
              letterSpacing: 2,
            }}
          >
            ALL IS ONE AND ONE IS ALL
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
