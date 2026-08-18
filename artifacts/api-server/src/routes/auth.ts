import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, adminsTable } from "@workspace/db";
import {
  clearSession,
  createSession,
  readSession,
} from "../lib/session";

const router: IRouter = Router();

router.post("/auth/login", async (req, res) => {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password) {
    res.status(400).json({ ok: false, error: "Email and password are required." });
    return;
  }

  try {
    const [admin] = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.email, email))
      .limit(1);

    if (!admin) {
      res.status(401).json({ ok: false, error: "Invalid email or password." });
      return;
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      res.status(401).json({ ok: false, error: "Invalid email or password." });
      return;
    }

    createSession(res, { id: admin.id, email: admin.email });
    res.json({ ok: true, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    req.log?.error?.({ err }, "Login failed");
    res.status(503).json({ ok: false, error: "Unable to sign in right now." });
  }
});

router.post("/auth/logout", (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

router.get("/auth/me", (req, res) => {
  const session = readSession(req);
  if (!session) {
    res.status(401).json({ ok: false, error: "Unauthorized." });
    return;
  }

  res.json({
    ok: true,
    admin: { id: session.adminId, email: session.email },
  });
});

router.post("/auth/password", async (req, res) => {
  const session = readSession(req);
  if (!session) {
    res.status(401).json({ ok: false, error: "Unauthorized." });
    return;
  }

  const currentPassword =
    typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
  const newPassword =
    typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

  if (!currentPassword || !newPassword) {
    res.status(400).json({
      ok: false,
      error: "Current password and new password are required.",
    });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({
      ok: false,
      error: "New password must be at least 8 characters.",
    });
    return;
  }

  if (currentPassword === newPassword) {
    res.status(400).json({
      ok: false,
      error: "New password must be different from the current password.",
    });
    return;
  }

  try {
    const [admin] = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.id, session.adminId))
      .limit(1);

    if (!admin) {
      res.status(401).json({ ok: false, error: "Unauthorized." });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!valid) {
      res.status(401).json({ ok: false, error: "Current password is incorrect." });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db
      .update(adminsTable)
      .set({ passwordHash })
      .where(eq(adminsTable.id, admin.id));

    res.json({ ok: true });
  } catch (err) {
    req.log?.error?.({ err }, "Password change failed");
    res.status(503).json({ ok: false, error: "Unable to update password." });
  }
});

export default router;
