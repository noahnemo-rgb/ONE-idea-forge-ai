/** Named catalog door. We link out. We do not fetch or store their library. */
export const IDEALAB_CATALOG_URL = "https://idealab.ai";
export const NICHE_SCOUT_NAME = "Idea Forge Niche Scout";

export const NICHE_SCOUT_PROMPT = [
  "You are Idea Forge Niche Scout, a named guest. You are not Idea Forge.",
  "The partner pasted one seed for a deeper look at open water in that niche.",
  "Do not fetch, crawl, or copy Idealab.ai or any other catalog.",
  "If the partner named a page, cite that URL only as a link they brought.",
  "Cite other public pages only when you can name a real URL. Do not invent citations.",
  "Return ONLY JSON:",
  '{"niches":[{"name":"","wedge":"","why_open":"","citations":["https://example.com"]}]}',
  "Exactly three niches. A blue-ocean wedge is a smaller open offer, not a copy of a crowded one.",
].join(" ");

export function readSourceUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.length > 500) return "";
  let url;
  try {
    url = new URL(raw);
  } catch {
    return "";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return "";
  if (url.username || url.password) return "";
  return url.toString();
}

export function isIdealabCatalog(value) {
  const clean = readSourceUrl(value);
  if (!clean) return false;
  const host = new URL(clean).hostname.replace(/^www\./, "").toLowerCase();
  return host === "idealab.ai";
}

export function parseBlueOcean(text) {
  const raw = String(text || "");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  let data;
  try {
    data = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
  const rows = Array.isArray(data.niches) ? data.niches : [];
  if (rows.length !== 3) return null;
  const niches = rows.map((niche) => {
    const citations = (Array.isArray(niche?.citations) ? niche.citations : [])
      .map((item) => readSourceUrl(item))
      .filter(Boolean)
      .slice(0, 4);
    return {
      name: String(niche?.name || "").trim().slice(0, 120),
      wedge: String(niche?.wedge || "").trim().slice(0, 400),
      why_open: String(niche?.why_open || "").trim().slice(0, 400),
      citations,
    };
  });
  if (niches.some((niche) => !niche.name || !niche.wedge)) return null;
  return niches;
}
