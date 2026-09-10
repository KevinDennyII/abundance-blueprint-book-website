export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type ContactFormResult =
  | { ok: true }
  | { ok: false; error: string };

export type ReadinessLeadData = {
  firstName: string;
  email: string;
  resultKey: string;
  resultTitle: string;
  source: string;
  tag: string;
};

async function submitWeb3FormsClient(payload: {
  name: string;
  email: string;
  message: string;
  subject: string;
  missingKeyError: string;
  sendErrorFallback: string;
}): Promise<ContactFormResult> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();

  if (!accessKey) {
    return { ok: false, error: payload.missingKeyError };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: payload.name,
        email: payload.email,
        message: payload.message,
        subject: payload.subject,
      }),
    });

    const result = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    if (!response.ok || !result.success) {
      return {
        ok: false,
        error: result.message ?? payload.sendErrorFallback,
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: payload.sendErrorFallback };
  }
}

export async function submitContactForm(
  data: ContactFormData,
): Promise<ContactFormResult> {
  return submitWeb3FormsClient({
    name: data.name,
    email: data.email,
    message: data.message,
    subject: `Abundance Blueprint contact from ${data.name}`,
    missingKeyError:
      "The contact form is not configured yet. Please try again later.",
    sendErrorFallback:
      "Something went wrong sending your message. Please try again.",
  });
}

function buildReadinessMessage(data: ReadinessLeadData): string {
  const sourceLabel = data.source || "default";
  return [
    `First name: ${data.firstName}`,
    `Email: ${data.email}`,
    `Result: ${data.resultKey}`,
    `Title: ${data.resultTitle}`,
    `Source: ${sourceLabel}`,
    `Tag: ${data.tag}`,
  ].join("\n");
}

async function submitReadinessLeadViaApi(
  data: ReadinessLeadData,
): Promise<ContactFormResult> {
  try {
    const response = await fetch("/api/readiness-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        email: data.email,
        resultKey: data.resultKey,
        resultTitle: data.resultTitle,
        source: data.source,
        tag: data.tag,
      }),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return {
        ok: false,
        error: `API notify unavailable (HTTP ${response.status}).`,
      };
    }

    const result = (await response.json().catch(() => null)) as
      | ContactFormResult
      | null;

    if (!result) {
      return {
        ok: false,
        error: `API notify returned an invalid response (HTTP ${response.status}).`,
      };
    }

    if (!response.ok || !result.ok) {
      return {
        ok: false,
        error:
          (!result.ok && result.error) ||
          `API notify failed (HTTP ${response.status}).`,
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "API notify request failed.",
    };
  }
}

export async function submitReadinessLead(
  data: ReadinessLeadData,
): Promise<ContactFormResult> {
  const message = buildReadinessMessage(data);
  const subject = `Readiness assessment: ${data.resultKey} from ${data.firstName}`;

  // Prefer the same browser → Web3Forms path as /contact whenever the
  // Vite key was baked into the bundle.
  const clientResult = await submitWeb3FormsClient({
    name: data.firstName,
    email: data.email,
    message,
    subject,
    missingKeyError: "Client Web3Forms key missing.",
    sendErrorFallback: "Client Web3Forms submit failed.",
  });

  if (clientResult.ok) {
    return clientResult;
  }

  // Fall back to the API runtime secret path for Replit publishes where
  // VITE_ vars are not available at website build time.
  const apiResult = await submitReadinessLeadViaApi(data);
  if (apiResult.ok) {
    return apiResult;
  }

  return {
    ok: false,
    error: `${clientResult.error} Then ${apiResult.error}`,
  };
}
