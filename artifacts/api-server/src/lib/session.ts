import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import type { CookieOptions, Request, Response } from "express";

export type SessionPayload = {
  adminId: number;
  email: string;
  exp: number;
};

const COOKIE_NAME = "ab_session";
const SESSION_DAYS = 7;
const MAX_AGE_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET must be set to a string at least 16 characters long.",
    );
  }
  return secret;
}

function encodePayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function sign(encoded: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(encoded)
    .digest("base64url");
}

function cookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_MS,
  };
}

/** Shared helper so password login, passkeys, and future magic-link mint the same session. */
export function createSession(
  res: Response,
  admin: { id: number; email: string },
): void {
  const payload: SessionPayload = {
    adminId: admin.id,
    email: admin.email,
    exp: Date.now() + MAX_AGE_MS,
  };
  const encoded = encodePayload(payload);
  const token = `${encoded}.${sign(encoded)}`;
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

export function clearSession(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function readSession(req: Request): SessionPayload | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  let expected: string;
  try {
    expected = sign(encoded);
  } catch {
    return null;
  }

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (
    sigBuf.length !== expBuf.length ||
    !timingSafeEqual(sigBuf, expBuf)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (
      typeof payload.adminId !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
