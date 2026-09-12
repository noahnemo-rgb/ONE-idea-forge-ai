import { useState } from "react";
import { toast } from "sonner";

export function useMarketResearch() {
  const [researchingIdea, setResearchingIdea] = useState(null);
  const [researchResult, setResearchResult] = useState(null);
  const [isResearching, setIsResearching] = useState(false);

  const handleMarketResearch = async (idea) => {
    try {
      setIsResearching(true);
      setResearchingIdea(idea);
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
        }),
      });

      if (!res.ok) throw new Error("Research failed");

      const data = await res.json();
      setResearchResult(data.research);
    } catch (err) {
      toast.error("Market research failed");
    } finally {
      setIsResearching(false);
    }
  };

  return {
    researchingIdea,
    researchResult,
    isResearching,
    handleMarketResearch,
    setResearchResult,
    setIsResearching,
  };
}
