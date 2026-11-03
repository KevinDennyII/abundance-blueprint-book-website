import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Mic2, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  deleteAdminPodcastAppearance,
  fetchAdminPodcastAppearances,
  formatAppearanceDateLabel,
  type AdminPodcastAppearance,
} from "@/lib/podcast-appearances-api";

type Filter = "all" | "published" | "draft";

export default function AdminPodcastAppearances() {
  const [appearances, setAppearances] = useState<AdminPodcastAppearance[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load(nextFilter = filter) {
    setLoading(true);
    setError(null);
    const result = await fetchAdminPodcastAppearances(nextFilter);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setAppearances(result.data.appearances);
    setLoading(false);
  }

  useEffect(() => {
    void load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when filter changes
  }, [filter]);

  async function handleDelete(appearance: AdminPodcastAppearance) {
    if (
      !window.confirm(
        `Delete “${appearance.episodeTitle}” on ${appearance.showName}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusyId(appearance.id);
    const result = await deleteAdminPodcastAppearance(appearance.id);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await load();
  }

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Draft" },
  ];

  return (
    <AdminShell
      title="Podcast appearances"
      description="Guest spots and interviews. Published entries show on /live (and can move to an As Heard On page later without re-entering)."
      actions={
        <Link
          href="/admin/podcast-appearances/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus />
          New appearance
        </Link>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
              filter === item.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted border border-card-border hover:text-primary",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Loading…</p>}
      {error && (
        <p className="mb-4 text-destructive" role="alert">
          {error}
        </p>
      )}

      {!loading && appearances.length === 0 && (
        <div className="rounded-xl border border-card-border bg-card p-10 text-center">
          <Mic2 className="mx-auto mb-3 size-8 text-muted" />
          <p className="font-serif text-xl text-primary">No appearances yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Add a guest episode when you have one. Keep it as Draft until the
            link or embed is ready, then publish.
          </p>
          <Link
            href="/admin/podcast-appearances/new"
            className={cn(buttonVariants({ variant: "default" }), "mt-6")}
          >
            <Plus />
            Add your first appearance
          </Link>
        </div>
      )}

      {!loading && appearances.length > 0 && (
        <ul className="divide-y divide-card-border overflow-hidden rounded-xl border border-card-border bg-card">
          {appearances.map((appearance) => (
            <li
              key={appearance.id}
              className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-xl text-primary">
                    {appearance.episodeTitle}
                  </h2>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide",
                      appearance.status === "published"
                        ? "bg-secondary/25 text-secondary-foreground"
                        : "bg-muted/20 text-muted",
                    )}
                  >
                    {appearance.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {appearance.showName}
                  {" · "}
                  {formatAppearanceDateLabel(appearance.publishedDate)}
                </p>
                {appearance.description ? (
                  <p className="mt-0.5 line-clamp-1 text-sm text-foreground/80">
                    {appearance.description}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Link
                  href={`/admin/podcast-appearances/${appearance.id}/edit`}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Edit
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busyId === appearance.id}
                  onClick={() => void handleDelete(appearance)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
