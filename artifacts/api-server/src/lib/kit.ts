const KIT_API_BASE = "https://api.convertkit.com/v3";

export type KitFormType = "chapter1" | "circle" | "okayinaire" | "live";

type KitErrorResponse = {
  error?: string;
  message?: string;
};

type KitTag = { id: number; name: string };

const LIVE_TAG_NAME = "long-money-live";

/** Cache resolved tag IDs for the process lifetime. */
const tagIdCache = new Map<string, number>();

function getFormId(form: KitFormType): string | undefined {
  if (form === "chapter1") {
    return process.env.KIT_CHAPTER1_FORM_ID;
  }
  if (form === "okayinaire") {
    // Form ID is public; default so signup works if the secret was never added.
    return process.env.KIT_OKAYINAIRE_FORM_ID?.trim() || "10086596";
  }
  if (form === "live") {
    // Form ID is public (from Kit embed); default so signup works if unset.
    return process.env.KIT_LIVE_FORM_ID?.trim() || "10117125";
  }
  return process.env.KIT_CIRCLE_FORM_ID;
}

async function parseKitError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => ({}))) as KitErrorResponse;
  return data.message ?? data.error ?? "Kit subscription failed";
}

async function resolveTagId(
  apiKey: string,
  tagName: string,
): Promise<number | undefined> {
  const cached = tagIdCache.get(tagName);
  if (cached !== undefined) return cached;

  const fromEnv = process.env.KIT_LIVE_TAG_ID?.trim();
  if (fromEnv && /^\d+$/.test(fromEnv)) {
    const id = Number(fromEnv);
    tagIdCache.set(tagName, id);
    return id;
  }

  const response = await fetch(
    `${KIT_API_BASE}/tags?api_key=${encodeURIComponent(apiKey)}`,
  );
  if (!response.ok) return undefined;

  const data = (await response.json().catch(() => ({}))) as {
    tags?: KitTag[];
  };
  const match = (data.tags ?? []).find(
    (tag) => tag.name.trim().toLowerCase() === tagName.toLowerCase(),
  );
  if (!match) return undefined;

  tagIdCache.set(tagName, match.id);
  return match.id;
}

export async function subscribeToKitForm(
  email: string,
  form: KitFormType,
  options?: { firstName?: string; tag?: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.KIT_API_KEY;
  const formId = getFormId(form);

  if (!apiKey) {
    return {
      ok: false,
      error:
        "Email signup is not configured yet. Please try again later.",
    };
  }

  if (!formId) {
    return {
      ok: false,
      error:
        "Email signup is not configured yet. Please try again later.",
    };
  }

  const payload: Record<string, unknown> = { api_key: apiKey, email };
  if (options?.firstName) {
    payload.first_name = options.firstName;
  }

  const tagName =
    options?.tag?.trim() || (form === "live" ? LIVE_TAG_NAME : undefined);
  if (tagName) {
    const tagId = await resolveTagId(apiKey, tagName);
    if (tagId !== undefined) {
      payload.tags = [tagId];
    }
  }

  const response = await fetch(`${KIT_API_BASE}/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return { ok: false, error: await parseKitError(response) };
  }

  return { ok: true };
}
