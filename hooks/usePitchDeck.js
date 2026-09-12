import { useState } from "react";
import { toast } from "sonner";

export function usePitchDeck() {
  const [pitchDeckIdea, setPitchDeckIdea] = useState(null);
  const [pitchDeckResult, setPitchDeckResult] = useState(null);
  const [isGeneratingPitchDeck, setIsGeneratingPitchDeck] = useState(false);

  const handlePitchDeck = async (idea) => {
    try {
      setIsGeneratingPitchDeck(true);
      setPitchDeckIdea(idea);
      const res = await fetch("/api/generate/pitch-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
          targetAudience: idea.target_audience,
          problemSolved: idea.problem_solved,
          uniqueValueProp: idea.unique_value_prop,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate pitch deck");
      const data = await res.json();
      setPitchDeckResult(data.pitchDeck);
    } catch (err) {
      toast.error("Pitch deck generation failed");
    } finally {
      setIsGeneratingPitchDeck(false);
    }
  };

  return {
    pitchDeckIdea,
    pitchDeckResult,
    isGeneratingPitchDeck,
    handlePitchDeck,
    setPitchDeckResult,
    setIsGeneratingPitchDeck,
  };
}
