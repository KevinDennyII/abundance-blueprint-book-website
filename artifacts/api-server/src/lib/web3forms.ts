export type Web3FormsPayload = {
  name: string;
  email: string;
  message: string;
  subject: string;
};

export type Web3FormsResult = { ok: true } | { ok: false; error: string };

function getAccessKey(): string | undefined {
  // Prefer the runtime secret; fall back to the Vite-named key if already
  // configured workspace-wide on Replit.
  return (
    process.env.WEB3FORMS_ACCESS_KEY?.trim() ||
    process.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ||
    undefined
  );
}

export async function submitWeb3Forms(
  payload: Web3FormsPayload,
): Promise<Web3FormsResult> {
  const accessKey = getAccessKey();

  if (!accessKey) {
    return {
      ok: false,
      error:
        "Email notify is not configured yet. Please try again later.",
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
        error:
          result.message ??
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
