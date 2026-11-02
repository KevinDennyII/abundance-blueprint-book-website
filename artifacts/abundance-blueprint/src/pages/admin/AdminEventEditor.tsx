import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, Redirect, useLocation, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  createAdminLiveEvent,
  fetchAdminLiveEvent,
  updateAdminLiveEvent,
} from "@/lib/live-events-api";

type Mode = "new" | "edit";

type RepeatInterval = "none" | "weekly" | "biweekly" | "monthly";

export default function AdminEventEditor({ mode }: { mode: Mode }) {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const eventId = mode === "edit" ? Number(params.id) : null;

  const [showOnSite, setShowOnSite] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Workshop");
  const [title, setTitle] = useState("There's Life Beneath the Numbers");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [cityState, setCityState] = useState("");
  const [price, setPrice] = useState("Free");
  const [rsvpLink, setRsvpLink] = useState("");
  const [seriesId, setSeriesId] = useState<string | null>(null);
  const [repeatInterval, setRepeatInterval] = useState<RepeatInterval>("none");
  const [repeatEndDate, setRepeatEndDate] = useState("");

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !eventId || !Number.isInteger(eventId)) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const result = await fetchAdminLiveEvent(eventId);
      if (cancelled) return;

      if (!result.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const event = result.data.event;
      setShowOnSite(event.showOnSite);
      setEventDate(event.eventDate);
      setTime(event.time);
      setType(event.type);
      setTitle(event.title);
      setVenue(event.venue);
      setAddress(event.address);
      setCityState(event.cityState);
      setPrice(event.price);
      setRsvpLink(event.rsvpLink);
      setSeriesId(event.seriesId);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, eventId]);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      showOnSite,
      eventDate,
      time,
      type,
      title,
      venue,
      address,
      cityState,
      price,
      rsvpLink,
      ...(mode === "new" && repeatInterval !== "none"
        ? { repeatInterval, repeatEndDate }
        : {}),
    };

    if (mode === "new") {
      const result = await createAdminLiveEvent(payload);
      setSaving(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.data.created > 1) {
        window.alert(`Created ${result.data.created} dates in this series.`);
      }
      setLocation("/admin/events");
      return;
    }

    const result = await updateAdminLiveEvent(eventId!, payload);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setLocation("/admin/events");
  }

  if (notFound) {
    return <Redirect to="/admin/events" />;
  }

  return (
    <AdminShell
      title={mode === "new" ? "New event" : "Edit event"}
      description={
        mode === "edit" && seriesId
          ? "Editing this date only. Use Delete series on the list to remove the whole series."
          : "Shown on /live when “Show on site” is on and the date is today or later."
      }
      actions={
        <Link
          href="/admin/events"
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
          <div className="flex items-center gap-3">
            <Checkbox
              id="showOnSite"
              checked={showOnSite}
              onCheckedChange={(checked) => setShowOnSite(checked === true)}
            />
            <Label htmlFor="showOnSite" className="font-medium cursor-pointer">
              Show on site
            </Label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                placeholder="6:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                placeholder="Workshop"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                placeholder="Free"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cityState">City, State</Label>
            <Input
              id="cityState"
              placeholder="Baltimore, MD"
              value={cityState}
              onChange={(e) => setCityState(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rsvpLink">RSVP link</Label>
            <Input
              id="rsvpLink"
              type="url"
              placeholder="https://"
              value={rsvpLink}
              onChange={(e) => setRsvpLink(e.target.value)}
            />
          </div>

          {mode === "new" ? (
            <div className="space-y-4 rounded-lg border border-border bg-background p-4">
              <p className="font-serif text-lg text-primary">Repeat</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="repeatInterval">Interval</Label>
                  <select
                    id="repeatInterval"
                    className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={repeatInterval}
                    onChange={(e) =>
                      setRepeatInterval(e.target.value as RepeatInterval)
                    }
                  >
                    <option value="none">Does not repeat</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every 2 weeks</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                {repeatInterval !== "none" ? (
                  <div className="space-y-2">
                    <Label htmlFor="repeatEndDate">Repeat until</Label>
                    <Input
                      id="repeatEndDate"
                      type="date"
                      required
                      value={repeatEndDate}
                      onChange={(e) => setRepeatEndDate(e.target.value)}
                    />
                  </div>
                ) : null}
              </div>
              {repeatInterval !== "none" ? (
                <p className="text-xs text-muted">
                  Creates one row per date (max 52). You can edit or delete a
                  single date later without changing the rest.
                </p>
              ) : null}
            </div>
          ) : null}

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
                  ? "Create event"
                  : "Save changes"}
            </Button>
            <Link
              href="/admin/events"
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
