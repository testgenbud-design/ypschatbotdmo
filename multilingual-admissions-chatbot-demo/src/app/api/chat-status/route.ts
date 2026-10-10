import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/chat-status — self-diagnosis for a deployed build.
 * Reports whether the OpenRouter env is wired up and makes a real 1-token
 * test call so the exact failure (401 key · 402 credits · 404 model · timeout)
 * is visible. Never exposes the key itself. Safe to delete after go-live.
 */
export async function GET() {
  const key = process.env.OPENROUTER_API_KEY ?? "";
  const primary = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
  const fallback = process.env.OPENROUTER_MODEL_FALLBACK || "meta-llama/llama-3.3-70b-instruct:free";

  const report: Record<string, unknown> = {
    keyConfigured: Boolean(key),
    keyStartsWithSkOr: key.startsWith("sk-or-"),
    keyLength: key.length || undefined,
    model: primary,
    fallbackModel: fallback,
  };

  if (!key) {
    report.problem = "OPENROUTER_API_KEY is not set on this deployment — add it in Vercel → Settings → Environment Variables, then REDEPLOY (env vars only apply to new deployments).";
    return NextResponse.json(report);
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "X-Title": "YTC admissions assistant — status check",
      },
      body: JSON.stringify({
        model: primary,
        max_tokens: 8,
        messages: [{ role: "user", content: "Reply with the single word: Namaskar" }],
      }),
      signal: AbortSignal.timeout(15000),
    });
    report.liveTest = { httpStatus: res.status, ok: res.ok };
    if (!res.ok) {
      report.liveTestBody = (await res.text()).slice(0, 400);
      const hints: Record<number, string> = {
        401: "Key invalid, revoked, or has a typo — create a new key at openrouter.ai and update the env var, then redeploy.",
        402: "OpenRouter account has no credits — top up ~$1, or set OPENROUTER_MODEL to a :free model.",
        404: "OPENROUTER_MODEL value is wrong — delete that env var to use the default openai/gpt-4o-mini.",
        429: "Rate limited by OpenRouter — try again in a minute.",
      };
      report.problem = hints[res.status] ?? `OpenRouter returned HTTP ${res.status}.`;
    } else {
      report.problem = null;
      report.note = "OpenRouter answered — if the widget still fails, the widget is hitting a different deployment/environment. Check the URL's environment vs where the env var is set.";
    }
  } catch (e) {
    report.liveTest = { error: String(e).slice(0, 240) };
    report.problem = "Network/timeout reaching OpenRouter from this deployment.";
  }

  return NextResponse.json(report);
}
