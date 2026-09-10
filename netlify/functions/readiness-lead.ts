import type { Handler, HandlerEvent } from "@netlify/functions";

type Web3FormsResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /\S+@\S+\.\S+/;

function getAccessKey(): string | undefined {
  return (
    process.env.WEB3FORMS_ACCESS_KEY?.trim() ||
    process.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ||
    undefined
  );
}

async function submitWeb3Forms(payload: {
  name: string;
  email: string;
  message: string;
  subject: string;
}): Promise<Web3FormsResult> {
  const accessKey = getAccessKey();

  if (!accessKey) {
    return {
      ok: false,
      error: "Email notify is not configured yet. Please try again later.",
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
      error: "Something went wrong notifying the team. Please try again.",
    };
  }
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  let body: {
    firstName?: string;
    email?: string;
    resultKey?: string;
    resultTitle?: string;
    source?: string;
    tag?: string;
  };

  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: "Invalid request body." }),
    };
  }

  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const resultKey =
    typeof body.resultKey === "string" ? body.resultKey.trim() : "";
  const resultTitle =
    typeof body.resultTitle === "string" ? body.resultTitle.trim() : "";
  const source =
    typeof body.source === "string" && body.source.trim()
      ? body.source.trim()
      : "default";
  const tag = typeof body.tag === "string" ? body.tag.trim() : "";

  if (!firstName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: "First name is required." }),
    };
  }

  if (!email || !EMAIL_RE.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: false,
        error: "A valid email is required.",
      }),
    };
  }

  if (!resultKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: "Result is required." }),
    };
  }

  const message = [
    `First name: ${firstName}`,
    `Email: ${email}`,
    `Result: ${resultKey}`,
    `Title: ${resultTitle || "(none)"}`,
    `Source: ${source}`,
    `Tag: ${tag || "(none)"}`,
  ].join("\n");

  const result = await submitWeb3Forms({
    name: firstName,
    email,
    message,
    subject: `Readiness assessment: ${resultKey} from ${firstName}`,
  });

  return {
    statusCode: result.ok ? 200 : 503,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  };
};
