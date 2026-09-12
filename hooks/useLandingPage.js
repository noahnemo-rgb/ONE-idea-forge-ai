import { useState } from "react";
import { toast } from "sonner";

export function useLandingPage() {
  const [landingPageIdea, setLandingPageIdea] = useState(null);
  const [landingPageResult, setLandingPageResult] = useState(null);
  const [isGeneratingLandingPage, setIsGeneratingLandingPage] = useState(false);

  const handleLandingPage = async (idea) => {
    try {
      setIsGeneratingLandingPage(true);
      setLandingPageIdea(idea);
      const res = await fetch("/api/generate/landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
          keyFeatures: idea.key_features,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate landing page copy");
      const data = await res.json();
      setLandingPageResult(data);
    } catch (err) {
      toast.error("Landing page generation failed");
    } finally {
      setIsGeneratingLandingPage(false);
    }
  };

  return {
    landingPageIdea,
    landingPageResult,
    isGeneratingLandingPage,
    handleLandingPage,
    setLandingPageResult,
    setIsGeneratingLandingPage,
  };
}
