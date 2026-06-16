import { Router, type IRouter } from "express";
import { subscribeToKitForm, type KitFormType } from "../lib/kit";

const router: IRouter = Router();

const validForms = new Set<KitFormType>(["chapter1", "circle"]);

router.post("/kit/subscribe", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const form = req.body?.form as KitFormType;

  if (!email) {
    res.status(400).json({ ok: false, error: "Email is required." });
    return;
  }

  if (!validForms.has(form)) {
    res.status(400).json({ ok: false, error: "Invalid form." });
    return;
  }

  const result = await subscribeToKitForm(email, form);

  if (!result.ok) {
    res.status(503).json(result);
    return;
  }

  res.json({ ok: true });
});

export default router;
