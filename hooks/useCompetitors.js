import { useState } from "react";
import { toast } from "sonner";

export function useCompetitors() {
  const [competitorIdea, setCompetitorIdea] = useState(null);
  const [competitorResult, setCompetitorResult] = useState(null);
  const [isGeneratingCompetitors, setIsGeneratingCompetitors] = useState(false);

  const handleCompetitors = async (idea) => {
    try {
      setIsGeneratingCompetitors(true);
      setCompetitorIdea(idea);
      const res = await fetch("/api/generate/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate competitor map");
      const data = await res.json();
      setCompetitorResult(data.competitors);
    } catch (err) {
      toast.error("Competitor map generation failed");
    } finally {
      setIsGeneratingCompetitors(false);
    }
  };

  return {
    competitorIdea,
    competitorResult,
    isGeneratingCompetitors,
    handleCompetitors,
    setCompetitorResult,
    setIsGeneratingCompetitors,
  };
}
