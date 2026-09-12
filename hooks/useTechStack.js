import { useState } from "react";
import { toast } from "sonner";

export function useTechStack() {
  const [techStackIdea, setTechStackIdea] = useState(null);
  const [techStackResult, setTechStackResult] = useState(null);
  const [isGeneratingTechStack, setIsGeneratingTechStack] = useState(false);

  const handleTechStack = async (idea) => {
    try {
      setIsGeneratingTechStack(true);
      setTechStackIdea(idea);
      const res = await fetch("/api/generate/tech-stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
          keyFeatures: idea.key_features,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate tech stack");
      const data = await res.json();
      setTechStackResult(data.techStack);
    } catch (err) {
      toast.error("Tech stack generation failed");
    } finally {
      setIsGeneratingTechStack(false);
    }
  };

  return {
    techStackIdea,
    techStackResult,
    isGeneratingTechStack,
    handleTechStack,
    setTechStackResult,
    setIsGeneratingTechStack,
  };
}
