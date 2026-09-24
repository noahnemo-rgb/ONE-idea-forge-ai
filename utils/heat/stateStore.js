import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { rollState } from "./donatorSequencer.js";

const file = join(dirname(fileURLToPath(import.meta.url)), "../../.heat/state.json");

export function loadState(day) {
  let raw = null;
  try {
    raw = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    raw = null;
  }
  return rollState(raw, day);
}

export function saveState(state) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(state));
}
