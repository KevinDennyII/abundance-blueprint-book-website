import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FileText, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  deleteAdminPost,
  fetchAdminPosts,
  formatPostDate,
  type BlogPost,
} from "@/lib/blog-api";

export default function AdminPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const result = await fetchAdminPosts();
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setPosts(result.data.posts);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) {
      return;
    }
    setBusyId(id);
    const result = await deleteAdminPost(id);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await load();
  }

  const published = posts.filter((post) => post.status === "published").length;
  const drafts = posts.length - published;

  return (
    <AdminShell
      title="Posts"
      description="Draft and publish blog posts. Only published posts appear on the public blog."
      actions={
        <Link
          href="/admin/posts/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus />
          New post
        </Link>
      }
    >
      {!loading && posts.length > 0 && (
        <p className="mb-4 text-sm text-muted">
          {posts.length} total · {published} published · {drafts} draft
          {drafts === 1 ? "" : "s"}
        </p>
      )}

      {loading && <p className="text-muted">Loading…</p>}
      {error && (
        <p className="mb-4 text-destructive" role="alert">
          {error}
        </p>
      )}

      {!loading && posts.length === 0 && (
        <div className="rounded-xl border border-card-border bg-card p-10 text-center">
          <FileText className="mx-auto mb-3 size-8 text-muted" />
          <p className="font-serif text-xl text-primary">No posts yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Write your first post to start the blog. You can save it as a draft
            before publishing.
          </p>
          <Link
            href="/admin/posts/new"
            className={cn(buttonVariants({ variant: "default" }), "mt-6")}
          >
            <Plus />
            Create your first post
          </Link>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <ul className="divide-y divide-card-border overflow-hidden rounded-xl border border-card-border bg-card">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-xl text-primary">
                    {post.title}
                  </h2>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide",
                      post.status === "published"
                        ? "bg-secondary/25 text-secondary-foreground"
                        : "bg-muted/20 text-muted",
                    )}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted">
                  /blog/{post.slug}
                  {post.publishedAt
                    ? ` · ${formatPostDate(post.publishedAt)}`
                    : ` · edited ${formatPostDate(post.updatedAt)}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  Edit
                </Link>
                {post.status === "published" && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                    )}
                  >
                    View
                  </a>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={busyId === post.id}
                  onClick={() => void handleDelete(post.id, post.title)}
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
