import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  ExternalLink,
  FileText,
  KeyRound,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { fetchAdminComments } from "@/lib/blog-api";
import { PageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

const nav = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (loc: string) => loc === "/admin",
  },
  {
    href: "/admin/posts",
    label: "Posts",
    icon: FileText,
    match: (loc: string) => loc.startsWith("/admin/posts"),
  },
  {
    href: "/admin/comments",
    label: "Comments",
    icon: MessageSquare,
    match: (loc: string) => loc.startsWith("/admin/comments"),
  },
  {
    href: "/admin/seo",
    label: "Page SEO",
    icon: Search,
    match: (loc: string) => loc.startsWith("/admin/seo"),
  },
  {
    href: "/admin/passkeys",
    label: "Passkeys",
    icon: KeyRound,
    match: (loc: string) => loc.startsWith("/admin/passkeys"),
  },
  {
    href: "/admin/account",
    label: "Account",
    icon: UserRound,
    match: (loc: string) => loc.startsWith("/admin/account"),
  },
];

function BrandMark() {
  return (
    <Link href="/admin" className="block">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">
        Abundance Blueprint
      </p>
      <p className="font-serif text-lg text-primary leading-tight">
        Admin Console
      </p>
    </Link>
  );
}

export function AdminShell({
  children,
  title,
  description,
  actions,
}: {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const { admin, logout } = useAdminAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchAdminComments("pending");
      if (cancelled || !result.ok) return;
      setPendingCount(result.data.comments.length);
    })();
    return () => {
      cancelled = true;
    };
  }, [location]);

  const navLinks = nav.map((item) => {
    const active = item.match(location);
    const Icon = item.icon;
    const showBadge =
      item.href === "/admin/comments" && pendingCount !== null && pendingCount > 0;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          active
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted hover:bg-primary/5 hover:text-primary",
        )}
      >
        <Icon className="size-4 shrink-0" />
        <span className="flex-1">{item.label}</span>
        {showBadge && (
          <span
            className={cn(
              "min-w-5 rounded-full px-1.5 py-0.5 text-center text-[0.7rem] font-semibold",
              active
                ? "bg-primary-foreground text-primary"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {pendingCount}
          </span>
        )}
      </Link>
    );
  });

  const accountBlock = (
    <div className="space-y-3">
      <div>
        <p className="text-[0.65rem] uppercase tracking-widest text-muted">
          Signed in as
        </p>
        <p className="truncate text-sm text-primary">{admin?.email}</p>
      </div>
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
      >
        <ExternalLink className="size-4" />
        View live site
      </a>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => void logout()}
      >
        Log out
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageMeta title={`${title} · Admin — Abundance Blueprint`} noindex />

      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-card-border bg-card px-4 py-3 lg:hidden">
        <BrandMark />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && (
        <nav className="space-y-1 border-b border-card-border bg-card px-3 py-3 lg:hidden">
          {navLinks}
          <div className="mt-3 border-t border-card-border pt-3">
            {accountBlock}
          </div>
        </nav>
      )}

      <div className="lg:flex">
        <aside className="hidden border-r border-card-border bg-card lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
          <div className="border-b border-card-border px-6 py-5">
            <BrandMark />
          </div>
          <nav className="flex-1 space-y-1 p-3">{navLinks}</nav>
          <div className="border-t border-card-border p-4">{accountBlock}</div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-card-border bg-background/85 px-4 py-6 backdrop-blur md:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-serif text-3xl text-primary">{title}</h1>
                {description && (
                  <p className="mt-1 max-w-2xl text-sm text-muted">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex flex-wrap items-center gap-2">{actions}</div>
              )}
            </div>
          </header>

          <main className="px-4 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
