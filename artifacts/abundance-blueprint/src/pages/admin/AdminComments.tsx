import { useEffect, useState } from "react";
import { Link } from "wouter";
import { MessageSquare } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchAdminComments,
  formatPostDate,
  updateAdminCommentStatus,
  type AdminComment,
} from "@/lib/blog-api";

type Filter = "pending" | "approved" | "rejected" | "all";

export default function AdminComments() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const status = filter === "all" ? undefined : filter;
      const result = await fetchAdminComments(status);
      if (cancelled) return;

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }
      setComments(result.data.comments);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [filter]);

  async function moderate(id: number, status: "approved" | "rejected") {
    setBusyId(id);
    const result = await updateAdminCommentStatus(id, status);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const statusParam = filter === "all" ? undefined : filter;
    const refreshed = await fetchAdminComments(statusParam);
    if (refreshed.ok) {
      setComments(refreshed.data.comments);
    }
  }

  const filters: Filter[] = ["pending", "approved", "rejected", "all"];

  return (
    <AdminShell
      title="Comments"
      description="Review reader comments before they appear on the blog. Only approved comments are visible to the public."
    >
      <div className="mb-8 inline-flex flex-wrap gap-1 rounded-lg border border-card-border bg-card p-1">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs uppercase tracking-wide transition-colors",
              filter === value
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted hover:text-primary",
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Loading…</p>}
      {error && (
        <p className="text-destructive mb-4" role="alert">
          {error}
        </p>
      )}

      {!loading && comments.length === 0 && (
        <div className="rounded-xl border border-card-border bg-card p-10 text-center">
          <MessageSquare className="mx-auto mb-3 size-8 text-muted" />
          <p className="font-serif text-xl text-primary">
            Nothing to show here
          </p>
          <p className="mt-2 text-sm text-muted">
            No {filter === "all" ? "" : `${filter} `}comments yet.
          </p>
        </div>
      )}

      {!loading && comments.length > 0 && (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border border-card-border rounded-xl p-5 bg-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="font-medium text-primary">
                    {comment.authorName}{" "}
                    <span className="text-muted font-normal text-sm">
                      &lt;{comment.authorEmail}&gt;
                    </span>
                  </p>
                  <p className="text-xs text-muted mt-1">
                    on{" "}
                    <Link
                      href={`/blog/${comment.postSlug}`}
                      className="underline underline-offset-2"
                    >
                      {comment.postTitle}
                    </Link>{" "}
                    · {formatPostDate(comment.createdAt)} ·{" "}
                    <span className="uppercase tracking-wide">
                      {comment.status}
                    </span>
                  </p>
                </div>
                {comment.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={busyId === comment.id}
                      onClick={() => void moderate(comment.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busyId === comment.id}
                      onClick={() => void moderate(comment.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap text-foreground/90">
                {comment.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
