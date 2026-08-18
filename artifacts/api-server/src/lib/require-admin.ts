import type { NextFunction, Request, Response } from "express";
import { readSession, type SessionPayload } from "./session";

export type AuthedRequest = Request & {
  admin?: SessionPayload;
};

export function requireAdmin(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const session = readSession(req);
  if (!session) {
    res.status(401).json({ ok: false, error: "Unauthorized." });
    return;
  }

  req.admin = session;
  next();
}
