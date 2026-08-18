import { useState, type SyntheticEvent } from "react";
import { Redirect } from "wouter";
import {
  browserSupportsWebAuthn,
  startAuthentication,
} from "@simplewebauthn/browser";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchPasskeyLoginOptions,
  verifyPasskeyLogin,
} from "@/lib/blog-api";
import { PageMeta } from "@/lib/seo";

export default function AdminLogin() {
  const { admin, loading, login, setAdminFromSession } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const passkeysSupported =
    typeof window !== "undefined" && browserSupportsWebAuthn();

  if (!loading && admin) {
    return <Redirect to="/admin" />;
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
    }
  }

  async function handlePasskeyLogin() {
    setError(null);
    setPasskeyBusy(true);

    try {
      const optionsResult = await fetchPasskeyLoginOptions(email || undefined);
      if (!optionsResult.ok) {
        setError(optionsResult.error);
        return;
      }

      const assertion = await startAuthentication({
        optionsJSON: optionsResult.data.options,
      });

      const verifyResult = await verifyPasskeyLogin(assertion);
      if (!verifyResult.ok) {
        setError(verifyResult.error);
        return;
      }

      setAdminFromSession(verifyResult.data.admin);
    } catch (err) {
      const message =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Passkey sign-in was cancelled."
          : "Passkey sign-in failed. Try password, or register a passkey first.";
      setError(message);
    } finally {
      setPasskeyBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <PageMeta title="Admin login — Abundance Blueprint" noindex />
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl text-primary mb-2 text-center">
          Admin login
        </h1>
        <p className="text-sm text-muted text-center mb-8">
          Sign in to publish posts and moderate comments.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        {passkeysSupported && (
          <div className="mt-6">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-card-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide">
                <span className="bg-background px-3 text-muted">or</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={passkeyBusy}
              onClick={() => void handlePasskeyLogin()}
            >
              {passkeyBusy ? "Waiting for passkey…" : "Sign in with passkey"}
            </Button>
            <p className="text-xs text-muted text-center mt-3">
              Optional: enter your email above first if you have multiple
              devices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
