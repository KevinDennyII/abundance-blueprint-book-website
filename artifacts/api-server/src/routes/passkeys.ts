import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticatorTransportFuture,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { db, adminsTable, passkeysTable } from "@workspace/db";
import { requireAdmin, type AuthedRequest } from "../lib/require-admin";
import { createSession } from "../lib/session";
import {
  decodePublicKey,
  encodePublicKey,
  getRpConfig,
  parseTransports,
  storeChallenge,
  takeChallenge,
} from "../lib/webauthn";

const router: IRouter = Router();

function adminUserIdBytes(adminId: number): Uint8Array {
  const bytes = new Uint8Array(8);
  const view = new DataView(bytes.buffer);
  view.setBigUint64(0, BigInt(adminId), false);
  return bytes;
}

/** List registered passkeys for the signed-in admin */
router.get("/auth/passkeys", requireAdmin, async (req: AuthedRequest, res) => {
  try {
    const rows = await db
      .select({
        id: passkeysTable.id,
        label: passkeysTable.label,
        deviceType: passkeysTable.deviceType,
        createdAt: passkeysTable.createdAt,
        lastUsedAt: passkeysTable.lastUsedAt,
      })
      .from(passkeysTable)
      .where(eq(passkeysTable.adminId, req.admin!.adminId));

    res.json({ ok: true, passkeys: rows });
  } catch (err) {
    req.log?.error?.({ err }, "Failed to list passkeys");
    res.status(503).json({ ok: false, error: "Unable to load passkeys." });
  }
});

/** Begin passkey registration (must already be signed in) */
router.post(
  "/auth/passkeys/register/options",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const adminId = req.admin!.adminId;
    const { rpID, rpName } = getRpConfig();

    try {
      const [admin] = await db
        .select()
        .from(adminsTable)
        .where(eq(adminsTable.id, adminId))
        .limit(1);

      if (!admin) {
        res.status(401).json({ ok: false, error: "Unauthorized." });
        return;
      }

      const existing = await db
        .select({
          credentialId: passkeysTable.credentialId,
          transports: passkeysTable.transports,
        })
        .from(passkeysTable)
        .where(eq(passkeysTable.adminId, adminId));

      const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userName: admin.email,
        userDisplayName: admin.email,
        userID: adminUserIdBytes(admin.id) as Uint8Array<ArrayBuffer>,
        attestationType: "none",
        excludeCredentials: existing.map((row) => ({
          id: row.credentialId,
          transports: parseTransports(row.transports),
        })),
        authenticatorSelection: {
          residentKey: "preferred",
          userVerification: "preferred",
        },
      });

      storeChallenge(options.challenge, "registration", adminId);
      res.json({ ok: true, options });
    } catch (err) {
      req.log?.error?.({ err }, "Passkey registration options failed");
      res
        .status(503)
        .json({ ok: false, error: "Unable to start passkey registration." });
    }
  },
);

/** Finish passkey registration */
router.post(
  "/auth/passkeys/register/verify",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const adminId = req.admin!.adminId;
    const { origins, rpID } = getRpConfig();
    const response = req.body?.response as RegistrationResponseJSON | undefined;
    const label =
      typeof req.body?.label === "string" && req.body.label.trim()
        ? req.body.label.trim().slice(0, 80)
        : "Passkey";

    if (!response?.id || !response.response) {
      res.status(400).json({ ok: false, error: "Invalid registration response." });
      return;
    }

    try {
      const clientData = JSON.parse(
        Buffer.from(response.response.clientDataJSON, "base64url").toString(
          "utf8",
        ),
      ) as { challenge?: string };

      const challenge = clientData.challenge;
      if (!challenge) {
        res.status(400).json({ ok: false, error: "Missing challenge." });
        return;
      }

      const pending = takeChallenge(challenge, "registration");
      if (!pending || pending.adminId !== adminId) {
        res.status(400).json({ ok: false, error: "Challenge expired or invalid." });
        return;
      }

      const verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: pending.challenge,
        expectedOrigin: origins,
        expectedRPID: rpID,
        requireUserVerification: false,
      });

      if (!verification.verified || !verification.registrationInfo) {
        res.status(400).json({ ok: false, error: "Passkey verification failed." });
        return;
      }

      const { credential, credentialDeviceType, credentialBackedUp } =
        verification.registrationInfo;

      await db.insert(passkeysTable).values({
        adminId,
        credentialId: credential.id,
        publicKey: encodePublicKey(credential.publicKey),
        counter: credential.counter,
        transports: credential.transports
          ? JSON.stringify(credential.transports)
          : null,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp ? "true" : "false",
        label,
      });

      res.status(201).json({ ok: true });
    } catch (err) {
      req.log?.error?.({ err }, "Passkey registration verify failed");
      res
        .status(503)
        .json({ ok: false, error: "Unable to save passkey." });
    }
  },
);

