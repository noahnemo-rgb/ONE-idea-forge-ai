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
        const friendly = {
          database_off: "Blue-ocean dive is a Pro room. It opens when this workshop can save an account. Your seed stays on the card.",
          sign_in: "Sign in to open the blue-ocean room.",
          pro_required: "Blue-ocean dive is a Pro room.",
          missing_key: "Pro is open. Sign in to Puter, or add your OpenRouter key, to run Niche Scout.",
        };
        setDiveError(friendly[data.code] || data.error || "Blue-ocean dive is not available yet.");
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
