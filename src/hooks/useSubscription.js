import { useState, useEffect, useCallback } from "react";
import Purchases from "react-native-purchases";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import { Alert } from "react-native";
import Constants from "expo-constants";

export const useSubscription = () => {
  const { isAuthenticated } = useAuth();
  const [rcEntitlementActive, setRcEntitlementActive] = useState(false);
  const [rcLoading, setRcLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Check if we're in Expo Go
  const isExpoGo = Constants.appOwnership === "expo";

  // Fetch user profile from backend (contains Stripe status)
  const {
    data: profileData,
    refetch: refetchProfile,
    isLoading: profileLoading,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const checkEntitlements = useCallback(async () => {
    if (!isAuthenticated) {
      setRcEntitlementActive(false);
      setRcLoading(false);
      return;
    }

    // Skip RevenueCat checks in Expo Go
    if (isExpoGo) {
      setRcEntitlementActive(false);
      setRcLoading(false);
      return;
    }

    try {
      setRcLoading(true);
      const customerInfo = await Purchases.getCustomerInfo();
      const isActive =
        typeof customerInfo.entitlements.active["pro"] !== "undefined";
      setRcEntitlementActive(isActive);

      // Sync with backend if status changed or on load
      if (isActive) {
        await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription_status: "pro" }),
        });
      }
    } catch (e) {
      console.error("Error fetching RevenueCat entitlements", e);
    } finally {
      setRcLoading(false);
    }
  }, [isAuthenticated, isExpoGo]);

  useEffect(() => {
    checkEntitlements();

    // Skip listener setup in Expo Go
    if (isExpoGo) {
      return;
    }

    // Listen for customer info updates (e.g. after purchase)
    const listener = (customerInfo) => {
      const isActive =
        typeof customerInfo.entitlements.active["pro"] !== "undefined";
      setRcEntitlementActive(isActive);
    };

    try {
      Purchases.addCustomerInfoUpdateListener(listener);
    } catch (error) {
      console.warn("Failed to add RevenueCat listener:", error);
    }

    return () => {
      // Note: react-native-purchases listener removal is handled differently in newer versions
      // but for this implementation we'll assume standard cleanup or just let it be if it's a singleton
    };
  }, [checkEntitlements, isExpoGo]);

  const purchase = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to upgrade your account.",
      );
      return;
    }

    // In Expo Go, redirect to web for purchases
    if (isExpoGo) {
      Alert.alert(
        "Upgrade Available",
        "To upgrade to Pro, please use the web version of IdeaForge or download the full app from the App Store.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Web",
            onPress: () => {
              // You could open a web browser here if needed
              console.log("Redirect to web for purchase");
            },
          },
        ],
      );
      return;
    }

    try {
      setIsPurchasing(true);
      const offerings = await Purchases.getOfferings();

      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        // Assuming we have a 'pro' package or just take the first one for simplicity
        const pkg = offerings.current.availablePackages[0];
        const { customerInfo } = await Purchases.purchasePackage(pkg);

        if (typeof customerInfo.entitlements.active["pro"] !== "undefined") {
          setRcEntitlementActive(true);
          // Sync with backend
          await fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription_status: "pro" }),
          });
          Alert.alert("Success", "Welcome to IdeaForge Pro!");
        }
      } else {
        Alert.alert("Error", "No subscription plans available at the moment.");
      }
    } catch (e) {
      if (!e.userCancelled) {
        console.error("Purchase error", e);
        Alert.alert(
          "Purchase Failed",
          e.message || "An unexpected error occurred.",
        );
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const restore = async () => {
    // In Expo Go, skip restore
    if (isExpoGo) {
      Alert.alert(
        "Restore Not Available",
        "Purchase restoration is not available in Expo Go. Please use the full app from the App Store.",
      );
      return;
    }

    try {
      setIsRestoring(true);
      const customerInfo = await Purchases.restorePurchases();
      const isActive =
        typeof customerInfo.entitlements.active["pro"] !== "undefined";

      if (isActive) {
        setRcEntitlementActive(true);
        // Sync with backend
        await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription_status: "pro" }),
        });
        Alert.alert("Success", "Your purchases have been restored!");
      } else {
        Alert.alert(
          "No Purchases Found",
          "We couldn't find any active subscriptions to restore.",
        );
      }
    } catch (e) {
      console.error("Restore error", e);
      Alert.alert(
        "Restore Failed",
        e.message || "An unexpected error occurred.",
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const profile = profileData?.user;

  // isPro is true if RevenueCat entitlement is active OR backend says they are active (Stripe)
  const isPro =
    rcEntitlementActive ||
    profile?.subscription_status === "pro" ||
    profile?.subscription_status === "active";

  const credits = profile?.credits ?? 0;

  const manageSubscription = async () => {
    // In Expo Go, redirect to web
    if (isExpoGo) {
      Alert.alert(
        "Manage Subscription",
        "To manage your subscription, please use the web version of IdeaForge or the full app from the App Store.",
      );
      return;
    }

    try {
      await Purchases.showManageSubscriptions();
    } catch (e) {
      console.error("Error showing manage subscriptions", e);
      // Fallback or alert
    }
  };

  return {
    isPro,
    rcEntitlementActive,
    stripeActive:
      profile?.subscription_status === "pro" ||
      profile?.subscription_status === "active",
    credits,
    loading: rcLoading || profileLoading,
    isPurchasing,
    isRestoring,
    purchase,
    restore,
    refetch: async () => {
      await Promise.all([refetchProfile(), checkEntitlements()]);
    },
    manageSubscription,
    isExpoGo, // Expose this so components can show different UI
  };
};

export default useSubscription;
