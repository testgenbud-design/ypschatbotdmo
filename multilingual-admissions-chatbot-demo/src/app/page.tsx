import Script from "next/script";

/* ---------- tiny inline icon set ---------- */
const I = {
  chat: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
  ),
  phone: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  ),
  mail: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  pin: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  grad: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  ),
  flask: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6M10 3v5.34a2 2 0 0 1-.135.73L4.4 19.32A2 2 0 0 0 6.22 22h11.56a2 2 0 0 0 1.82-2.68l-5.47-10.25a2 2 0 0 1-.13-.73V3z"/></svg>
  ),
  gear: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>
  ),
  brief: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  chip: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg>
  ),
  bus: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9H4V6z"/><path d="M4 15h16v3a1 1 0 0 1-1 1h-1a2 2 0 1 0-4 0H10a2 2 0 1 0-4 0H5a1 1 0 0 1-1-1v-3zM4 10h16"/></svg>
  ),
  headset: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z"/></svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  mic: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/></svg>
  ),
  office: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
  ),
};

const CHIPS: [string, string][] = [
  ["Admissions", "admissions"],
  ["Courses & intake", "courses"],
  ["Eligibility", "eligibility"],
  ["Fees", "fees"],
  ["Hostel & transport", "hostel"],
  ["Scholarships", "scholarships"],
  ["Placements", "placements"],
];

