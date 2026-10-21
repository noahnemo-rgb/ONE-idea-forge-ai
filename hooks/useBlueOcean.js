import { useState } from "react";

export function useBlueOcean() {
  const [divingIdea, setDivingIdea] = useState(null);
  const [diveResult, setDiveResult] = useState(null);
  const [diveError, setDiveError] = useState("");
  const [isDiving, setIsDiving] = useState(false);

  const handleBlueOcean = async (idea) => {
    setDivingIdea(idea);
    setDiveResult(null);
    setDiveError("");
    setIsDiving(true);
    try {
      const res = await fetch("/api/research/blue-ocean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          prompt: idea.prompt || idea.description || idea.title,
          sourceUrl: idea.source_url,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDiveError(data.error || "Blue-ocean dive is not available yet.");
        return;
      }
      setDiveResult(data);
    } catch {
      setDiveError("Blue-ocean dive is not available yet.");
    } finally {
      setIsDiving(false);
    }
  };

  const closeBlueOcean = () => {
    setDivingIdea(null);
    setDiveResult(null);
    setDiveError("");
    setIsDiving(false);
  };

  return {
    divingIdea,
    diveResult,
    diveError,
    isDiving,
    handleBlueOcean,
    closeBlueOcean,
  };
}
