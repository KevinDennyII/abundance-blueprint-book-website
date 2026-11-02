export type AdminLiveEvent = {
  id: number;
  showOnSite: boolean;
  eventDate: string;
  time: string;
  type: string;
  title: string;
  venue: string;
  address: string;
  cityState: string;
  price: string;
  rsvpLink: string;
  seriesId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminLiveEventInput = {
  showOnSite: boolean;
  eventDate: string;
  time: string;
  type: string;
  title: string;
  venue: string;
  address: string;
  cityState: string;
  price: string;
  rsvpLink: string;
  repeatInterval?: "none" | "weekly" | "biweekly" | "monthly";
  repeatEndDate?: string;
};

type ApiError = { ok: false; error: string };

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | ApiError> {
  try {
    const response = await fetch(path, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
      ...init,
    });

    const json = (await response.json()) as T & { ok?: boolean; error?: string };

    if (!response.ok || json.ok === false) {
      return {
        ok: false,
        error:
          typeof json.error === "string"
            ? json.error
            : "Something went wrong. Please try again.",
      };
    }

    return { ok: true, data: json };
  } catch {
    return { ok: false, error: "Unable to reach the server." };
  }
}

export async function fetchAdminLiveEvents(
  filter: "all" | "upcoming" | "past" = "all",
) {
  const query =
    filter !== "all" ? `?filter=${encodeURIComponent(filter)}` : "";
  return apiFetch<{ ok: true; events: AdminLiveEvent[] }>(
    `/api/admin/live-events${query}`,
  );
}

export async function fetchAdminLiveEvent(id: number) {
  return apiFetch<{ ok: true; event: AdminLiveEvent }>(
    `/api/admin/live-events/${id}`,
  );
}

export async function createAdminLiveEvent(input: AdminLiveEventInput) {
  return apiFetch<{
    ok: true;
    event: AdminLiveEvent;
    events?: AdminLiveEvent[];
    created: number;
    seriesId?: string;
  }>("/api/admin/live-events", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAdminLiveEvent(
  id: number,
  input: AdminLiveEventInput,
) {
  return apiFetch<{ ok: true; event: AdminLiveEvent }>(
    `/api/admin/live-events/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteAdminLiveEvent(
  id: number,
  options?: { series?: boolean },
) {
  const query = options?.series ? "?series=1" : "";
  return apiFetch<{ ok: true; deleted: number; seriesId?: string }>(
    `/api/admin/live-events/${id}${query}`,
    { method: "DELETE" },
  );
}

export function formatEventDateLabel(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
