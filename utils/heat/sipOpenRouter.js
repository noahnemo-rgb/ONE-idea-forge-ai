const SYSTEM =
  'You help a human partner assay one idea. Return ONLY JSON: {"title":"","description":"","target_audience":"","key_features":[""],"scores":{"novelty":0,"feasibility":0,"market":0}} Scores 0-10. Concrete. Do not treat the human as a meter or the model as a tool.';

function exhaust(status) {
  throw Object.assign(new Error("exhaust"), { exhaust: true, status });
}

function parseIdea(text, prompt, mode) {
  const raw = String(text || "");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  let data = {};
  if (start >= 0 && end > start) {
    try {
      data = JSON.parse(raw.slice(start, end + 1));
    } catch {
      data = {};
    }
  }
  return {
    id: "openrouter-donor-assay",
    title: data.title || "Assay",
    description: data.description || raw.slice(0, 800) || prompt,
    target_audience: data.target_audience || "Not specified",
    key_features: Array.isArray(data.key_features)
      ? data.key_features.slice(0, 6)
      : ["Named helper: OpenRouter donor coat"],
    scores: data.scores || { novelty: 0, feasibility: 0, market: 0 },
    model_source: "openrouter-donor",
    creative_mode: mode || "balanced",
  };
}

export async function sipOpenRouter({ apiKey, prompt, mode }) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: "Creative mode: " + (mode || "balanced") + ". Seed: " + prompt,
        },
      ],
    }),
  });
  if (res.status === 401 || res.status === 402 || res.status === 429 || !res.ok) {
    exhaust(res.status);
  }
  const body = await res.json();
  const text = body?.choices?.[0]?.message?.content || "";
  return parseIdea(text, prompt, mode);
}
