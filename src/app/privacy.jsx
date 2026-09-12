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
import {
  ArrowLeft,
  Shield,
  Mail,
  Lock,
  Eye,
  Database,
  Share2,
  UserCheck,
  AlertCircle,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const SectionHeader = ({ icon: Icon, title, color }) => (
    <View style={styles.sectionHeader}>
      <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
    </View>
  );

  const BulletPoint = ({ text, color = theme.colors.primary }) => (
    <View style={styles.bulletRow}>
      <Text style={[styles.bullet, { color }]}>•</Text>
      <Text style={[styles.bulletText, { color: theme.colors.textSecondary }]}>
        {text}
      </Text>
    </View>
  );

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
          Privacy Policy
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
        <View style={styles.introCard}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.colors.primary + "15",
                borderColor: theme.colors.primary + "30",
              },
            ]}
          >
            <View
              style={[
                styles.badgeDot,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
              Last updated: December 21, 2025
            </Text>
          </View>
          <Text
            style={[styles.introText, { color: theme.colors.textSecondary }]}
          >
            IdeaForge ("we," "us," or "our") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, store,
            and protect your information when you use our mobile and web
            application (the "App").
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeader
            icon={Eye}
            title="1. Information We Collect"
            color="#A855F7"
          />
          <BulletPoint text="Account Information: When you create an account, we collect your email address and any information you provide during sign-up (via email/password or Google sign-in)." />
          <BulletPoint text="Usage Data: We collect anonymous data about your app ideas and generations (prompts and results) to provide the service. This data starts anonymous and may be migrated to your account with your explicit consent." />
          <BulletPoint text="User-Provided API Keys: If you enter API keys for third-party AI models, these are stored securely on your device only." />
          <BulletPoint text="Analytics: Aggregated, anonymized usage statistics to improve the App." />

          <View
            style={[
              styles.alertBox,
              { backgroundColor: "#EAB30810", borderColor: "#EAB30830" },
            ]}
          >
            <AlertCircle size={16} color="#EAB308" />
            <Text style={styles.alertText}>
              We do NOT collect sensitive personal information, payment details,
              or precise location.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            icon={UserCheck}
            title="2. How We Use Your Information"
            color="#3B82F6"
          />
          <BulletPoint
            text="To provide and maintain the App (generating ideas, saving history, managing subscriptions)."
            color="#3B82F6"
          />
          <BulletPoint
            text="To migrate anonymous generations to your account (only with consent)."
            color="#3B82F6"
          />
          <BulletPoint
            text="To process Pro Plan subscriptions."
            color="#3B82F6"
          />
          <BulletPoint
            text="To communicate updates, support responses, or security alerts."
            color="#3B82F6"
          />
          <BulletPoint
            text="For anonymized analytics to enhance features."
            color="#3B82F6"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader
            icon={Database}
            title="3. Data Storage and Security"
            color="#22C55E"
          />
          <BulletPoint
            text="Account and usage data is stored securely in our database (PostgreSQL via Neon)."
            color="#22C55E"
          />
          <BulletPoint
            text="User-provided API keys are encrypted on your device using platform-secure storage (iOS Keychain / Android Keystore)."
            color="#22C55E"
          />
          <BulletPoint
            text="We use industry-standard encryption and security practices."
            color="#22C55E"
          />
        </View>

        <View
          style={[
            styles.highlightBox,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.highlightTitle, { color: theme.colors.text }]}>
            4. Anonymous Data Migration
          </Text>
          <Text
            style={[
              styles.highlightText,
              { color: theme.colors.textSecondary },
            ]}
          >
            When you log in, previously generated ideas (stored anonymously) can
            be associated with your account for persistence. We will ask for
            your explicit consent before migrating.
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeader
            icon={Share2}
            title="5. Sharing Your Information"
            color="#F97316"
          />
          <Text
            style={[styles.bodyText, { color: theme.colors.textSecondary }]}
          >
            We do not sell your data. We may share with service providers under
            strict confidentiality or as required by law.
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon={Lock} title="6. Your Rights" color="#EC4899" />
          <BulletPoint
            text="Access, correct, or delete your data: Contact us or use in-app features."
            color="#EC4899"
          />
          <BulletPoint
            text="Withdraw consent: Decline migration or delete account."
            color="#EC4899"
          />
          <BulletPoint
            text="Opt-out: Limited, as data is essential for core use."
            color="#EC4899"
          />
        </View>

        <View style={styles.footer}>
          <View
            style={[
              styles.contactCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Mail size={20} color={theme.colors.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text
                style={[
                  styles.contactLabel,
                  { color: theme.colors.textTertiary },
                ]}
              >
                Questions?
              </Text>
              <Text style={[styles.contactEmail, { color: theme.colors.text }]}>
                privacy@idea-forge.ai
              </Text>
            </View>
          </View>
          <Text style={[styles.thankYou, { color: theme.colors.textTertiary }]}>
            Thank you for trusting IdeaForge.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  introCard: {
    marginBottom: 32,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  lastUpdated: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 18,
    marginRight: 10,
    marginTop: -2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  alertBox: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    alignItems: "center",
    gap: 10,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: "#A16207",
    fontStyle: "italic",
  },
  highlightBox: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
  },
  contactLabel: {
    fontSize: 12,
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: "600",
  },
  thankYou: {
    fontSize: 12,
    textAlign: "center",
  },
});
