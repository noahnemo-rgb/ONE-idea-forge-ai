import { useState } from "react";
import { toast } from "sonner";

export function useFeedbackSimulator() {
  const [feedbackIdea, setFeedbackIdea] = useState(null);
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const handleFeedback = async (idea) => {
    try {
      setIsGeneratingFeedback(true);
      setFeedbackIdea(idea);
      const res = await fetch("/api/generate/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to simulate feedback");
      const data = await res.json();
      setFeedbackResult(data.feedback);
    } catch (err) {
      toast.error("Feedback simulation failed");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return {
    feedbackIdea,
    feedbackResult,
    isGeneratingFeedback,
    handleFeedback,
    setFeedbackResult,
    setIsGeneratingFeedback,
  };
}
