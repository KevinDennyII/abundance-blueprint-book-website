import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CalendarDays, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  deleteAdminLiveEvent,
  fetchAdminLiveEvents,
  formatEventDateLabel,
  type AdminLiveEvent,
} from "@/lib/live-events-api";

type Filter = "all" | "upcoming" | "past";

export default function AdminEvents() {
  const [events, setEvents] = useState<AdminLiveEvent[]>([]);
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load(nextFilter = filter) {
    setLoading(true);
    setError(null);
    const result = await fetchAdminLiveEvents(nextFilter);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setEvents(result.data.events);
    setLoading(false);
  }

  useEffect(() => {
    void load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when filter changes
  }, [filter]);

  async function handleDelete(event: AdminLiveEvent, series: boolean) {
    const label = series
      ? `Delete the entire series for “${event.title}”?`
      : `Delete “${event.title}” on ${formatEventDateLabel(event.eventDate)}?`;
    if (!window.confirm(`${label} This cannot be undone.`)) {
      return;
    }
    setBusyId(event.id);
    const result = await deleteAdminLiveEvent(event.id, { series });
    setBusyId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await load();
  }

  const filters: { id: Filter; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "all", label: "All" },
  ];

  return (
    <AdminShell
      title="Events"
      description="Add, edit, or remove Long Money Live dates. Past dates drop off /live automatically."
      actions={
        <Link
          href="/admin/events/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus />
          New event
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

      {!loading && events.length === 0 && (
        <div className="rounded-xl border border-card-border bg-card p-10 text-center">
          <CalendarDays className="mx-auto mb-3 size-8 text-muted" />
          <p className="font-serif text-xl text-primary">No events yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Create a workshop, signing, or Circle date. Turn on “Show on site”
            when it’s ready for the public Live page.
          </p>
          <Link
            href="/admin/events/new"
            className={cn(buttonVariants({ variant: "default" }), "mt-6")}
          >
            <Plus />
            Create your first event
          </Link>
        </div>
      )}

      {!loading && events.length > 0 && (
        <ul className="divide-y divide-card-border overflow-hidden rounded-xl border border-card-border bg-card">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-xl text-primary">
                    {event.title}
                  </h2>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide",
                      event.showOnSite
                        ? "bg-secondary/25 text-secondary-foreground"
                        : "bg-muted/20 text-muted",
                    )}
                  >
                    {event.showOnSite ? "On site" : "Hidden"}
                  </span>
                  {event.seriesId ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide text-primary">
                      Series
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {formatEventDateLabel(event.eventDate)}
                  {event.time ? ` · ${event.time}` : ""}
                  {event.type ? ` · ${event.type}` : ""}
                  {event.cityState ? ` · ${event.cityState}` : ""}
                </p>
                {event.venue ? (
                  <p className="mt-0.5 text-sm text-foreground/80">
                    {event.venue}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Edit
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busyId === event.id}
                  onClick={() => void handleDelete(event, false)}
                >
                  Delete
                </Button>
                {event.seriesId ? (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={busyId === event.id}
                    onClick={() => void handleDelete(event, true)}
                  >
                    Delete series
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
