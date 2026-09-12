import { useState } from "react";
import { toast } from "sonner";

export function useBudget() {
  const [budgetIdea, setBudgetIdea] = useState(null);
  const [budgetResult, setBudgetResult] = useState(null);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);

  const handleBudget = async (idea) => {
    try {
      setIsGeneratingBudget(true);
      setBudgetIdea(idea);
      const res = await fetch("/api/generate/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate budget estimate");
      const data = await res.json();
      setBudgetResult(data);
    } catch (err) {
      toast.error("Budget estimation failed");
    } finally {
      setIsGeneratingBudget(false);
    }
  };

  return {
    budgetIdea,
    budgetResult,
    isGeneratingBudget,
    handleBudget,
    setBudgetResult,
    setIsGeneratingBudget,
  };
}
