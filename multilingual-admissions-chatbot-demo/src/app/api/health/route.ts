import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  // Healthy without a database too — logging is an optional add-on.
  if (!process.env.DATABASE_URL) {
    return Response.json({ ok: true, db: false });
  }
  try {
    const { db } = await import("@/db");
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, db: true });
  } catch (e) {
    return Response.json(
      { ok: false, db: false, error: String(e).slice(0, 140) },
      { status: 500 }
    );
  }
}
