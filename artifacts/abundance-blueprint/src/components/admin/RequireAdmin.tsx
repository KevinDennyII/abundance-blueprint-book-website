import { Redirect } from "wouter";
import { useAdminAuth } from "@/components/admin/AdminAuth";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted">
        Checking session…
      </div>
    );
  }

  if (!admin) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}
