import { useCallback, useEffect, useRef, useState } from "react";
import { loadDashboard } from "ai-buffer";
import { browserSelectionStore } from "./aiBufferSelection.js";

async function loadProbe() {
  let data = {};
  try {
    const response = await fetch("/api/ai-buffer/status", { credentials: "include" });
    if (response.ok) data = await response.json();
  } catch {
    data = {};
  }
  let puterSignedIn = false;
  const signedIn = typeof window !== "undefined" ? window.puter?.auth?.isSignedIn : null;
  if (typeof signedIn === "function") {
    try {
      puterSignedIn = Boolean(await signedIn());
    } catch {
      puterSignedIn = false;
    }
  }
  return {
    puterSignedIn,
    openrouterKey: Boolean(data.openrouterKey),
    gatewayKey: Boolean(data.gatewayKey),
    geminiKey: Boolean(data.geminiKey),
    nvidiaKey: Boolean(data.nvidiaKey),
    llmapiKey: Boolean(data.llmapiKey),
    keyHints: data.keyHints && typeof data.keyHints === "object" ? data.keyHints : {},
  };
}

export function useAiBufferDashboard() {
  const storeRef = useRef(null);
  const [rows, setRows] = useState([]);

  const reload = useCallback(async () => {
    const store = storeRef.current;
    if (!store) return;
    setRows(await loadDashboard(store, await loadProbe()));
  }, []);

  useEffect(() => {
    const store = browserSelectionStore();
    storeRef.current = store;
    reload();
  }, [reload]);

  const choose = useCallback(
    async (id) => {
      await storeRef.current?.setProvider(id);
      await reload();
    },
    [reload],
  );

  const commitModel = useCallback(
    async (id, value) => {
      try {
        await storeRef.current?.setModel(id, value);
      } catch {
        // A key-shaped model is rejected. The row keeps the previous model.
      }
      await reload();
    },
    [reload],
  );

  return { rows, choose, commitModel, storeRef };
}
