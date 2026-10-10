"use client";

import { useEffect, useState } from "react";

/* =====================================================================
   SAMPLE dashboard for the registrar — every figure on this page is
   seeded sample data, except the clearly marked LIVE strip at the
   bottom, which reflects this prototype's real chat logs.
   ===================================================================== */

const DAYS = [
  { d: "Mon", v: 18, wk: false }, { d: "Tue", v: 24, wk: false }, { d: "Wed", v: 21, wk: false },
  { d: "Thu", v: 30, wk: false }, { d: "Fri", v: 27, wk: false }, { d: "Sat", v: 33, wk: true }, { d: "Sun", v: 29, wk: true },
  { d: "Mon", v: 36, wk: false }, { d: "Tue", v: 41, wk: false }, { d: "Wed", v: 34, wk: false }, { d: "Thu", v: 28, wk: false },
  { d: "Fri", v: 31, wk: false }, { d: "Sat", v: 38, wk: true }, { d: "Sun", v: 41, wk: true },
];

const TOPICS: [string, number][] = [
  ["Fees & fee structure", 28],
  ["Admission process / CAP", 22],
  ["Eligibility & documents", 14],
  ["Hostel & mess", 11],
  ["Placements & package", 9],
  ["Scholarships / EBC", 8],
  ["Courses & intake", 8],
];

const LANGS = [
  { k: "मराठी Marathi", v: 38, c: "#5b3a9e" },
  { k: "English", v: 26, c: "#0f4c81" },
  { k: "हिन्दी Hindi", v: 24, c: "#ea9c30" },
  { k: "Hinglish", v: 12, c: "#e15108" },
];

const UNANSWERED = [
  { q: "Civil & Environmental (IL) branchची फी स्वतःची आहे का?", lang: "mr", n: 6, act: "Confirm fee page" },
  { q: ".Hostel mess timing kay aahe Sunday la", lang: "hi", n: 4, act: "Add mess timings" },
  { q: "Is TFWS applicable for direct second year?", lang: "en", n: 3, act: "Add DSY rules" },
  { q: "एकात्मिक प्रवेशानंतर branch change होते का?", lang: "mr", n: 3, act: "Office policy line" },
  { q: "Bus route from Wai side — stops list?", lang: "en", n: 2, act: "Add bus routes" },
];

const LEADS = [
  { n: "Priya Jadhav", ph: "98••• ••210", in: "B.Tech — CSE", t: "12 min ago" },
  { n: "Rahul Shinde", ph: "90••• ••442", in: "D.Pharmacy", t: "1 h ago" },
  { n: "Sneha Patil", ph: "93••• ••887", in: "MBA", t: "2 h ago" },
  { n: "Amit Bhosale", ph: "96••• ••154", in: "Polytechnic — Comp", t: "4 h ago" },
  { n: "Kunal Mane", ph: "91••• ••730", in: "B.Tech — Robotics & AI", t: "Yesterday" },
];

type Live = {
  available: boolean;
  questions?: {
    total: number; answered: number; today: number;
    languages: { lang: string; n: number }[];
    recent: { id: number; createdAt: string; lang: string; question: string; topScore: number; answered: boolean; via: string }[];
  };
  leads?: { name: string; phone: string; interest: string; createdAt: string }[];
};

function Donut() {
  const R = 54;
  const C = 2 * Math.PI * R;
  let off = 0;
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label="Languages share">
      <circle cx="75" cy="75" r={R} fill="none" stroke="#f0e9da" strokeWidth="20" />
      {LANGS.map((s) => {
        const len = (s.v / 100) * C - 3;
        const el = (
          <circle
            key={s.k} cx="75" cy="75" r={R} fill="none" stroke={s.c} strokeWidth="20"
            strokeDasharray={`${Math.max(0, len)} ${C}`} strokeDashoffset={-off}
            transform="rotate(-90 75 75)" strokeLinecap="butt"
          />
        );
        off += (s.v / 100) * C;
        return el;
      })}
      <text x="75" y="71" textAnchor="middle" fontSize="21" fontWeight="800" fill="#212331">4</text>
      <text x="75" y="90" textAnchor="middle" fontSize="10.5" fill="#6d7289">languages</text>
    </svg>
  );
}

