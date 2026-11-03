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
  createAdminPodcastAppearance,
  fetchAdminPodcastAppearance,
  updateAdminPodcastAppearance,
  type PodcastAppearanceStatus,
} from "@/lib/podcast-appearances-api";

type Mode = "new" | "edit";

export default function AdminPodcastAppearanceEditor({ mode }: { mode: Mode }) {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const appearanceId = mode === "edit" ? Number(params.id) : null;

  const [showName, setShowName] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [episodeLink, setEpisodeLink] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<PodcastAppearanceStatus>("draft");

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (
      mode !== "edit" ||
      !appearanceId ||
      !Number.isInteger(appearanceId)
    ) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const result = await fetchAdminPodcastAppearance(appearanceId);
      if (cancelled) return;

      if (!result.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const appearance = result.data.appearance;
      setShowName(appearance.showName);
      setEpisodeTitle(appearance.episodeTitle);
      setPublishedDate(appearance.publishedDate);
      setEpisodeLink(appearance.episodeLink);
      setEmbedCode(appearance.embedCode);
      setDescription(appearance.description);
      setStatus(appearance.status);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, appearanceId]);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      showName,
      episodeTitle,
      publishedDate,
      episodeLink,
      embedCode,
      description,
      status,
    };

    if (mode === "new") {
      const result = await createAdminPodcastAppearance(payload);
      setSaving(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setLocation("/admin/podcast-appearances");
      return;
    }

    const result = await updateAdminPodcastAppearance(appearanceId!, payload);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setLocation("/admin/podcast-appearances");
  }

  if (notFound) {
    return <Redirect to="/admin/podcast-appearances" />;
  }

  return (
    <AdminShell
      title={mode === "new" ? "New appearance" : "Edit appearance"}
      description="Published entries appear at the bottom of /live, newest first. Same records can power an As Heard On page later."
      actions={
        <Link
          href="/admin/podcast-appearances"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft />
          Back
        </Link>
      }
    >
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl space-y-6 rounded-xl border border-card-border bg-card p-6 md:p-8"
        >
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as PodcastAppearanceStatus)
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="showName">Show name</Label>
            <Input
              id="showName"
              required
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              placeholder="The Money Mindset Show"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="episodeTitle">Episode title</Label>
            <Input
              id="episodeTitle"
              required
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
              placeholder="There's Life Beneath the Numbers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedDate">Date published</Label>
            <Input
              id="publishedDate"
              type="date"
              required
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="episodeLink">Episode link</Label>
            <Input
              id="episodeLink"
              type="url"
              value={episodeLink}
              onChange={(e) => setEpisodeLink(e.target.value)}
              placeholder="https://open.spotify.com/… or Apple / YouTube"
            />
            <p className="text-xs text-muted">
              Spotify, Apple Podcasts, or YouTube. Required for the Listen button
              when there is no embed.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="embedCode">Embed code (optional)</Label>
            <Textarea
              id="embedCode"
              rows={4}
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              className="font-mono text-sm"
              placeholder='Paste a Spotify or YouTube <iframe …> embed'
            />
            <p className="text-xs text-muted">
              When present, the player shows on the site. Only Spotify and
              YouTube iframe embeds are accepted.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">One-line description (optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short line about the conversation"
              maxLength={200}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving…"
                : mode === "new"
                  ? "Create appearance"
                  : "Save changes"}
            </Button>
            <Link
              href="/admin/podcast-appearances"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
