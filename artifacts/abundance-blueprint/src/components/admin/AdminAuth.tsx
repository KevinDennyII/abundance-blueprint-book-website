import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  fetchAdminMe,
  loginAdmin,
  logoutAdmin,
  type AdminUser,
} from "@/lib/blog-api";

type AdminAuthContextValue = {
  admin: AdminUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  setAdminFromSession: (admin: AdminUser) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await fetchAdminMe();
    if (result.ok) {
      setAdmin(result.data.admin);
    } else {
      setAdmin(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await refresh();
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAdmin(email, password);
    if (!result.ok) {
      return { ok: false as const, error: result.error };
    }
    setAdmin(result.data.admin);
    return { ok: true as const };
  }, []);

  const setAdminFromSession = useCallback((next: AdminUser) => {
    setAdmin(next);
  }, []);

  const logout = useCallback(async () => {
    await logoutAdmin();
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ admin, loading, login, setAdminFromSession, logout, refresh }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
