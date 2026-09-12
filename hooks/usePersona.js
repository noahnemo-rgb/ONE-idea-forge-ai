import { useState } from "react";

export function usePersona() {
  const [personaIdea, setPersonaIdea] = useState(null);
  const [personaResult, setPersonaResult] = useState(null);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);

  const handlePersona = async (idea) => {
    setPersonaIdea(idea);
    setIsGeneratingPersona(true);
    setPersonaResult(null);

    try {
      const response = await fetch("/api/generate/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) throw new Error("Failed to generate personas");
      const data = await response.json();
      setPersonaResult(data.personas);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingPersona(false);
    }
  };

  return {
    personaIdea,
    personaResult,
    isGeneratingPersona,
    handlePersona,
    setPersonaResult,
    setIsGeneratingPersona,
  };
}