/** Delete a passkey */
router.delete(
  "/auth/passkeys/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ ok: false, error: "Invalid passkey id." });
      return;
    }

    try {
      const deleted = await db
        .delete(passkeysTable)
        .where(
          and(
            eq(passkeysTable.id, id),
            eq(passkeysTable.adminId, req.admin!.adminId),
          ),
        )
        .returning({ id: passkeysTable.id });

      if (deleted.length === 0) {
        res.status(404).json({ ok: false, error: "Passkey not found." });
        return;
      }

      res.json({ ok: true });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to delete passkey");
      res.status(503).json({ ok: false, error: "Unable to delete passkey." });
    }
  },
);

/** Begin passkey login (public) */
router.post("/auth/passkeys/login/options", async (req, res) => {
  const { rpID } = getRpConfig();
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  try {
    let allowCredentials:
      | { id: string; transports?: AuthenticatorTransportFuture[] }[]
      | undefined;

    if (email) {
      const [admin] = await db
        .select({ id: adminsTable.id })
        .from(adminsTable)
        .where(eq(adminsTable.email, email))
        .limit(1);

      if (admin) {
        const keys = await db
          .select({
            credentialId: passkeysTable.credentialId,
            transports: passkeysTable.transports,
          })
          .from(passkeysTable)
          .where(eq(passkeysTable.adminId, admin.id));

        allowCredentials = keys.map((row) => ({
          id: row.credentialId,
          transports: parseTransports(row.transports),
        }));
      }
    }

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
      allowCredentials,
    });

    storeChallenge(options.challenge, "authentication");
    res.json({ ok: true, options });
  } catch (err) {
    req.log?.error?.({ err }, "Passkey login options failed");
    res.status(503).json({ ok: false, error: "Unable to start passkey login." });
  }
});

/** Finish passkey login (public) → same session cookie as password login */
router.post("/auth/passkeys/login/verify", async (req, res) => {
  const { origins, rpID } = getRpConfig();
  const response = req.body?.response as AuthenticationResponseJSON | undefined;

  if (!response?.id || !response.response) {
    res.status(400).json({ ok: false, error: "Invalid authentication response." });
    return;
  }

  try {
    const clientData = JSON.parse(
      Buffer.from(response.response.clientDataJSON, "base64url").toString(
        "utf8",
      ),
    ) as { challenge?: string };

    const challenge = clientData.challenge;
    if (!challenge) {
      res.status(400).json({ ok: false, error: "Missing challenge." });
      return;
    }

    const pending = takeChallenge(challenge, "authentication");
    if (!pending) {
      res.status(400).json({ ok: false, error: "Challenge expired or invalid." });
      return;
    }

    const [passkey] = await db
      .select()
      .from(passkeysTable)
      .where(eq(passkeysTable.credentialId, response.id))
      .limit(1);

    if (!passkey) {
      res.status(401).json({ ok: false, error: "Unknown passkey." });
      return;
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: pending.challenge,
      expectedOrigin: origins,
      expectedRPID: rpID,
      requireUserVerification: false,
      credential: {
        id: passkey.credentialId,
        publicKey: decodePublicKey(passkey.publicKey) as Uint8Array<ArrayBuffer>,
        counter: passkey.counter,
        transports: parseTransports(passkey.transports),
      },
    });

    if (!verification.verified) {
      res.status(401).json({ ok: false, error: "Passkey verification failed." });
      return;
    }

    await db
      .update(passkeysTable)
      .set({
        counter: verification.authenticationInfo.newCounter,
        lastUsedAt: new Date(),
      })
      .where(eq(passkeysTable.id, passkey.id));

    const [admin] = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.id, passkey.adminId))
      .limit(1);

    if (!admin) {
      res.status(401).json({ ok: false, error: "Admin not found." });
      return;
    }

    createSession(res, { id: admin.id, email: admin.email });
    res.json({ ok: true, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    req.log?.error?.({ err }, "Passkey login verify failed");
    res.status(503).json({ ok: false, error: "Unable to sign in with passkey." });
  }
});

export default router;
