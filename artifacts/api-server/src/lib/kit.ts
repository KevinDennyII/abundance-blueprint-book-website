const KIT_API_BASE = "https://api.kit.com/v4";

export type KitFormType = "chapter1" | "circle";

type KitErrorResponse = {
  errors?: string[];
};

function getFormId(form: KitFormType): string | undefined {
  if (form === "chapter1") {
    return process.env.KIT_CHAPTER1_FORM_ID;
  }

  return process.env.KIT_CIRCLE_FORM_ID;
}

async function parseKitError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => ({}))) as KitErrorResponse;
  return data.errors?.join(", ") ?? "Kit subscription failed";
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

  const headers = {
    "Content-Type": "application/json",
    "X-Kit-Api-Key": apiKey,
  };

  const createResponse = await fetch(`${KIT_API_BASE}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email }),
  });

  if (
    !createResponse.ok &&
    createResponse.status !== 200 &&
    createResponse.status !== 201
  ) {
    return { ok: false, error: await parseKitError(createResponse) };
  }

  const formResponse = await fetch(
    `${KIT_API_BASE}/forms/${formId}/subscribers`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ email_address: email }),
    },
  );

  if (
    !formResponse.ok &&
    formResponse.status !== 200 &&
    formResponse.status !== 201
  ) {
    return { ok: false, error: await parseKitError(formResponse) };
  }

  return { ok: true };
}
