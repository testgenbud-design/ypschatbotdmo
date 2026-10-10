import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 6;
const buckets = new Map<string, { count: number; reset: number }>();

function rateOk(key: string) {
  const now = Date.now();
  if (buckets.size > 5000) buckets.clear();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  b.count += 1;
  return b.count <= RATE_MAX;
}

const STR: Record<string, { ok: string; bad: string; error: string }> = {
  en: {
    ok: "Thank you! The Yashoda admission office has your details and will call you back. Keep your marksheets handy meanwhile.",
    bad: "Please check the name and mobile number — the number should be a 10-digit Indian mobile.",
    error: "Could not save the request right now — please reach the office on WhatsApp instead.",
  },
  hi: {
    ok: "धन्यवाद! यशोदा एडमिशन ऑफिस के पास आपकी जानकारी पहुँच गई है, ऑफिस आपको कॉल करेगा। तब तक अपनी मार्कशीट तैयार रखें।",
    bad: "कृपया नाम और मोबाइल नंबर जाँच लें — 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",
    error: "अभी रिक्वेस्ट सेव नहीं हो पाई — कृपया WhatsApp पर ऑफिस से संपर्क करें।",
  },
  mr: {
    ok: "धन्यवाद! यशोदा ऍडमिशन ऑफिसकडे तुमची माहिती पोहोचली आहे, ऑफिस तुम्हाला कॉल करेल. तोपर्यंत मार्कशीट जवळ ठेवा.",
    bad: "कृपया नाव व मोबाइल नंबर तपासा — १० अंकी भारतीय मोबाइल नंबर टाका.",
    error: "आत्ता विनंती जतन झाली नाही — कृपया WhatsApp वर ऑफिसशी संपर्क साधा.",
  },
};

export async function POST(req: NextRequest) {
  let body: { name?: unknown; phone?: unknown; interest?: unknown; consent?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  if (!rateOk(`cb:${ip}`)) {
    return NextResponse.json({ ok: false, error: "rate limited" }, { status: 429 });
  }

  const langRaw = String(body.lang ?? "en").toLowerCase();
  const lang: "en" | "hi" | "mr" = langRaw === "hi" ? "hi" : langRaw === "mr" ? "mr" : "en";

  const name = String(body.name ?? "").replace(/[\u0000-\u001F<>]/g, "").trim().slice(0, 80);
  const interest = String(body.interest ?? "").replace(/[\u0000-\u001F<>]/g, "").trim().slice(0, 80);
  let phone = String(body.phone ?? "").replace(/[^\d]/g, "");
  if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);
  if (phone.length === 11 && phone.startsWith("0")) phone = phone.slice(1);
  const consent = body.consent === true;

  if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone) || !interest || !consent) {
    return NextResponse.json({ ok: false, reply: STR[lang].bad }, { status: 422 });
  }

  try {
    if (process.env.DATABASE_URL) {
      const [{ db }, { leads }] = await Promise.all([import("@/db"), import("@/db/schema")]);
      await db.insert(leads).values({ name, phone, interest, consent, source: "widget" });
    } else {
      console.log("[callback] lead (no DB configured):", { name, phone, interest });
    }
    return NextResponse.json({ ok: true, reply: STR[lang].ok });
  } catch {
    return NextResponse.json({ ok: false, reply: STR[lang].error }, { status: 500 });
  }
}
