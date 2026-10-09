import {
  PROVIDER_CATALOG,
  PROVIDER_KEY_NAMES,
  createLocalStorageStore,
  createMemoryStore,
  createProviderSelectionStore,
  looksLikeSecret,
} from "ai-buffer";

export const LEGACY_BROWSER_KEY = "ideaforge_openrouter_key";

const KEY_NAMES = new Set([
  LEGACY_BROWSER_KEY,
  "ai-buffer.openrouter_key",
  "ai-buffer.openrouter_model",
  ...Object.values(PROVIDER_KEY_NAMES),
]);

/**
 * Drops raw provider keys from web storage.
 * The selection store may keep a provider id and a model id.
 * A free-strike counter is left alone.
 */
export function scrubProviderSecrets(storage) {
  if (!storage) return;
  for (const name of KEY_NAMES) storage.removeItem(name);
  for (const item of PROVIDER_CATALOG) {
    const key = `ai-buffer.model.${item.id}`;
    const value = storage.getItem(key);
    if (value && looksLikeSecret(value)) storage.removeItem(key);
  }
  const active = storage.getItem("ai-buffer.active_provider");
  if (active && looksLikeSecret(active)) storage.removeItem("ai-buffer.active_provider");
}

export function browserSelectionStore() {
  const hasLocal = typeof localStorage !== "undefined" && localStorage;
  if (hasLocal) {
    scrubProviderSecrets(localStorage);
    if (typeof sessionStorage !== "undefined") scrubProviderSecrets(sessionStorage);
    return createProviderSelectionStore(createLocalStorageStore(localStorage));
  }
  return createProviderSelectionStore(createMemoryStore());
}
