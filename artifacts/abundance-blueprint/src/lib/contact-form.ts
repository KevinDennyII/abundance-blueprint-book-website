export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type ContactFormResult =
  | { ok: true }
  | { ok: false; error: string };

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
}
