const KIT_API_BASE = "https://api.convertkit.com/v3";

export type KitFormType = "chapter1" | "circle";

type KitErrorResponse = {
  error?: string;
  message?: string;
};

function getFormId(form: KitFormType): string | undefined {
  if (form === "chapter1") {
    return process.env.KIT_CHAPTER1_FORM_ID;
  }

  return process.env.KIT_CIRCLE_FORM_ID;
}

async function parseKitError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => ({}))) as KitErrorResponse;
  return data.message ?? data.error ?? "Kit subscription failed";
}

export async function subscribeToKitForm(
  email: string,
  form: KitFormType,
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

  const response = await fetch(`${KIT_API_BASE}/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, email }),
  });

  if (!response.ok) {
    return { ok: false, error: await parseKitError(response) };
  }

  return { ok: true };
}
