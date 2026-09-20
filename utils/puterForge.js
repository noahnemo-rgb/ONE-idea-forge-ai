const FREE_CAP = 3;
const STRIKE_KEY = "ideaforge_free_strikes";

export function remainingFreeStrikes() {
  if (typeof window === "undefined") return FREE_CAP;
  const n = Number(sessionStorage.getItem(STRIKE_KEY) || "0");
  return Math.max(0, FREE_CAP - n);
}

function bumpStrike() {
  const n = Number(sessionStorage.getItem(STRIKE_KEY) || "0") + 1;
  sessionStorage.setItem(STRIKE_KEY, String(n));
}

export function loadPuter() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.puter?.ai?.chat) return resolve(window.puter);
    const existing = document.querySelector('script[data-ideaforge="puter"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.puter));
      existing.addEventListener("error", () => reject(new Error("puter script failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://js.puter.com/v2/";
    s.async = true;
    s.dataset.ideaforge = "puter";
    s.onload = () => resolve(window.puter);
    s.onerror = () => reject(new Error("puter script failed"));
    document.head.appendChild(s);
  });
}

function parseIdea(text, prompt, mode) {
  const raw = String(text || "");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  let data = {};
  if (start >= 0 && end > start) {
    try { data = JSON.parse(raw.slice(start, end + 1)); } catch { data = {}; }
  }
  return {
    id: "puter-assay",
    title: data.title || "Assay",
    description: data.description || raw.slice(0, 800) || prompt,
    target_audience: data.target_audience || "Not specified",
    key_features: Array.isArray(data.key_features) ? data.key_features.slice(0, 6) : ["Named guest: Puter"],
    scores: data.scores || { novelty: 0, feasibility: 0, market: 0 },
    model_source: "puter",
    creative_mode: mode || "balanced",
    vote_count: 0,
    user_has_voted: false,
    is_favorite: false,
  };
}

export async function forgeWithPuter(prompt, mode) {
  if (remainingFreeStrikes() <= 0) {
    throw new Error("Free strikes used. Upgrade, bring your own key, or stop.");
  }
  const puter = await loadPuter();
  const system = 'You help a human partner assay one idea. Return ONLY JSON: {"title":"","description":"","target_audience":"","key_features":[""],"scores":{"novelty":0,"feasibility":0,"market":0}} Scores 0-10. Concrete. Do not treat the human as a meter or the model as a tool.';
  const res = await puter.ai.chat(
    [{ role: "system", content: system }, { role: "user", content: "Creative mode: " + (mode || "balanced") + ". Seed: " + prompt }],
    { model: "openai/gpt-5-nano" }
  );
  const text = typeof res === "string" ? res : (res?.message?.content || res?.text || JSON.stringify(res));
  bumpStrike();
  return parseIdea(text, prompt, mode);
}
