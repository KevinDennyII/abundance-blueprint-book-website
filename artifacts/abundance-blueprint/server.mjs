import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "dist/public");
const KIT_API_BASE = "https://api.kit.com/v4";
const validForms = new Set(["chapter1", "circle"]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getFormId(form) {
  if (form === "chapter1") {
    return process.env.KIT_CHAPTER1_FORM_ID;
  }

  return process.env.KIT_CIRCLE_FORM_ID;
}

async function parseKitError(response) {
  const data = await response.json().catch(() => ({}));
  return data.errors?.join(", ") ?? "Kit subscription failed";
}

async function subscribeToKitForm(email, form) {
  const apiKey = process.env.KIT_API_KEY;
  const formId = getFormId(form);

  if (!apiKey || !formId) {
    return {
      ok: false,
      error:
        "Email signup is not configured yet. Please try again later.",
    };
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Kit-Api-Key": apiKey,
  };

  const createResponse = await fetch(`${KIT_API_BASE}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email }),
  });

  if (
    !createResponse.ok &&
    createResponse.status !== 200 &&
    createResponse.status !== 201
  ) {
    return { ok: false, error: await parseKitError(createResponse) };
  }

  const formResponse = await fetch(
    `${KIT_API_BASE}/forms/${formId}/subscribers`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ email_address: email }),
    },
  );

  if (
    !formResponse.ok &&
    formResponse.status !== 200 &&
    formResponse.status !== 201
  ) {
    return { ok: false, error: await parseKitError(formResponse) };
  }

  return { ok: true };
}

async function handleKitSubscribe(req, res) {
  let body = "";

  for await (const chunk of req) {
    body += chunk;
  }

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Invalid request body." }));
    return;
  }

  const email =
    typeof parsed.email === "string" ? parsed.email.trim() : "";
  const form = parsed.form;

  if (!email) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Email is required." }));
    return;
  }

  if (!validForms.has(form)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Invalid form." }));
    return;
  }

  const result = await subscribeToKitForm(email, form);
  res.writeHead(result.ok ? 200 : 503, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(result));
}

async function serveStatic(urlPath, res) {
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  let resolvedPath = filePath;

  if (existsSync(resolvedPath) && !resolvedPath.endsWith("/")) {
    const stats = await import("node:fs").then((fs) =>
      fs.promises.stat(resolvedPath),
    );

    if (stats.isDirectory()) {
      resolvedPath = path.join(resolvedPath, "index.html");
    }
  } else if (!path.extname(resolvedPath)) {
    const withHtml = `${resolvedPath}.html`;
    if (existsSync(withHtml)) {
      resolvedPath = withHtml;
    } else {
      resolvedPath = path.join(publicDir, "index.html");
    }
  }

  if (!existsSync(resolvedPath)) {
    resolvedPath = path.join(publicDir, "index.html");
  }

  const ext = path.extname(resolvedPath);
  const contentType = mimeTypes[ext] ?? "application/octet-stream";
  const file = await readFile(resolvedPath);

  res.writeHead(200, { "Content-Type": contentType });
  res.end(file);
}

const port = Number(process.env.PORT ?? 21403);

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/api/kit/subscribe") {
    await handleKitSubscribe(req, res);
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  const requestPath =
    url.pathname === "/" ? "index.html" : url.pathname.slice(1);

  try {
    await serveStatic(requestPath, res);
  } catch {
    res.writeHead(500);
    res.end("Internal server error");
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
