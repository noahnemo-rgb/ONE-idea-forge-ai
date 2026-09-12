import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./useUser";

export function useSubscription() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery({
    queryKey: ["subscription-status", user?.id],
    queryFn: async () => {
      if (!user?.id) return "free";
      const response = await fetch("/api/stripe/status");
      if (!response.ok) throw new Error("Failed to fetch status");
      const data = await response.json();
      return data.status;
    },
    enabled: !!user?.id,
    refetchInterval: (data) => {
      // If we just came back from checkout, poll more frequently
      const params = new URLSearchParams(window.location.search);
      if (params.get("session_id")) return 3000;
      return 1000 * 60 * 5; // 5 minutes
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async ({ priceId }) => {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          redirectURL: window.location.href,
        }),
      });
      if (!response.ok) throw new Error("Failed to create checkout session");
      const data = await response.json();
      return data.url;
    },
    onSuccess: (url) => {
      if (url) {
        // Open in a new window as a popup because we are in an iframe
        window.open(url, "_blank", "popup");
      }
    },
  });

  return {
    status: status || "free",
    isPro: status === "pro",
    isLoading,
    upgrade: (priceId = "pro_monthly") => checkoutMutation.mutate({ priceId }),
    isUpgrading: checkoutMutation.isLoading,
  };
}
