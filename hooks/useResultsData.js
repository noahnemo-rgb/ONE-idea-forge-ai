import { useState, useEffect } from "react";
import { forgeWithPuter } from "@/utils/puterForge";

export function useResultsData() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("prompt");
    const t = params.get("trending");
    const m = params.get("mode");
    const id = params.get("id");

    if (id) {
      fetchSingleIdea(id);
    } else if (p) {
      setPrompt(p);
      fetchIdeas(p, t === "true", m);
    }
  }, []);

  const fetchSingleIdea = async (id) => {
    try {
      setLoading(true);
      const response = await fetch("/api/ideas");
      const data = await response.json();
      const idea = data.ideas.find((i) => i.id === id);
      if (idea) {
        setIdeas([idea]);
        setPrompt(idea.prompt);
      } else {
        throw new Error("Idea not found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchIdeas = async (prompt, trending, mode) => {
    try {
      setLoading(true);
      try {
        const idea = await forgeWithPuter(prompt, mode);
        setIdeas([idea]);
        setError(null);
        return;
      } catch (puterErr) {
        console.warn("Puter bellows dark", puterErr);
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, trending, creativeMode: mode }),
      });
      if (!response.ok) throw new Error("Failed to generate ideas");
      const data = await response.json();
      setIdeas(data.ideas);
    } catch (err) {
      const seed = prompt || "untitled spark";
      setIdeas([
        {
          id: "guest-assay",
          title: "Guest assay — bellows dark",
          description:
            seed +
            " — kept as metal. No model ran on this host. Innovate {yes, no} waits for a named guest (pour B).",
          target_audience: "Preview walk. Not a validated startup yet.",
          key_features: [
            "Spark preserved",
            "Forge walked without sign-in",
            "Bellows (API) not on this Hobby host",
            "Yes / no is HITL when heat exists",
          ],
          scores: { novelty: 0, feasibility: 0, market: 0 },
          model_source: "guest-stub",
          creative_mode: mode || "balanced",
          vote_count: 0,
          user_has_voted: false,
          is_favorite: false,
        },
      ]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  return { ideas, setIdeas, loading, error, prompt };
}
