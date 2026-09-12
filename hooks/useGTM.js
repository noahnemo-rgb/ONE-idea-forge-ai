import { useState } from "react";
import { toast } from "sonner";

export function useGTM() {
  const [gtmIdea, setGtmIdea] = useState(null);
  const [gtmResult, setGtmResult] = useState(null);
  const [isGeneratingGTM, setIsGeneratingGTM] = useState(false);

  const handleGTM = async (idea) => {
    try {
      setIsGeneratingGTM(true);
      setGtmIdea(idea);
      const res = await fetch("/api/generate/gtm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate GTM strategy");
      const data = await res.json();
      setGtmResult(data.gtm);
    } catch (err) {
      toast.error("GTM strategy generation failed");
    } finally {
      setIsGeneratingGTM(false);
    }
  };

  return {
    gtmIdea,
    gtmResult,
    isGeneratingGTM,
    handleGTM,
    setGtmResult,
    setIsGeneratingGTM,
  };
}
