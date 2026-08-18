import {
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  KeyRound,
  MessageSquare,
  PencilLine,
  Plus,
  Search,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchAdminComments,
  fetchAdminPosts,
  formatPostDate,
  type AdminComment,
  type BlogPost,
} from "@/lib/blog-api";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
}: {
  label: string;
  value: number | null;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-card-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.7rem] uppercase tracking-widest text-muted">
          {label}
        </p>
        <Icon className="size-4 shrink-0 text-muted transition-colors group-hover:text-primary" />
      </div>
      <p className="mt-3 font-serif text-4xl leading-none text-primary">
        {value === null ? "—" : value}
      </p>
      <p className="mt-2 text-xs text-muted">{hint}</p>
    </Link>
  );
}

function QuickAction({
  href,
  label,
  detail,
  icon: Icon,
}: {
  href: string;
  label: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-card-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-primary">{label}</span>
        <span className="block text-xs text-muted">{detail}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-card-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-card-border px-5 py-4">
        <h2 className="font-serif text-xl text-primary">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            {action.label}
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [comments, setComments] = useState<AdminComment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [postsResult, commentsResult] = await Promise.all([
        fetchAdminPosts(),
        fetchAdminComments(),
      ]);
      if (cancelled) return;

      if (!postsResult.ok) {
        setError(postsResult.error);
      } else {
        setPosts(postsResult.data.posts);
      }

      if (!commentsResult.ok) {
        setError((prev) => prev ?? commentsResult.error);
      } else {
        setComments(commentsResult.data.comments);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const published = posts?.filter((post) => post.status === "published") ?? null;
  const drafts = posts?.filter((post) => post.status === "draft") ?? null;
  const pending = comments?.filter((c) => c.status === "pending") ?? null;
  const approved = comments?.filter((c) => c.status === "approved") ?? null;

  const recentPosts = posts
    ? [...posts]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5)
    : null;

  return (
    <AdminShell
      title="Dashboard"
      description="A snapshot of your blog and site metadata. Everything here is live on abundanceblueprint.com."
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
      {error && (
        <p className="mb-6 text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Published"
          value={published?.length ?? null}
          hint="Live on the public blog"
          icon={FileText}
          href="/admin/posts"
        />
        <StatCard
          label="Drafts"
          value={drafts?.length ?? null}
          hint="Not visible to readers"
          icon={PencilLine}
          href="/admin/posts"
        />
        <StatCard
          label="Awaiting review"
          value={pending?.length ?? null}
          hint="Comments needing a decision"
          icon={MessageSquare}
          href="/admin/comments"
        />
        <StatCard
          label="Approved comments"
          value={approved?.length ?? null}
          hint="Showing under your posts"
          icon={CheckCircle2}
          href="/admin/comments"
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Recent posts"
          action={{ href: "/admin/posts", label: "View all" }}
        >
          {recentPosts === null && (
            <p className="px-5 py-6 text-sm text-muted">Loading…</p>
          )}
          {recentPosts?.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted">
                No posts yet. Your first one will show up here.
              </p>
              <Link
                href="/admin/posts/new"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-4",
                )}
              >
                Write a post
              </Link>
            </div>
          )}
          {recentPosts && recentPosts.length > 0 && (
            <ul className="divide-y divide-card-border">
              {recentPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">
                      {post.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {post.status === "published" ? "Published" : "Draft"} ·
                      updated {formatPostDate(post.updatedAt)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "shrink-0",
                    )}
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Comments to review"
          action={{ href: "/admin/comments", label: "Moderate" }}
        >
          {pending === null && (
            <p className="px-5 py-6 text-sm text-muted">Loading…</p>
          )}
          {pending?.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-muted">
              Nothing waiting. All comments have been reviewed.
            </p>
          )}
          {pending && pending.length > 0 && (
            <ul className="divide-y divide-card-border">
              {pending.slice(0, 4).map((comment) => (
                <li key={comment.id} className="px-5 py-3">
                  <p className="text-sm font-medium text-primary">
                    {comment.authorName}
                    <span className="ml-2 text-xs font-normal text-muted">
                      on {comment.postTitle}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-foreground/80">
                    {comment.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-serif text-xl text-primary">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            href="/admin/posts/new"
            label="Write a post"
            detail="Draft, preview, publish"
            icon={Plus}
          />
          <QuickAction
            href="/admin/comments"
            label="Moderate comments"
            detail="Approve or reject replies"
            icon={MessageSquare}
          />
          <QuickAction
            href="/admin/seo"
            label="Edit page SEO"
            detail="Titles and descriptions"
            icon={Search}
          />
          <QuickAction
            href="/admin/passkeys"
            label="Manage passkeys"
            detail="Sign in without a password"
            icon={KeyRound}
          />
        </div>
      </div>
    </AdminShell>
  );
}