export default function Admin() {
  const [live, setLive] = useState<Live | null>(null);
  useEffect(() => {
    fetch("/api/admin/live")
      .then((r) => r.json())
      .then(setLive)
      .catch(() => setLive({ available: false }));
  }, []);

  return (
    <>
      <div className="disclaimer-strip">
        <div className="wrap">
          <span><b>Prototype for Yashoda Technical Campus, Satara</b> · not an official college page</span>
          <span><a href="/">← Back to the admissions page</a></span>
        </div>
      </div>

      <section className="admin-hero">
        <div className="wrap">
          <span className="sample-flag">⚠ Sample data — illustration only</span>
          <h1>Admissions Office — Assistant Analytics</h1>
          <p>
            What the registrar would see: what parents ask, in which language, what the assistant could not
            answer, and who asked for a callback. Every card on this page is seeded <b>sample</b> data —
            only the green <b>“live”</b> strip below reflects real questions asked to this prototype.
          </p>
        </div>
      </section>

      <div className="watermark" aria-hidden><span>SAMPLE</span></div>

      <main className="admin-main">
        <div className="wrap">
          {/* KPIs */}
          <div className="kpi-grid">
            <div className="kpi" data-sample="SAMPLE"><div className="k">Questions today</div><div className="v">41</div><div className="d">▲ 18% vs yesterday</div></div>
            <div className="kpi" data-sample="SAMPLE"><div className="k">Answered without office</div><div className="v">86<small>%</small></div><div className="d">▲ 4 pts this week</div></div>
            <div className="kpi" data-sample="SAMPLE"><div className="k">Median first reply</div><div className="v">2.1<small> s</small></div><div className="d flat">was ~2 days on WhatsApp</div></div>
            <div className="kpi" data-sample="SAMPLE"><div className="k">New leads today</div><div className="v">6</div><div className="d">3 asked in मराठी</div></div>
          </div>

          <div className="grid-2-1">
            <div className="panel">
              <h3>Questions per day — last 14 days</h3>
              <div className="sub">SAMPLE · includes weekends (orange) when parents are free to call</div>
              <div className="bars">
                {DAYS.map((d, i) => (
                  <div className={`bar ${d.wk ? "" : "wk"}`} key={i}>
                    <b>{d.v}</b>
                    <i style={{ height: `${(d.v / 45) * 100}%` }} />
                    <span>{d.d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <h3>Languages parents used</h3>
              <div className="sub">SAMPLE · why the assistant speaks all four</div>
              <div className="donut-wrap">
                <Donut />
                <div className="legend">
                  {LANGS.map((s) => (
                    <div className="lg" key={s.k}><span className="sw" style={{ background: s.c }} />{s.k}<b>{s.v}%</b></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid-1-1">
            <div className="panel">
              <h3>Top topics this week</h3>
              <div className="sub">SAMPLE · the office now knows what to publish next</div>
              <div className="topics">
                {TOPICS.map(([t, v]) => (
                  <div className="topic" key={t}>
                    <span>{t}</span>
                    <span className="track"><span className="fill" style={{ width: `${v}%`, display: "block" }} /></span>
                    <b>{v}%</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <h3>Unanswered questions queue</h3>
              <div className="sub">SAMPLE · every one of these reached the office via WhatsApp already</div>
              <table className="data">
                <thead><tr><th>Question parents asked</th><th>Lang</th><th>×</th><th>Suggested fix</th></tr></thead>
                <tbody>
                  {UNANSWERED.map((u, i) => (
                    <tr key={i}>
                      <td className="q">{u.q}</td>
                      <td><span className={`pill ${u.lang}`}>{u.lang.toUpperCase()}</span></td>
                      <td>{u.n}</td>
                      <td><span className="pill act">{u.act}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid-1-1">
            <div className="panel">
              <h3>Callback leads — newest first</h3>
              <div className="sub">SAMPLE · phones shown masked in the demo</div>
              <table className="data">
                <thead><tr><th>Name</th><th>Phone</th><th>Interested in</th><th>Consent</th><th>When</th></tr></thead>
                <tbody>
                  {LEADS.map((l, i) => (
                    <tr key={i}>
                      <td className="q">{l.n}</td>
                      <td style={{ fontFeatureSettings: "tnum" }}>{l.ph}</td>
                      <td>{l.in}</td>
                      <td><span className="pill ok">✓ given</span></td>
                      <td>{l.t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="panel">
              <h3>Handled without the office touching it</h3>
              <div className="sub">SAMPLE · what “answered” looked like this week</div>
              <table className="data">
                <thead><tr><th>Typical question</th><th>Lang</th><th>Outcome</th></tr></thead>
                <tbody>
                  {[
                    { q: "मुलींसाठी वसतिगृह आहे का? capacity किती?", l: "mr", o: "Answered from hostel info" },
                    { q: "B.Tech CSE intake aur choice code kya hai?", l: "hi", o: "Answered from courses page" },
                    { q: "What documents for CAP reporting?", l: "en", o: "Answered + document list sent" },
                    { q: "फी किती? — fee structure link द्या", l: "mr", o: "FRA link shared (no numbers)" },
                    { q: "Bus facility from Karad side?", l: "en", o: "Answered + office confirm offered" },
                  ].map((r, i) => (
                    <tr key={i}><td className="q">{r.q}</td><td><span className={`pill ${r.l}`}>{r.l.toUpperCase()}</span></td><td>{r.o}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LIVE strip */}
          <div className="live-band">
            <h3><span className="live-dot" /> Live from THIS prototype (not sample)</h3>
            <div className="sub">
              Real rows from the chat widget on the home page — question text, language, retrieval confidence,
              answered/handoff. Ask a few questions there and refresh.
            </div>
            {!live && <p style={{ color: "#6d7289", fontSize: 13.5 }}>Loading live data…</p>}
            {live && !live.available && (
              <p style={{ color: "#6d7289", fontSize: 13.5 }}>
                No live data yet (or database not connected in this environment). Open the assistant on the
                home page, ask something, and come back — on the deployed build, rows appear here in real time.
              </p>
            )}
            {live && live.available && live.questions && (
              <>
                <div className="live-kpis">
                  <div><b>{live.questions.total}</b><small>questions logged</small></div>
                  <div><b>{live.questions.answered}</b><small>answered by assistant</small></div>
                  <div><b>{live.questions.recent.filter((r) => r.via === "instant").length}</b><small>instant (no AI cost)</small></div>
                  <div><b>{live.questions.recent.filter((r) => r.via === "llm").length}</b><small>needed the AI model</small></div>
                  <div><b>{live.questions.today}</b><small>today</small></div>
                  <div><b>{(live.leads ?? []).length}</b><small>real callbacks</small></div>
                  {live.questions.languages.map((l) => (
                    <div key={l.lang}><b>{l.n}</b><small>asked in {l.lang === "mr" ? "मराठी" : l.lang === "hi" ? "हिन्दी" : "English"}</small></div>
                  ))}
                </div>
                <table className="data">
                  <thead><tr><th>When</th><th>Lang</th><th>Question (first 140 chars)</th><th>Score</th><th>Via</th></tr></thead>
                  <tbody>
                    {live.questions.recent.map((r) => (
                      <tr key={r.id}>
                        <td style={{ whiteSpace: "nowrap" }}>{new Date(r.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                        <td><span className={`pill ${r.lang}`}>{r.lang.toUpperCase()}</span></td>
                        <td className="q">{r.question}</td>
                        <td style={{ fontFeatureSettings: "tnum" }}>{r.topScore.toFixed(3)}</td>
                        <td><span className={`pill ${r.via === "instant" ? "act" : r.answered ? "ok" : "warn"}`}>{r.via}</span></td>
                      </tr>
                    ))}
                    {live.questions.recent.length === 0 && (
                      <tr><td colSpan={5}>No questions logged yet — try the widget on the home page.</td></tr>
                    )}
                  </tbody>
                </table>
                {live.leads && live.leads.length > 0 && (
                  <>
                    <h3 style={{ margin: "20px 0 4px", color: "#0f5c3c", fontSize: 15 }}>Callback leads captured (real, latest 8)</h3>
                    <div className="sub">Phones masked in this demo view · full numbers live in the database</div>
                    <table className="data">
                      <thead><tr><th>Name</th><th>Phone</th><th>Interested in</th><th>When</th></tr></thead>
                      <tbody>
                        {live.leads.map((l, i) => (
                          <tr key={i}>
                            <td className="q">{l.name}</td>
                            <td style={{ fontFeatureSettings: "tnum" }}>{l.phone}</td>
                            <td>{l.interest}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{new Date(l.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </>
            )}
          </div>

          <div className="admin-note">
            <h3>How the office uses this view</h3>
            <p>
              The same parents who today type into the college&apos;s WhatsApp and wait for office hours get an
              instant, careful answer — in मराठी, हिन्दी, English or Hinglish. The office does not lose the
              relationship: <b>every question is logged</b>, unsure questions arrive on WhatsApp with the chat
              summary attached, and callback requests land here with consent recorded. The unanswered queue
              tells the registrar exactly which detail to publish next. Nothing on this screen replaces the
              office — it gives the office its mornings back.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