export default function Home() {
  return (
    <>
      {/* ---------- disclaimer strip ---------- */}
      <div className="disclaimer-strip">
        <div className="wrap">
          <span>
            <b>Prototype for Yashoda Technical Campus, Satara</b> · not an official college page
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span>Official site</span>
            <span className="dot" />
            <a href="https://www.yes.edu.in" target="_blank" rel="noreferrer">
              yes.edu.in ↗
            </a>
          </span>
        </div>
      </div>

      {/* ---------- header ---------- */}
      <header className="site-head">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Yashoda Technical Campus, Satara — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src="/assets/ytc-logo.png" alt="Yashoda Technical Campus logo" />
            <span className="brand-text">
              <span className="t1">Yashoda Technical Campus</span>
              <span className="t2">Wadhe, Satara · YSPM&apos;s YTC</span>
            </span>
          </a>
          <nav className="nav-links" aria-label="Sections">
            <a className="hide-m" href="#programmes">Programmes</a>
            <a className="hide-m" href="#assistant">Assistant</a>
            <a className="hide-m" href="#admissions">Admissions</a>
            <a className="hide-m" href="#contact">Contact</a>
            <a className="hide-m" href="/admin">Office&nbsp;demo&nbsp;↗</a>
            <button className="btn btn-orange" data-chat-open data-chat-topic="">{I.chat} Ask the assistant</button>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ---------- hero ---------- */}
        <section className="hero">
          <div className="hero-word" aria-hidden>यशोदा</div>
          <div className="wrap">
            <div>
              <span className="eyebrow"><span className="pulse" /> Admissions 2026–27 · Satara, Maharashtra</span>
              <h1>
                Admissions, answered in<br />
                <span className="dvn">आपल्या कुटुंबाच्या भाषेत.</span>
              </h1>
              <p className="hero-sub">
                Meet the <b>Yashoda assistant</b> — it answers the questions parents ask the office every admission
                season, instantly and politely, in <b>English, हिन्दी or मराठी</b>. Every answer comes only from the
                college&apos;s own information — and when the office should confirm something, the chat hands over
                to WhatsApp or a callback.
              </p>
              <div className="hero-ctas">
                <button className="btn btn-orange" data-chat-open data-chat-topic="">{I.chat} Start chatting</button>
                <a className="btn btn-ghost" href="#programmes">See programmes {I.arrow}</a>
              </div>
              <div className="chips-label">Ask about</div>
              <div className="chips">
                {CHIPS.map(([label, key]) => (
                  <button key={key} className="chip" data-chat-open data-chat-topic={key}>
                    <span className="cd" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/about.jpg" alt="Yashoda Technical Campus, Satara" fetchPriority="high" />
                <div className="hero-caption">YSPM&apos;s Yashoda Technical Campus · Wadhe, NH-4, Satara</div>
              </div>
              <div className="float-card a">
                <span className="ic">{I.headset}</span>
                <span>
                  English · हिन्दी · मराठी
                  <small>voice &amp; text, on any phone</small>
                </span>
              </div>
              <div className="float-card b">
                <span className="ic" style={{ background: "linear-gradient(135deg,#e15108,#ee8003)" }}>{I.shield}</span>
                <span>
                  Answers from college info only
                  <small>unsure → straight to the office</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- approvals ticker ---------- */}
        <div className="ticker" aria-label="Approvals and accreditations">
          <div className="ticker-track">
            {Array.from({ length: 2 }).map((_, dup) => (
              <span key={dup} aria-hidden={dup === 1}>
                <span className="star">◆</span>Autonomous Institute (UGC)<span className="star">◆</span>NAAC &apos;B+&apos; Accredited
                <span className="star">◆</span>NBA Accredited Programmes<span className="star">◆</span>Approved by AICTE, New Delhi
                <span className="star">◆</span>PCI, New Delhi<span className="star">◆</span>DBATU, Lonere
                <span className="star">◆</span>Shivaji University, Kolhapur<span className="star">◆</span>MSBTE, Mumbai
                <span className="star">◆</span>DTE, Maharashtra<span className="star">◆</span>Est. 2009 · YSPM&apos;s YTC&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ---------- programmes ---------- */}
        <section className="section" id="programmes">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">Programmes @ Yashoda</span>
              <h2>One campus at Wadhe, every technical ladder</h2>
              <p>
                From diploma after 10th to post-graduate degrees — the Faculties of Engineering, Polytechnic,
                Pharmacy, MBA and MCA sit together on the green campus near Satara. Intake figures are as published
                by the campus.
              </p>
            </div>
            <div className="prog-grid">
              <article className="prog-card reveal">
                <div className="prog-ic">{I.grad}</div>
                <h3>Faculty of Engineering</h3>
                <ul>
                  <li>Computer Science &amp; Engg <b>180</b></li>
                  <li>AI &amp; Data Science · E&amp;TC · Cyber Security <b>120 each</b></li>
                  <li>Robotics &amp; AI · Cloud Computing <b>60 each</b></li>
                  <li>Electrical <b>60</b> · Civil · Mech · Mechatronics <b>30 each</b></li>
                  <li>M.Tech — Mech <b>12</b> · CSE <b>18</b> · EV Tech <b>18</b></li>
                </ul>
                <div className="affil">B.Tech / M.Tech · DBATU, Lonere · CSE &amp; Electrical NBA · engg.yes.edu.in</div>
              </article>
              <article className="prog-card reveal">
                <div className="prog-ic">{I.flask}</div>
                <h3>Faculty of Pharmacy</h3>
                <ul>
                  <li>D.Pharmacy (after 10th) <b>60</b></li>
                  <li>B.Pharmacy <b>100 + 100</b></li>
                  <li>Pharm D <b>30</b></li>
                  <li>M.Pharm — Pharmaceutics <b>15</b> · Pharmacology <b>9</b></li>
                  <li>M.Pharm — Pharma Chemistry <b>15</b> · Regulatory Affairs <b>15</b></li>
                </ul>
                <div className="affil">PCI-approved · D.Pharm: MSBTE · B/M.Pharm, Pharm D: DBATU · pharma.yes.edu.in</div>
              </article>
              <article className="prog-card reveal">
                <div className="prog-ic">{I.gear}</div>
                <h3>Faculty of Polytechnic</h3>
                <ul>
                  <li>Computer Engineering <b>90</b></li>
                  <li>Civil · Mech · Electrical · E&amp;TC <b>60 each</b></li>
                  <li>AI &amp; Machine Learning <b>60</b></li>
                  <li>Automation &amp; Robotics · Instrumentation <b>60 each</b></li>
                  <li>After SSC · direct 2nd-year B.Tech route</li>
                </ul>
                <div className="affil">Diploma · MSBTE, Mumbai · poly.yes.edu.in</div>
              </article>
              <article className="prog-card reveal">
                <div className="prog-ic">{I.brief}</div>
                <h3>Faculty of MBA</h3>
                <ul>
                  <li>Master of Business Administration <b>120</b></li>
                  <li>Since 2011 · NAAC-accredited campus</li>
                  <li>Admission via MAH-MBA/MMS-CET (CAP)</li>
                  <li>T360 professional development programme</li>
                </ul>
                <div className="affil">Shivaji University, Kolhapur · mba.yes.edu.in</div>
              </article>
              <article className="prog-card reveal">
                <div className="prog-ic">{I.chip}</div>
                <h3>Faculty of MCA</h3>
                <ul>
                  <li>Master in Computer Application <b>180</b></li>
                  <li>Since 2011 · NAAC &amp; NBA accredited</li>
                  <li>Admission via MAH-MCA-CET (CAP)</li>
                  <li>BBA &amp; BCA faculties also on campus</li>
                </ul>
                <div className="affil">Shivaji University, Kolhapur · mca.yes.edu.in</div>
              </article>
              <article className="prog-card reveal">
                <div className="prog-ic">{I.office}</div>
                <h3>Sister institutes</h3>
                <ul>
                  <li>Yashoda College of Architecture <b>ycoa.org.in</b></li>
                  <li>Yashoda College of Pharmacy <b>ycop.edu.in</b></li>
                  <li>BBA / BCA faculties <b>bba · bca.yes.edu.in</b></li>
                  <li>Certification courses on campus</li>
                </ul>
                <div className="affil">Yashoda Shikshan Prasarak Mandal, Satara</div>
              </article>
            </div>
          </div>
        </section>

        {/* ---------- how the assistant works ---------- */}
        <section className="section tint" id="assistant">
          <div className="wrap">
            <div className="how-grid">
              <div className="reveal">
                <div className="section-head" style={{ marginBottom: 18 }}>
                  <span className="kicker">The Yashoda assistant</span>
                  <h2>Built like a senior counsellor, careful like the registrar</h2>
                  <p>
                    The assistant answers only from the college&apos;s own pages and brochure text. When it is not
                    confident, it does not bluff — it hands the family to the office, with the conversation
                    summary already typed into WhatsApp.
                  </p>
                </div>
                <div className="how-steps">
                  <div className="how-step">
                    <div className="n">१</div>
                    <div>
                      <h4>Parents ask in their own language</h4>
                      <p>Voice or text — English, हिन्दी, मराठी or Hinglish, straight from a phone keyboard or the mic button.</p>
                    </div>
                  </div>
                  <div className="how-step">
                    <div className="n">२</div>
                    <div>
                      <h4>Answers come from college information only</h4>
                      <p>Courses, intake, process, hostels, transport, scholarships — retrieved from the campus&apos;s published text. No invented fees, marks or dates, ever.</p>
                    </div>
                  </div>
                  <div className="how-step">
                    <div className="n">३</div>
                    <div>
                      <h4>The office stays in the loop</h4>
                      <p>Low-confidence questions route to WhatsApp with a summary, families can request a callback, and every question is logged for the office dashboard.</p>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 22 }}>
                  <button className="btn btn-navy" data-chat-open data-chat-topic="">{I.chat} Try it live</button>
                </div>
              </div>
              <div className="mock-chat reveal" aria-hidden>
                <div className="mock-head">
                  <span className="avatar">य</span>
                  <div className="mt">
                    <b>Yashoda Assistant</b>
                    <small>Admissions · Satara</small>
                  </div>
                  <div className="langs"><span>EN</span><span className="on">मराठी</span><span>हिंदी</span></div>
                </div>
                <div className="mock-body">
                  <div className="mb user">मुलींसाठी वसतिगृह आहे का? आणि बस सुविधा मोठ्यापासून... म्हणजे कराडहून मिळते का?</div>
                  <div className="mb bot">
                    नक्की! कॅम्पसमध्येच मुलींसाठी सुरक्षित वसतिगृह आहे — ३५० जागा, जेवण व निवास फीमध्ये समाविष्ट. बस सुविधा
                    सातारा जिल्ह्यातून चालते; कराडहूनचा रूट ट्रान्सपोर्ट ऑफिस कन्फर्म करेल. पुढील पायरी: ऍडमिशन
                    कन्फर्म झाल्यावर हॉस्टेल ऑफिसमध्ये जागा बुक करा — कौटुंबीक यजमानपद? आम्ही WhatsApp वर जोडू का?
                    <span className="src">Source: Hostel &amp; transport page · confidence 0.34</span>
                  </div>
                  <div className="mb user">फी किती आहे B.Tech ची?</div>
                  <div className="mb bot">
                    फी दरवर्षी Fees Regulating Authority (FRA) मंजूर करते, त्यामुळे मी आकडा अंदाजाने सांगत नाही —
                    नेमकी रक्कम yes.edu.in च्या FRA fee page वर आहे, किंवा ऑफिस +91 91722 20775 वर सांगेल.
                    <span className="src">Source: FRA fee page · never invents numbers</span>
                  </div>
                </div>
                <div className="mock-since">Actual replies from this prototype — try your own ↓</div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- campus ---------- */}
        <section className="section" id="campus">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">The campus at Wadhe</span>
              <h2>Green, clean, and made for studying</h2>
              <p>
                One self-contained campus on NH-4, about 8–9 km from Satara bus stand — hostels inside the
                campus, buses from across the district, and everything a student needs day to day.
              </p>
            </div>
            <div className="campus-grid reveal">
              <figure className="campus-tile big">{/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/library.jpg" alt="Central library" loading="lazy" /><span>Central library</span>
              </figure>
              <figure className="campus-tile">{/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/labs.jpg" alt="Laboratories" loading="lazy" /><span>Laboratories</span>
              </figure>
              <figure className="campus-tile">{/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/classroom.jpg" alt="Smart classrooms" loading="lazy" /><span>Classrooms</span>
              </figure>
              <figure className="campus-tile">{/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/girls-hostel.jpg" alt="Girls hostel" loading="lazy" /><span>Girls hostel · 350</span>
              </figure>
              <figure className="campus-tile">{/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/auditorium.jpg" alt="Auditorium" loading="lazy" /><span>Auditorium</span>
              </figure>
              <figure className="campus-tile big">{/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/campus-yspm.png" alt="Campus aerial view" loading="lazy" /><span>The green campus</span>
              </figure>
              <figure className="campus-tile">{/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/transport.jpg" alt="College buses" loading="lazy" /><span>Buses across the district</span>
              </figure>
              <figure className="campus-tile">{/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/sports.jpg" alt="Sports grounds" loading="lazy" /><span>Sports &amp; gymkhana</span>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------- admissions ---------- */}
        <section className="section tint" id="admissions">
          <div className="wrap">
            <div className="adm-grid">
              <div className="reveal">
                <div className="section-head" style={{ marginBottom: 22 }}>
                  <span className="kicker">Admissions 2026–27</span>
                  <h2>Here&apos;s how it works at Yashoda</h2>
                  <p>Four calm steps from “बेटा, कुठे घ्यायचंय admission?” to the first day at Wadhe.</p>
                </div>
                <div className="timeline">
                  <div className="tl-item">
                    <div className="tl-n">1</div>
                    <div>
                      <h4>Entrance &amp; CAP rounds</h4>
                      <p>Most seats fill through the Maharashtra State CET Cell&apos;s CAP — MHT-CET for B.Tech, MAH-MBA/MCA-CET for post-graduate, centralised process for polytechnic and pharmacy. Schedules publish on cetcell.mahacet.org.</p>
                    </div>
                  </div>
                  <div className="tl-item">
                    <div className="tl-n">2</div>
                    <div>
                      <h4>Documents ready, in one folder</h4>
                      <p>Marksheets, CET scorecard, leaving certificate, domicile and category certificates — the list on this page is what the office checks first at reporting time.</p>
                    </div>
                  </div>
                  <div className="tl-item">
                    <div className="tl-n">3</div>
                    <div>
                      <h4>Confirm at the campus — or ask about institute-level seats</h4>
                      <p>After allotment, confirm admission at the Wadhe campus. Seats vacant after CAP are filled at institute level as per the year&apos;s rules — call the office to check your branch.</p>
                    </div>
                  </div>
                  <div className="tl-item">
                    <div className="tl-n">4</div>
                    <div>
                      <h4>Hostel, bus, scholarship desk</h4>
                      <p>Book hostel seats, confirm bus routes, and file MahaDBT/EBC/scholarship applications with the campus desk — induction (Arambh) welcomes new students.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="reveal">
                <div className="fees-note">
                  <h4>{I.wallet} About fees — the honest answer</h4>
                  <p>
                    Fees are approved every year by the <b>Fees Regulating Authority (FRA)</b>, Government of
                    Maharashtra, and differ by programme. The assistant never quotes a number — the current
                    structure is always on the official fee page.
                  </p>
                  <a className="btn btn-ghost" href="https://www.yes.edu.in/fra-fee-approved" target="_blank" rel="noreferrer">
                    FRA fee page ↗
                  </a>{" "}
                  <a className="btn btn-ghost" href="https://engg.yes.edu.in/engineering-fee-structures" target="_blank" rel="noreferrer">
                    Engineering fees ↗
                  </a>
                </div>
                <div className="doc-list">
                  <h4>Keep these documents ready</h4>
                  <ul>
                    <li>SSC &amp; HSC marksheets (or diploma marksheets for direct 2nd-year / PG)</li>
                    <li>CET scorecard — MHT-CET / MAH-MBA-CET / MAH-MCA-CET as applicable</li>
                    <li>Leaving certificate (LC/TC), domicile &amp; nationality proof</li>
                    <li>Caste certificate + validity, non-creamy layer — where applicable</li>
                    <li>Income certificate (for EBC / TFWS / scholarships), Aadhaar, photos, gap affidavit if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- stats ---------- */}
        <section className="stats">
          <div className="wrap">
            <div className="stat"><div className="v"><span data-count="2009">0</span></div><div className="k">Established by YSPM</div></div>
            <div className="stat"><div className="v"><span data-count="5000">0</span><span>+</span></div><div className="k">Students on campus</div></div>
            <div className="stat"><div className="v"><span data-count="200">0</span><span>+</span></div><div className="k">Staff members</div></div>
            <div className="stat"><div className="v"><span data-count="300">0</span><span>+</span></div><div className="k">Industry connects</div></div>
          </div>
        </section>

        {/* ---------- placements note ---------- */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">Training &amp; placement cell</span>
              <h2>Campus interviews, honest numbers</h2>
              <p>The placement cell trains and connects — figures below are as published by the campus, not promises.</p>
            </div>
            <div className="place-strip">
              <div className="place-card reveal">
                <h4>{I.brief} What the campus publishes</h4>
                <p>Campus interviews and industrial exposure across faculties — with companies and alumni outcomes listed on the college website.</p>
                <div className="nums">
                  <div><b>105</b><small>companies visiting</small></div>
                  <div><b>2,033</b><small>students placed (published)</small></div>
                  <div><b>22 / 4 LPA</b><small>highest / average package</small></div>
                </div>
              </div>
              <div className="place-card reveal">
                <h4>{I.shield} What the assistant will never say</h4>
                <p>
                  No “100% job” promises, no invented packages, no last year&apos;s cut-offs passed off as this
                  year&apos;s. Placement questions get the published figures — and families who want the latest
                  year&apos;s summary are guided to the placement cell directly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band reveal">
              <div>
                <h2>आजच विचारा — <span className="dvn">your language, your question.</span></h2>
                <p>
                  Ask about courses, intake, eligibility, fees, hostels, buses, scholarships or placements.
                  Type it or say it — the assistant answers from the college&apos;s own information, and the
                  office is one tap away when something needs confirming.
                </p>
                <div className="cta-actions">
                  <button className="btn btn-white" data-chat-open data-chat-topic="">{I.chat} Open the assistant</button>
                  <a className="btn btn-outline" href="https://wa.me/91917220775?text=Hello%2C%20I%20got%20your%20number%20from%20the%20admissions%20assistant%20demo%20for%20YTC%20Satara." target="_blank" rel="noreferrer">
                    {I.phone} WhatsApp the office
                  </a>
                </div>
              </div>
              <div className="contact-card" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", color: "#fff", boxShadow: "none" }}>
                <div className="contact-row" style={{ borderColor: "rgba(255,255,255,0.16)" }}>
                  <span className="ic" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>{I.phone}</span>
                  <span><b style={{ color: "#f6d9a8" }}>Admission office</b>
                    <a href="tel:+919172220775" style={{ color: "#fff" }}>+91 91722 20775</a> · phone &amp; WhatsApp
                  </span>
                </div>
                <div className="contact-row" style={{ borderColor: "rgba(255,255,255,0.16)" }}>
                  <span className="ic" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>{I.mail}</span>
                  <span><b style={{ color: "#f6d9a8" }}>Email</b>
                    <a href="mailto:yspmadmin@yes.edu.in" style={{ color: "#fff" }}>yspmadmin@yes.edu.in</a>
                  </span>
                </div>
                <div className="contact-row" style={{ borderColor: "transparent" }}>
                  <span className="ic" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>{I.pin}</span>
                  <span><b style={{ color: "#f6d9a8" }}>Visit</b>
                    <span style={{ color: "rgba(255,255,255,0.9)" }}>Wadhe, NH-4 (Pune side), Satara — 8–9 km from the bus stand</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="footer" id="contact">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/ytc-logo.png" alt="YTC logo" />
              <div>
                <h5>Yashoda Technical Campus, Satara</h5>
                <p>
                  YSPM&apos;s YTC, Wadhe, NH-4, Satara, Maharashtra. An autonomous institute, NAAC &apos;B+&apos; and
                  NBA accredited, established 2009.
                </p>
              </div>
            </div>
            <div>
              <h5>Campus sites</h5>
              <ul>
                <li><a href="https://www.yes.edu.in" target="_blank" rel="noreferrer">yes.edu.in — main ↗</a></li>
                <li><a href="https://engg.yes.edu.in" target="_blank" rel="noreferrer">Engineering ↗</a></li>
                <li><a href="https://pharma.yes.edu.in" target="_blank" rel="noreferrer">Pharmacy ↗</a></li>
                <li><a href="https://poly.yes.edu.in" target="_blank" rel="noreferrer">Polytechnic ↗</a></li>
                <li><a href="https://mba.yes.edu.in" target="_blank" rel="noreferrer">MBA ↗</a> · <a href="https://mca.yes.edu.in" target="_blank" rel="noreferrer">MCA ↗</a></li>
              </ul>
            </div>
            <div>
              <h5>Official links</h5>
              <ul>
                <li><a href="https://www.yes.edu.in/fra-fee-approved" target="_blank" rel="noreferrer">FRA-approved fees ↗</a></li>
                <li><a href="https://cetcell.mahacet.org" target="_blank" rel="noreferrer">Maharashtra CET Cell ↗</a></li>
                <li><a href="https://mahadbtmahait.gov.in" target="_blank" rel="noreferrer">MahaDBT scholarships ↗</a></li>
                <li><a href="https://www.antiragging.in" target="_blank" rel="noreferrer">Anti-ragging ↗</a></li>
                <li><a href="/admin">Admissions office dashboard (sample) ↗</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-note">
            <span>Prototype for Yashoda Technical Campus, Satara · not an official college page. Logo, photos and facts are the college&apos;s own, compiled from yes.edu.in for this demo.</span>
            <span>Made to show the registrar what instant, multilingual admissions support feels like.</span>
          </div>
        </div>
      </footer>

      <Script src="/widget.js" strategy="afterInteractive" />
      <Script src="/assets/site.js" strategy="afterInteractive" />
    </>
  );
}
