import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, Redirect, useLocation, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  createAdminPost,
  fetchAdminPost,
  slugifyTitle,
  updateAdminPost,
} from "@/lib/blog-api";

type Mode = "new" | "edit";

export default function AdminPostEditor({ mode }: { mode: Mode }) {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const postId = mode === "edit" ? Number(params.id) : null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !postId || !Number.isInteger(postId)) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const result = await fetchAdminPost(postId);
      if (cancelled) return;

      if (!result.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const post = result.data.post;
      setTitle(post.title);
      setSlug(post.slug);
      setSlugTouched(true);
      setExcerpt(post.excerpt);
      setBody(post.body);
      setMetaTitle(post.metaTitle ?? "");
      setMetaDescription(post.metaDescription ?? "");
      setStatus(post.status);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, postId]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugifyTitle(value));
    }
  }

  async function save(nextStatus: "draft" | "published") {
    setError(null);
    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugifyTitle(title),
      excerpt: excerpt.trim(),
      body,
      status: nextStatus,
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
    };

    const result =
      mode === "new"
        ? await createAdminPost(payload)
        : await updateAdminPost(postId!, payload);

    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setStatus(result.data.post.status);

    if (nextStatus === "published") {
      setLocation("/admin/posts");
      return;
    }

    if (mode === "new") {
      setLocation(`/admin/posts/${result.data.post.id}/edit`);
    }
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    await save(status);
  }

  if (notFound) {
    return <Redirect to="/admin/posts" />;
  }

  return (
    <AdminShell
      title={mode === "new" ? "New post" : "Edit post"}
      description="Write in Markdown. Saving a draft keeps the post hidden until you publish it."
      actions={
        <>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide",
              status === "published"
                ? "bg-secondary/25 text-secondary-foreground"
                : "bg-muted/20 text-muted",
            )}
          >
            {status}
          </span>
          <Link
            href="/admin/posts"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <ArrowLeft />
            All posts
          </Link>
        </>
      }
    >
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <fieldset className="space-y-6 rounded-xl border border-card-border bg-card p-5">
            <legend className="px-2 text-sm font-medium text-primary">
              Content
            </legend>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
              />
              <p className="text-xs text-muted">
                Public URL: /blog/{slug || "…"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary shown on the blog list"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Body (Markdown)</Label>
              <Textarea
                id="body"
                rows={16}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="font-mono text-sm"
                placeholder="Write your post in Markdown…"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-6 rounded-xl border border-card-border bg-card p-5">
            <legend className="px-2 text-sm font-medium text-primary">
              Search engine (SEO)
            </legend>
            <p className="-mt-2 text-xs text-muted">
              Optional. Controls how this post appears in Google and social
              shares. Leave blank to use the title and excerpt above.
            </p>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta title</Label>
              <Input
                id="metaTitle"
                value={metaTitle}
                maxLength={120}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || "Falls back to the post title"}
              />
              <p className="text-xs text-muted">
                {metaTitle.length}/120 · aim for about 60 characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea
                id="metaDescription"
                rows={3}
                value={metaDescription}
                maxLength={320}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={excerpt || "Falls back to the excerpt"}
              />
              <p className="text-xs text-muted">
                {metaDescription.length}/320 · aim for about 155 characters.
              </p>
            </div>
          </fieldset>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-t border-card-border bg-background/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
            <Button
              type="button"
              variant="outline"
              disabled={saving || !title.trim()}
              onClick={() => void save("draft")}
            >
              {saving ? "Saving…" : "Save draft"}
            </Button>
            <Button
              type="button"
              disabled={saving || !title.trim()}
              onClick={() => void save("published")}
            >
              {saving ? "Saving…" : "Publish"}
            </Button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
