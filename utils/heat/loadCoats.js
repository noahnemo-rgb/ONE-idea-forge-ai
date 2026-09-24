export function parseEnvFile(text) {
  const env = {};
  for (const line of String(text || "").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

export function coatsFromEnv(env) {
  const coats = [];
  for (let i = 1; i <= 10; i++) {
    const n = String(i).padStart(2, "0");
    const id = `OPENROUTER_DONOR_${n}`;
    const value = env?.[id];
    if (typeof value === "string" && value.trim()) {
      coats.push({ id, label: `coat-${n}` });
    }
  }
  return coats;
}
