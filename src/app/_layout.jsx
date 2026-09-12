import { useAuth } from "@/utils/auth/useAuth";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";
import Constants from "expo-constants";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady, auth } = useAuth();

  useEffect(() => {
    initiate();
  }, [initiate]);

  useEffect(() => {
    // Initialize RevenueCat only if not in Expo Go
    const isExpoGo = Constants.appOwnership === "expo";

    if (!isExpoGo && (Platform.OS === "ios" || Platform.OS === "android")) {
      try {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        Purchases.configure({
          apiKey: process.env.REVENUE_CAT_API_KEY || "",
        });
      } catch (error) {
        console.warn("RevenueCat configuration failed:", error);
      }
    } else if (isExpoGo) {
      console.log("Skipping RevenueCat initialization in Expo Go");
    }
  }, []);

  useEffect(() => {
    // Identify user in RevenueCat when authenticated (only if not in Expo Go)
    const isExpoGo = Constants.appOwnership === "expo";

    if (!isExpoGo) {
      try {
        if (auth?.user?.id) {
          Purchases.logIn(auth.user.id.toString());
        } else {
          Purchases.logOut();
        }
      } catch (error) {
        console.warn("RevenueCat user identification failed:", error);
      }
    }
  }, [auth?.user?.id]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="results"
              options={{
                presentation: "card",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
