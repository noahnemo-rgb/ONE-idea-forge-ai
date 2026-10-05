import * as React from "react";

const useUser = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const refetch = React.useCallback(async () => {
    try {
      const response = await fetch("/api/account/session", { credentials: "include" });
      if (!response.ok) {
        setUser(null);
        return null;
      }
      const data = await response.json();
      const next = data.user ?? null;
      setUser(next);
      return next;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return { user, data: user, loading, refetch };
};

export { useUser };
export default useUser;
