import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Accessibility,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Mail,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function AccessibilityPolicy() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0F0A18", paddingTop: insets.top }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 8, marginLeft: -8 }}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 12,
          }}
        >
          Accessibility Policy
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              backgroundColor: "rgba(104, 85, 255, 0.2)",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <Accessibility color="#6855FF" size={28} />
          </View>
          <View>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              Accessibility
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 100,
                marginTop: 4,
                alignSelf: "flex-start",
              }}
            >
              <Clock color="rgba(255, 255, 255, 0.6)" size={12} />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: 10,
                  fontWeight: "bold",
                  marginLeft: 4,
                }}
              >
                UPDATED DEC 21, 2025
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 16,
          }}
        >
          IdeaForge is committed to making our application accessible to as many
          people as possible, including those with disabilities. We believe
          creativity and inspiration should be available to everyone on the
          Path.
        </Text>

        <Text
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 14,
            lineHeight: 22,
            marginBottom: 32,
          }}
        >
          We strive to follow Web Content Accessibility Guidelines (WCAG) 2.1
          Level AA standards where feasible for a small independent team.
        </Text>

        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
            marginBottom: 32,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <ShieldCheck color="#6855FF" size={20} />
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                marginLeft: 8,
              }}
            >
              Current Features
            </Text>
          </View>

          {[
            "High contrast dark mode",
            "Readable typography",
            "Accessible touch targets",
            "Semantic structure",
            "Alt text on key elements",
            "System accessibility support",
          ].map((feature, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#6855FF",
                  marginRight: 12,
                }}
              />
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 14 }}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          Ongoing Efforts
        </Text>
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 14,
            lineHeight: 22,
            marginBottom: 24,
          }}
        >
          We are continuously working to improve accessibility, including adding
          descriptive labels, ensuring color contrast, and supporting dynamic
          text resizing.
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          Limitations
        </Text>
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 14,
            lineHeight: 22,
            marginBottom: 32,
          }}
        >
          As a newly launched application built by a small team, some areas may
          not yet be fully accessible. We welcome feedback on specific barriers
          you encounter.
        </Text>

        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:accessibility@idea-forge.ai")}
          style={{
            backgroundColor: "rgba(104, 85, 255, 0.1)",
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(104, 85, 255, 0.2)",
            alignItems: "center",
          }}
        >
          <Mail color="#6855FF" size={32} style={{ marginBottom: 12 }} />
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            Feedback & Support
          </Text>
          <Text style={{ color: "#6855FF", fontSize: 16, fontWeight: "bold" }}>
            accessibility@idea-forge.ai
          </Text>
        </TouchableOpacity>

        <View style={{ marginTop: 48, alignItems: "center" }}>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: 12,
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            We appreciate your help in making IdeaForge more inclusive.
          </Text>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 14,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Thank you for co-creating with us.
          </Text>
          <Text
            style={{
              color: "#6855FF",
              fontSize: 10,
              fontWeight: "bold",
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
