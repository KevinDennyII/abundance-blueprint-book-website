import { useEffect, useState } from "react";
import {
  browserSupportsWebAuthn,
  startRegistration,
} from "@simplewebauthn/browser";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deletePasskey,
  fetchPasskeyRegisterOptions,
  fetchPasskeys,
  formatPostDate,
  verifyPasskeyRegistration,
  type AdminPasskey,
} from "@/lib/blog-api";

export default function AdminPasskeys() {
  const [passkeys, setPasskeys] = useState<AdminPasskey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [label, setLabel] = useState("This device");
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const supported =
    typeof window !== "undefined" && browserSupportsWebAuthn();

  async function load() {
    setLoading(true);
    setError(null);
    const result = await fetchPasskeys();
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setPasskeys(result.data.passkeys);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleRegister() {
    setError(null);
    setMessage(null);
    setBusy(true);

    try {
      const optionsResult = await fetchPasskeyRegisterOptions();
      if (!optionsResult.ok) {
        setError(optionsResult.error);
        return;
      }

      const attestation = await startRegistration({
        optionsJSON: optionsResult.data.options,
      });

      const verifyResult = await verifyPasskeyRegistration(
        attestation,
        label.trim() || "Passkey",
      );
      if (!verifyResult.ok) {
        setError(verifyResult.error);
        return;
      }

      setMessage("Passkey saved. You can use it on the login page next time.");
      setLabel("This device");
      await load();
    } catch (err) {
      const msg =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Passkey registration was cancelled."
          : "Could not register a passkey on this device.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: number, passkeyLabel: string) {
    if (!window.confirm(`Remove passkey “${passkeyLabel}”?`)) {
      return;
    }
    setBusyId(id);
    const result = await deletePasskey(id);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await load();
  }

  return (
    <AdminShell
      title="Passkeys"
      description="Register a passkey (Touch ID, Face ID, Windows Hello, or a security key) so you can sign in without typing your password. Password login still works as a backup."
    >
      {!supported && (
        <p className="text-destructive mb-6" role="alert">
          This browser does not support passkeys.
        </p>
      )}

      {supported && (
        <div className="mb-10 max-w-md space-y-4 rounded-xl border border-card-border bg-card p-5">
          <h2 className="border-b border-card-border pb-3 font-serif text-xl text-primary">
            Add a passkey
          </h2>
          <div className="space-y-2">
            <Label htmlFor="passkeyLabel">Label</Label>
            <Input
              id="passkeyLabel"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. MacBook Touch ID"
              maxLength={80}
            />
          </div>
          <Button
            type="button"
            disabled={busy}
            onClick={() => void handleRegister()}
          >
            {busy ? "Waiting for device…" : "Add passkey"}
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive mb-4" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm text-primary mb-4" role="status">
          {message}
        </p>
      )}

      <h2 className="mb-4 font-serif text-xl text-primary">
        Registered passkeys
      </h2>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && passkeys.length === 0 && (
        <p className="text-muted">No passkeys registered yet.</p>
      )}

      {!loading && passkeys.length > 0 && (
        <ul className="max-w-2xl divide-y divide-card-border overflow-hidden rounded-xl border border-card-border bg-card">
          {passkeys.map((passkey) => (
            <li
              key={passkey.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium text-primary">{passkey.label}</p>
                <p className="text-xs text-muted mt-1">
                  Added {formatPostDate(passkey.createdAt)}
                  {passkey.lastUsedAt
                    ? ` · Last used ${formatPostDate(passkey.lastUsedAt)}`
                    : ""}
                  {passkey.deviceType ? ` · ${passkey.deviceType}` : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={busyId === passkey.id}
                onClick={() => void handleDelete(passkey.id, passkey.label)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
