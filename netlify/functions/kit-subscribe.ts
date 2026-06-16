import type { Handler, HandlerEvent } from "@netlify/functions";

type KitFormType = "chapter1" | "circle";

const KIT_API_BASE = "https://api.kit.com/v4";
const validForms = new Set<KitFormType>(["chapter1", "circle"]);

function getFormId(form: KitFormType): string | undefined {
  if (form === "chapter1") {
    return process.env.KIT_CHAPTER1_FORM_ID;
  }

  return process.env.KIT_CIRCLE_FORM_ID;
}

async function parseKitError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => ({}))) as {
    errors?: string[];
  };
  return data.errors?.join(", ") ?? "Kit subscription failed";
}

async function subscribeToKitForm(
  email: string,
  form: KitFormType,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.KIT_API_KEY;
  const formId = getFormId(form);

  if (!apiKey || !formId) {
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

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  let body: { email?: string; form?: KitFormType };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: "Invalid request body." }),
    };
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const form = body.form;

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: "Email is required." }),
    };
  }

  if (!form || !validForms.has(form)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: "Invalid form." }),
    };
  }

  const result = await subscribeToKitForm(email, form);

  return {
    statusCode: result.ok ? 200 : 503,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  };
};
