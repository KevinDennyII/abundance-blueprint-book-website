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

export async function submitContactForm(
  data: ContactFormData,
): Promise<ContactFormResult> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return {
      ok: false,
      error:
        "The contact form is not configured yet. Please try again later.",
    };
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
        name: data.name,
        email: data.email,
        message: data.message,
        subject: `Abundance Blueprint contact from ${data.name}`,
      }),
    });

    const result = (await response.json()) as {
      success?: boolean;
      message?: string;
    };

    if (!response.ok || !result.success) {
      return {
        ok: false,
        error:
          result.message ??
          "Something went wrong sending your message. Please try again.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        "Something went wrong sending your message. Please try again.",
    };
  }
}

export async function submitReadinessLead(
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

    const result = (await response.json().catch(() => ({}))) as ContactFormResult;

    if (!response.ok || !result.ok) {
      return {
        ok: false,
        error:
          (!result.ok && result.error) ||
          "Something went wrong notifying the team. Please try again.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        "Something went wrong notifying the team. Please try again.",
    };
  }
}
