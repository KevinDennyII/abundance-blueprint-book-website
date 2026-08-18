import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/browser";

export type BlogPostListItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  createdAt: string;
};

export type BlogPost = BlogPostListItem & {
  body: string;
  status: "draft" | "published";
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
};

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  isDefault: boolean;
};

export type PublicPageSeo = { title: string; description: string };

export type BlogComment = {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
};

export type AdminComment = {
  id: number;
  postId: number;
  authorName: string;
  authorEmail: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  postTitle: string;
  postSlug: string;
};

export type AdminUser = {
  id: number;
  email: string;
};

type ApiError = { ok: false; error: string };

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | ApiError> {
  try {
    const response = await fetch(path, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
      ...init,
    });

    const json = (await response.json()) as T & { ok?: boolean; error?: string };

    if (!response.ok || json.ok === false) {
      return {
        ok: false,
        error:
          typeof json.error === "string"
            ? json.error
            : "Something went wrong. Please try again.",
      };
    }

    return { ok: true, data: json };
  } catch {
    return { ok: false, error: "Unable to reach the server." };
  }
}

export async function fetchPublishedPosts(page = 1) {
  const query = page > 1 ? `?page=${encodeURIComponent(String(page))}` : "";
  return apiFetch<{
    ok: true;
    posts: BlogPostListItem[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }>(`/api/posts${query}`);
}

export async function fetchPublishedPost(slug: string) {
  return apiFetch<{ ok: true; post: BlogPost; comments: BlogComment[] }>(
    `/api/posts/${encodeURIComponent(slug)}`,
  );
}

export async function submitComment(
  slug: string,
  input: {
    authorName: string;
    authorEmail: string;
    body: string;
    website?: string;
  },
) {
  return apiFetch<{ ok: true; message?: string }>(
    `/api/posts/${encodeURIComponent(slug)}/comments`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function loginAdmin(email: string, password: string) {
  return apiFetch<{ ok: true; admin: AdminUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin() {
  return apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export async function fetchAdminMe() {
  return apiFetch<{ ok: true; admin: AdminUser }>("/api/auth/me");
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
) {
  return apiFetch<{ ok: true }>("/api/auth/password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export type AdminPasskey = {
  id: number;
  label: string;
  deviceType: string | null;
  createdAt: string;
  lastUsedAt: string | null;
};

export async function fetchPasskeys() {
  return apiFetch<{ ok: true; passkeys: AdminPasskey[] }>("/api/auth/passkeys");
}

export async function fetchPasskeyRegisterOptions() {
  return apiFetch<{ ok: true; options: PublicKeyCredentialCreationOptionsJSON }>(
    "/api/auth/passkeys/register/options",
    { method: "POST", body: "{}" },
  );
}

export async function verifyPasskeyRegistration(
  response: RegistrationResponseJSON,
  label?: string,
) {
  return apiFetch<{ ok: true }>("/api/auth/passkeys/register/verify", {
    method: "POST",
    body: JSON.stringify({ response, label }),
  });
}

export async function deletePasskey(id: number) {
  return apiFetch<{ ok: true }>(`/api/auth/passkeys/${id}`, {
    method: "DELETE",
  });
}

export async function fetchPasskeyLoginOptions(email?: string) {
  return apiFetch<{ ok: true; options: PublicKeyCredentialRequestOptionsJSON }>(
    "/api/auth/passkeys/login/options",
    {
      method: "POST",
      body: JSON.stringify({ email: email ?? "" }),
    },
  );
}

export async function verifyPasskeyLogin(response: AuthenticationResponseJSON) {
  return apiFetch<{ ok: true; admin: AdminUser }>(
    "/api/auth/passkeys/login/verify",
    {
      method: "POST",
      body: JSON.stringify({ response }),
    },
  );
}

export async function fetchAdminPosts() {
  return apiFetch<{ ok: true; posts: BlogPost[] }>("/api/admin/posts");
}

export async function fetchAdminPost(id: number) {
  return apiFetch<{ ok: true; post: BlogPost }>(`/api/admin/posts/${id}`);
}

export type AdminPostInput = {
  title: string;
  slug?: string;
  excerpt: string;
  body: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
};

export async function createAdminPost(input: AdminPostInput) {
  return apiFetch<{ ok: true; post: BlogPost }>("/api/admin/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAdminPost(id: number, input: AdminPostInput) {
  return apiFetch<{ ok: true; post: BlogPost }>(`/api/admin/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteAdminPost(id: number) {
  return apiFetch<{ ok: true }>(`/api/admin/posts/${id}`, {
    method: "DELETE",
  });
}

export async function fetchAdminComments(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<{ ok: true; comments: AdminComment[] }>(
    `/api/admin/comments${query}`,
  );
}

export async function updateAdminCommentStatus(
  id: number,
  status: "approved" | "rejected",
) {
  return apiFetch<{ ok: true }>(`/api/admin/comments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function fetchPublicSeo() {
  return apiFetch<{ ok: true; pages: Record<string, PublicPageSeo> }>(
    "/api/seo",
  );
}

export async function fetchAdminSeo() {
  return apiFetch<{ ok: true; pages: PageSeo[] }>("/api/admin/seo");
}

export async function updateAdminSeo(
  pages: { path: string; title: string; description: string }[],
) {
  return apiFetch<{ ok: true; pages: PageSeo[] }>("/api/admin/seo", {
    method: "PUT",
    body: JSON.stringify({ pages }),
  });
}

export function formatPostDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
