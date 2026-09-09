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

async function submitWeb3Forms(payload: {
  name: string;
  email: string;
  message: string;
  subject: string;
  missingKeyError: string;
  sendErrorFallback: string;
}): Promise<ContactFormResult> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return { ok: false, error: payload.missingKeyError };
  }

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

  const result = (await response.json()) as {
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
}

export async function submitContactForm(
  data: ContactFormData,
): Promise<ContactFormResult> {
  return submitWeb3Forms({
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

export async function submitReadinessLead(
  data: ReadinessLeadData,
): Promise<ContactFormResult> {
  const sourceLabel = data.source || "default";
  const message = [
    `First name: ${data.firstName}`,
    `Email: ${data.email}`,
    `Result: ${data.resultKey}`,
    `Title: ${data.resultTitle}`,
    `Source: ${sourceLabel}`,
    `Tag: ${data.tag}`,
  ].join("\n");

  return submitWeb3Forms({
    name: data.firstName,
    email: data.email,
    message,
    subject: `Readiness assessment: ${data.resultKey} from ${data.firstName}`,
    missingKeyError:
      "We couldn't notify the team right now. Please try again later.",
    sendErrorFallback:
      "Something went wrong notifying the team. Please try again.",
  });
}
