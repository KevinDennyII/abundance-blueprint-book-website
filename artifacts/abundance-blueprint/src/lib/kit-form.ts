export type KitFormType = "chapter1" | "circle";

export type KitFormResult = { ok: true } | { ok: false; error: string };

export type KitSubscribeOptions = {
  firstName?: string;
  /** Reserved for future Kit tag automations; currently logged server-side only if supported. */
  tag?: string;
};

export async function submitKitForm(
  email: string,
  form: KitFormType,
  options?: KitSubscribeOptions,
): Promise<KitFormResult> {
  const response = await fetch("/api/kit/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      form,
      first_name: options?.firstName,
      tag: options?.tag,
    }),
  });

  const result = (await response.json()) as KitFormResult;

  if (!response.ok || !result.ok) {
    return {
      ok: false,
      error:
        !result.ok && result.error
          ? result.error
          : "Something went wrong. Please try again.",
    };
  }

  return { ok: true };
}
