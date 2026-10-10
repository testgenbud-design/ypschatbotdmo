import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function maskPhone(p: string) {
  if (!p || p.length < 6) return "•••";
  return `${p.slice(0, 2)}••• ••${p.slice(-3)}`;
}

/**
 * Live counters for the admin page — real rows written by THIS prototype's
 * chat widget (kept clearly separate from the seeded SAMPLE data).
 */
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ available: false, reason: "DATABASE_URL not set" });
  }
  try {
    const [{ db }, { chatLogs, leads }, { desc, sql }] = await Promise.all([
      import("@/db"),
      import("@/db/schema"),
      import("drizzle-orm"),
    ]);

    const recent = await db
      .select({
        id: chatLogs.id,
        createdAt: chatLogs.createdAt,
        lang: chatLogs.lang,
        question: chatLogs.question,
        topScore: chatLogs.topScore,
        answered: chatLogs.answered,
        via: chatLogs.via,
      })
      .from(chatLogs)
      .orderBy(desc(chatLogs.createdAt))
      .limit(20);

    const stats = await db.execute(sql`
      select
        count(*)::int as total,
        count(*) filter (where answered)::int as answered,
        count(*) filter (where created_at::date = current_date)::int as today
      from chat_logs
    `);
    const langRows = await db.execute(sql`
      select lang, count(*)::int as n from chat_logs group by lang order by n desc
    `);
    const leadRows = await db
      .select({ name: leads.name, phone: leads.phone, interest: leads.interest, createdAt: leads.createdAt })
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(8);

    const row0 = (stats.rows?.[0] ?? {}) as Record<string, number>;
    return NextResponse.json({
      available: true,
      questions: {
        total: row0.total ?? 0,
        answered: row0.answered ?? 0,
        today: row0.today ?? 0,
        languages: (langRows.rows as unknown as { lang: string; n: number }[]) ?? [],
        recent: recent.map((r) => ({ ...r, question: r.question.slice(0, 140) })),
      },
      leads: leadRows.map((l) => ({ ...l, phone: maskPhone(l.phone) })),
    });
  } catch (e) {
    return NextResponse.json({ available: false, reason: "db error", detail: String(e).slice(0, 200) });
  }
}
