import { useState, useEffect } from "react";

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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, trending, creativeMode: mode }),
      });
      if (!response.ok) throw new Error("Failed to generate ideas");
      const data = await response.json();
      setIdeas(data.ideas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { ideas, setIdeas, loading, error, prompt };
}
