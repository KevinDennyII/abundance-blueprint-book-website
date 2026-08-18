import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchAdminSeo, updateAdminSeo, type PageSeo } from "@/lib/blog-api";

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/book": "The Book",
  "/work-with-me": "Work With Me",
  "/circle": "The Long Money Circle",
  "/blog": "Blog",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
};

const TITLE_TARGET = 60;
const DESCRIPTION_TARGET = 155;

function labelFor(path: string): string {
  return PAGE_LABELS[path] ?? path;
}

export default function AdminPageSeo() {
  const [pages, setPages] = useState<PageSeo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const result = await fetchAdminSeo();
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setPages(result.data.pages);
    setDirty(false);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function updateField(
    path: string,
    field: "title" | "description",
    value: string,
  ) {
    setMessage(null);
    setDirty(true);
    setPages((prev) =>
      prev.map((page) =>
        page.path === path ? { ...page, [field]: value } : page,
      ),
    );
  }

  async function handleSave() {
    setError(null);
    setMessage(null);
    setSaving(true);
    const result = await updateAdminSeo(
      pages.map((page) => ({
        path: page.path,
        title: page.title.trim(),
        description: page.description.trim(),
      })),
    );
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPages(result.data.pages);
    setDirty(false);
    setMessage("Saved. Changes are live on the public site.");
  }

  return (
    <AdminShell
      title="Page SEO"
      description="Set a unique title and meta description for each public page. These control the browser tab, Google search results, and link previews. Blog posts have their own SEO fields in the post editor."
    >
      {loading && <p className="text-muted">Loading…</p>}
      {error && (
        <p className="text-destructive mb-4" role="alert">
          {error}
        </p>
      )}

      {!loading && pages.length > 0 && (
        <>
          <div className="max-w-3xl space-y-6">
            {pages.map((page) => {
              const titleLen = page.title.trim().length;
              const descLen = page.description.trim().length;
              return (
                <div
                  key={page.path}
                  className="space-y-5 rounded-xl border border-card-border bg-card p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-card-border pb-4">
                    <h2 className="font-serif text-xl text-primary">
                      {labelFor(page.path)}
                    </h2>
                    <code className="text-xs text-muted">{page.path}</code>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`title-${page.path}`}>Page title</Label>
                    <Input
                      id={`title-${page.path}`}
                      value={page.title}
                      maxLength={120}
                      onChange={(e) =>
                        updateField(page.path, "title", e.target.value)
                      }
                    />
                    <p
                      className={`text-xs ${
                        titleLen > TITLE_TARGET
                          ? "text-secondary"
                          : "text-muted"
                      }`}
                    >
                      {titleLen} characters · aim for about {TITLE_TARGET}.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`desc-${page.path}`}>
                      Meta description
                    </Label>
                    <Textarea
                      id={`desc-${page.path}`}
                      rows={3}
                      value={page.description}
                      maxLength={320}
                      onChange={(e) =>
                        updateField(page.path, "description", e.target.value)
                      }
                    />
                    <p
                      className={`text-xs ${
                        descLen > DESCRIPTION_TARGET
                          ? "text-secondary"
                          : "text-muted"
                      }`}
                    >
                      {descLen} characters · aim for about{" "}
                      {DESCRIPTION_TARGET}.
                    </p>
                  </div>

                  <div className="rounded-lg border border-card-border bg-background/70 p-4">
                    <p className="mb-2 text-[0.65rem] uppercase tracking-widest text-muted">
                      Search result preview
                    </p>
                    <p className="text-xs text-muted">
                      abundanceblueprint.com
                      {page.path === "/" ? "" : page.path}
                    </p>
                    <p className="truncate text-base text-primary">
                      {page.title.trim() || "Untitled page"}
                    </p>
                    <p className="line-clamp-2 text-xs text-foreground/70">
                      {page.description.trim() || "No description set yet."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-0 z-20 -mx-4 mt-8 flex flex-wrap items-center gap-4 border-t border-card-border bg-background/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
            <Button
              type="button"
              disabled={saving || !dirty}
              onClick={() => void handleSave()}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
            {message && (
              <p className="text-sm text-primary" role="status">
                {message}
              </p>
            )}
            {dirty && !message && (
              <p className="text-sm text-muted">You have unsaved changes.</p>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
