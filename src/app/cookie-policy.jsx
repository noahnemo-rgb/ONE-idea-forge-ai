import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Cookie,
  ShieldCheck,
  Info,
  ExternalLink,
  Mail,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";

export default function CookiePolicyScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const Section = ({ title, children, icon: Icon }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {Icon && (
          <Icon
            size={20}
            color={theme.colors.primary}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.colors.statusBarStyle} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <ArrowLeft size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Cookie Policy
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.primary + "20" },
            ]}
          >
            <Cookie size={32} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            IdeaForge Cookie Policy
          </Text>
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
        </View>

        <Text style={[styles.intro, { color: theme.colors.textSecondary }]}>
          This Cookie Policy explains how IdeaForge ("we," "us," or "our") uses
          cookies and similar technologies in our web and mobile application
          (the "App").
        </Text>

        <Section title="1. What Are Cookies?" icon={Info}>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Cookies are small text files stored on your device when you visit a
            website or use an app. They help provide functionality, remember
            preferences, and improve performance.
          </Text>
        </Section>

        <Section title="2. Cookies We Use" icon={ShieldCheck}>
          <Text
            style={[
              styles.text,
              { color: theme.colors.textSecondary, marginBottom: 16 },
            ]}
          >
            We use only essential cookies necessary for the App to function
            properly:
          </Text>

          <View style={styles.cardList}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Authentication Cookies
              </Text>
              <Text
                style={[styles.cardText, { color: theme.colors.textSecondary }]}
              >
                To keep you logged in and secure your session.
              </Text>
            </View>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Preference Cookies
              </Text>
              <Text
                style={[styles.cardText, { color: theme.colors.textSecondary }]}
              >
                To remember your settings, such as dark/light mode.
              </Text>
            </View>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Functionality Cookies
              </Text>
              <Text
                style={[styles.cardText, { color: theme.colors.textSecondary }]}
              >
                To enable core features like saving idea history.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.noCookiesBox,
              { backgroundColor: "#FF525210", borderColor: "#FF525230" },
            ]}
          >
            <Text style={styles.noCookiesTitle}>WE DO NOT USE:</Text>
            <Text style={styles.noCookiesText}>• Advertising cookies</Text>
            <Text style={styles.noCookiesText}>
              • Tracking cookies for analytics
            </Text>
            <Text style={styles.noCookiesText}>• Social media cookies</Text>
          </View>
        </Section>

        <Section title="3. How We Use Cookies">
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            • To authenticate users and prevent fraudulent activity.{"\n"}• To
            maintain your session and preferences across visits.{"\n"}• To
            ensure smooth operation of features like idea generation and
            history.
          </Text>
        </Section>

        <Section title="4. Third-Party Cookies" icon={ExternalLink}>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            • When using your own API keys (e.g., OpenAI, Anthropic), those
            services may set cookies during requests—subject to their own
            policies.{"\n"}• Apple/Google sign-in may use cookies for
            authentication per their policies.{"\n"}• Payment providers (Apple
            In-App Purchases, Google Play Billing, Stripe on web) may use
            cookies during transactions per their policies.
          </Text>
          <Text
            style={[styles.disclaimer, { color: theme.colors.textTertiary }]}
          >
            We do not control these third-party cookies.
          </Text>
        </Section>

        <Section title="5. Managing Cookies">
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            <Text style={{ fontWeight: "700" }}>Browser Settings:</Text> You can
            block or delete cookies via your browser settings. Note: Disabling
            essential cookies may prevent the App from working properly.{"\n\n"}
            <Text style={{ fontWeight: "700" }}>Mobile:</Text> Cookie management
            depends on your device settings.{"\n\n"}
            <Text style={{ fontWeight: "700" }}>No Cookie Banner:</Text> Since
            we use only essential cookies, no consent banner is required under
            current regulations.
          </Text>
        </Section>

        <Section title="6. Local Storage">
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            We may use browser local storage or device storage for similar
            purposes (e.g., saving anonymous generations before login). These
            are managed like cookies.
          </Text>
        </Section>

        <Section title="7. Changes to This Policy">
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            We may update this policy. Continued use of the App constitutes
            acceptance.
          </Text>
        </Section>

        <Section title="8. Contact" icon={Mail}>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Questions about cookies? Email:{"\n"}
            <Text style={{ color: theme.colors.primary }}>
              noahnemo@gmail.com
            </Text>
          </Text>
        </Section>

        <View style={styles.footer}>
          <Text
            style={[styles.footerQuote, { color: theme.colors.textTertiary }]}
          >
            ALL is One and ONE is All.
          </Text>
          <Text
            style={[
              styles.footerCopyright,
              { color: theme.colors.textTertiary },
            ]}
          >
            © 2025 IdeaForge. Built for builders.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  content: {
    padding: 24,
  },
  hero: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  cardList: {
    gap: 12,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
  },
  noCookiesBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  noCookiesTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FF5252",
    marginBottom: 8,
    letterSpacing: 1,
  },
  noCookiesText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 2,
  },
  disclaimer: {
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerQuote: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 8,
  },
  footerCopyright: {
    fontSize: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
