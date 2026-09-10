import { Router, type IRouter } from "express";
import { submitWeb3Forms } from "../lib/web3forms";
import { isRateLimited } from "../lib/rate-limit";

const router: IRouter = Router();

const EMAIL_RE = /\S+@\S+\.\S+/;

router.post("/readiness-lead", async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  if (isRateLimited(`readiness:${ip}`, 10, 15 * 60 * 1000)) {
    res.status(429).json({
      ok: false,
      error: "Too many submissions. Please try again later.",
    });
    return;
  }

  const firstName =
    typeof req.body?.firstName === "string" ? req.body.firstName.trim() : "";
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const resultKey =
    typeof req.body?.resultKey === "string" ? req.body.resultKey.trim() : "";
  const resultTitle =
    typeof req.body?.resultTitle === "string"
      ? req.body.resultTitle.trim()
      : "";
  const source =
    typeof req.body?.source === "string" && req.body.source.trim()
      ? req.body.source.trim()
      : "default";
  const tag = typeof req.body?.tag === "string" ? req.body.tag.trim() : "";

  if (!firstName) {
    res.status(400).json({ ok: false, error: "First name is required." });
    return;
  }

  if (!email || !EMAIL_RE.test(email)) {
    res.status(400).json({ ok: false, error: "A valid email is required." });
    return;
  }

  if (!resultKey) {
    res.status(400).json({ ok: false, error: "Result is required." });
    return;
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

  if (!result.ok) {
    res.status(503).json(result);
    return;
  }

  res.json({ ok: true });
});

export default router;
