import { useCallback } from "react";

function callbackFromWindow() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("callbackUrl");
}

async function postJson(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body ?? {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "Request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}

function useAuth() {
  const callbackUrl = callbackFromWindow();

  const signInWithCredentials = useCallback(
    async (options) => {
      await postJson("/api/account/signin", {
        email: options.email,
        password: options.password,
      });
      if (options.redirect !== false) {
        window.location.href = callbackUrl ?? options.callbackUrl ?? "/";
      }
    },
    [callbackUrl],
  );

  const signUpWithCredentials = useCallback(
    async (options) => {
      await postJson("/api/account/signup", {
        email: options.email,
        password: options.password,
        name: options.name,
      });
      if (options.redirect !== false) {
        window.location.href = callbackUrl ?? options.callbackUrl ?? "/";
      }
    },
    [callbackUrl],
  );

  const rejectSocial = useCallback(async () => {
    throw new Error("Google sign-in is not activated on this host. Use email and password.");
  }, []);

  const signOut = useCallback(async (options = {}) => {
    try {
      await postJson("/api/account/signout", {});
    } catch {
      // Leave the signed-in page even if the server is unreachable.
    }
    if (options.redirect !== false) {
      window.location.href = options.callbackUrl || "/";
    }
  }, []);

  return {
    signInWithCredentials,
    signUpWithCredentials,
    signInWithGoogle: rejectSocial,
    signInWithFacebook: rejectSocial,
    signInWithTwitter: rejectSocial,
    signInWithApple: rejectSocial,
    signOut,
  };
}

export default useAuth;
