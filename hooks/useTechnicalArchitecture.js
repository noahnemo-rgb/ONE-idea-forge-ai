import { useState } from "react";
import { toast } from "sonner";

export function useTechnicalArchitecture() {
  const [architectureIdea, setArchitectureIdea] = useState(null);
  const [architectureResult, setArchitectureResult] = useState(null);
  const [isGeneratingArchitecture, setIsGeneratingArchitecture] =
    useState(false);

  const handleTechnicalArchitecture = async (idea) => {
    try {
      setIsGeneratingArchitecture(true);
      setArchitectureIdea(idea);
      const res = await fetch("/api/generate/technical-architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate technical architecture");
      const data = await res.json();
      setArchitectureResult(data.architecture);
    } catch (err) {
      toast.error("Technical architecture generation failed");
    } finally {
      setIsGeneratingArchitecture(false);
    }
  };

  return {
    architectureIdea,
    architectureResult,
    isGeneratingArchitecture,
    handleTechnicalArchitecture,
    setArchitectureResult,
    setIsGeneratingArchitecture,
  };
}
