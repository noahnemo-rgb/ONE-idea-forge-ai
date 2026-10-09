import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../build/client", import.meta.url);
const patterns = [
  { name: "sk/rk/pk key", pattern: /\b(?:sk|rk|pk)-[A-Za-z0-9_-]{8,}/g },
  { name: "NVIDIA key", pattern: /\bnvapi-[A-Za-z0-9_-]{8,}/gi },
  { name: "Google API key", pattern: /\bAIza[0-9A-Za-z_-]{10,}/g },
  { name: "bearer token", pattern: /Bearer\s+[A-Za-z0-9._~+/=-]{12,}/g },
  // A template like `?token=${id}` is a URL the page builds at runtime, not a key literal.
  { name: "key query", pattern: /[?&](?:key|api_key|apiKey|access_token|token)=(?!\$)[A-Za-z0-9._~+/=-]{12,}/gi },
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, files);
    else if (/\.(js|mjs|css|html|json|txt)$/.test(name) && !name.endsWith(".map")) files.push(path);
  }
  return files;
}

const hits = [];
for (const file of walk(root.pathname)) {
  const text = readFileSync(file, "utf8");
  for (const { name, pattern } of patterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) hits.push(`${file}: ${name}: ${match[0].slice(0, 24)}`);
  }
}

if (hits.length) {
  console.error(hits.join("\n"));
  process.exit(1);
}
console.log(`scanned ${walk(root.pathname).length} client files; no key-shaped strings`);
