import { useState } from "react";

export function useRevenue() {
  const [revenueIdea, setRevenueIdea] = useState(null);
  const [revenueResult, setRevenueResult] = useState(null);
  const [isGeneratingRevenue, setIsGeneratingRevenue] = useState(false);

  const handleRevenue = async (idea) => {
    setRevenueIdea(idea);
    setIsGeneratingRevenue(true);
    setRevenueResult(null);

    try {
      const response = await fetch("/api/generate/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) throw new Error("Failed to generate revenue model");
      const data = await response.json();
      setRevenueResult(data.revenueModel);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingRevenue(false);
    }
  };

  return {
    revenueIdea,
    revenueResult,
    isGeneratingRevenue,
    handleRevenue,
    setRevenueResult,
    setIsGeneratingRevenue,
  };
}
