import type { AuthenticatorTransportFuture } from "@simplewebauthn/server";

export function getRpConfig(): {
  rpID: string;
  rpName: string;
  origins: string[];
} {
  const rpID = process.env.WEBAUTHN_RP_ID?.trim() || "localhost";
  const rpName =
    process.env.WEBAUTHN_RP_NAME?.trim() || "Abundance Blueprint Admin";
  const originsEnv = process.env.WEBAUTHN_ORIGIN?.trim();
  const origins = originsEnv
    ? originsEnv.split(",").map((o) => o.trim()).filter(Boolean)
    : ["http://localhost:5173", "http://localhost:5174"];

  return { rpID, rpName, origins };
}

type ChallengeRecord = {
  challenge: string;
  type: "registration" | "authentication";
  adminId?: number;
  expiresAt: number;
};

const challenges = new Map<string, ChallengeRecord>();
const CHALLENGE_TTL_MS = 5 * 60 * 1000;

export function storeChallenge(
  challenge: string,
  type: "registration" | "authentication",
  adminId?: number,
): void {
  pruneChallenges();
  challenges.set(challenge, {
    challenge,
    type,
    adminId,
    expiresAt: Date.now() + CHALLENGE_TTL_MS,
  });
}

export function takeChallenge(
  challenge: string,
  type: "registration" | "authentication",
): ChallengeRecord | null {
  pruneChallenges();
  const record = challenges.get(challenge);
  if (!record || record.type !== type) {
    return null;
  }
  challenges.delete(challenge);
  return record;
}

function pruneChallenges(): void {
  const now = Date.now();
  for (const [key, value] of challenges) {
    if (value.expiresAt <= now) {
      challenges.delete(key);
    }
  }
}

export function parseTransports(
  raw: string | null | undefined,
): AuthenticatorTransportFuture[] | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return undefined;
    return parsed.filter((t): t is AuthenticatorTransportFuture => typeof t === "string");
  } catch {
    return undefined;
  }
}

export function encodePublicKey(publicKey: Uint8Array): string {
  return Buffer.from(publicKey).toString("base64url");
}

export function decodePublicKey(encoded: string): Uint8Array {
  return new Uint8Array(Buffer.from(encoded, "base64url"));
}
