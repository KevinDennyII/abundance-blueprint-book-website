import { Router, type IRouter } from "express";
import { submitWeb3Forms } from "../lib/web3forms";
import { isRateLimited } from "../lib/rate-limit";

const router: IRouter = Router();

const EMAIL_RE = /\S+@\S+\.\S+/;

type ReadinessAnswer = {
  questionNumber: number;
  question: string;
  answer: string;
};

function parseAnswers(raw: unknown): ReadinessAnswer[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry, index) => {
    if (!entry || typeof entry !== "object") return [];
    const record = entry as Record<string, unknown>;
    const question =
      typeof record.question === "string" ? record.question.trim() : "";
    const answer =
      typeof record.answer === "string" ? record.answer.trim() : "";
    if (!question || !answer) return [];
    const questionNumber =
      typeof record.questionNumber === "number" &&
      Number.isFinite(record.questionNumber)
        ? record.questionNumber
        : index + 1;
    return [{ questionNumber, question, answer }];
  });
}

function buildReadinessMessage(payload: {
  firstName: string;
  email: string;
  resultKey: string;
  resultTitle: string;
  source: string;
  tag: string;
  answers: ReadinessAnswer[];
  score: number | null;
  q6ForcedRed: boolean | null;
}): string {
  const lines = [
    `First name: ${payload.firstName}`,
    `Email: ${payload.email}`,
    `Result: ${payload.resultKey}`,
    `Title: ${payload.resultTitle || "(none)"}`,
    `Source: ${payload.source}`,
    `Tag: ${payload.tag || "(none)"}`,
  ];

  if (payload.answers.length > 0) {
    lines.push("", "--- Answers ---");
    for (const entry of payload.answers) {
      lines.push(
        `Q${entry.questionNumber}: ${entry.question}`,
        `Answer: ${entry.answer}`,
        "",
      );
    }
  }

  if (payload.score !== null) {
    lines.push(`Total score (Q1–Q5): ${payload.score}`);
  }
  if (payload.q6ForcedRed !== null) {
    lines.push(
      `Q6 forced Red result: ${payload.q6ForcedRed ? "Yes" : "No"}`,
    );
  }

  return lines.join("\n");
}

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
  const answers = parseAnswers(req.body?.answers);
  const score =
    typeof req.body?.score === "number" && Number.isFinite(req.body.score)
      ? req.body.score
      : null;
  const q6ForcedRed =
    typeof req.body?.q6ForcedRed === "boolean" ? req.body.q6ForcedRed : null;

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

  const message = buildReadinessMessage({
    firstName,
    email,
    resultKey,
    resultTitle,
    source,
    tag,
    answers,
    score,
    q6ForcedRed,
  });

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
