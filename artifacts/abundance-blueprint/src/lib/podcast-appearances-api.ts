export type PodcastAppearanceStatus = "draft" | "published";

export type AdminPodcastAppearance = {
  id: number;
  showName: string;
  episodeTitle: string;
  publishedDate: string;
  episodeLink: string;
  embedCode: string;
  description: string;
  status: PodcastAppearanceStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminPodcastAppearanceInput = {
  showName: string;
  episodeTitle: string;
  publishedDate: string;
  episodeLink: string;
  embedCode: string;
  description: string;
  status: PodcastAppearanceStatus;
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

export async function fetchAdminPodcastAppearances(
  filter: "all" | "published" | "draft" = "all",
) {
  const query =
    filter !== "all" ? `?filter=${encodeURIComponent(filter)}` : "";
  return apiFetch<{ ok: true; appearances: AdminPodcastAppearance[] }>(
    `/api/admin/podcast-appearances${query}`,
  );
}

export async function fetchAdminPodcastAppearance(id: number) {
  return apiFetch<{ ok: true; appearance: AdminPodcastAppearance }>(
    `/api/admin/podcast-appearances/${id}`,
  );
}

export async function createAdminPodcastAppearance(
  input: AdminPodcastAppearanceInput,
) {
  return apiFetch<{ ok: true; appearance: AdminPodcastAppearance }>(
    "/api/admin/podcast-appearances",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateAdminPodcastAppearance(
  id: number,
  input: AdminPodcastAppearanceInput,
) {
  return apiFetch<{ ok: true; appearance: AdminPodcastAppearance }>(
    `/api/admin/podcast-appearances/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteAdminPodcastAppearance(id: number) {
  return apiFetch<{ ok: true; deleted: number }>(
    `/api/admin/podcast-appearances/${id}`,
    { method: "DELETE" },
  );
}

export function formatAppearanceDateLabel(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
