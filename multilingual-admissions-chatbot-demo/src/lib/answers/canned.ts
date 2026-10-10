import { tokenize, expandTokens } from "@/lib/retrieval/embedder.mjs";

/**
 * Canned answer book for Yashoda Technical Campus, Satara.
 *
 * These are the questions the admission office answers every single day.
 * They are pre-written here — approved wording, all three languages — so the
 * assistant replies instantly, at zero cost, with no chance of the model
 * rephrasing a fact. The LLM is only called when nothing here matches.
 *
 * House rules kept inside every answer:
 *  · never a fee amount — FRA page only
 *  · never a cut-off, mark or date
 *  · never "100% job"
 *  · end with the natural next step (documents, or whom to call)
 */

export type Lang = "en" | "hi" | "mr";

export interface CannedAnswer {
  id: string;
  /** concept groups that must ALL be present for this entry to apply */
  required: string[][];
  /** extra groups that make this entry a better (more specific) fit */
  boost?: string[][];
  /** tie-break weight when two entries match equally */
  priority?: number;
  source: { title: string; heading: string; url: string };
  answers: Record<Lang, string>;
}

const SITE = "https://www.yes.edu.in";
const PHONE = "+91 91722 20775";

/* ---------------- concept groups (multilingual) ---------------- */
const G = {
  fee: ["fee", "fees", "फी", "फीस", "शुल्क", "cost", "kitni", "kitna", "किती", "कितनी", "structure", "फीची", "charges", "payment", "भरावी"],
  admission: ["admission", "admissions", "प्रवेश", "दाखिला", "एडमिशन", "ऍडमिशन", "process", "प्रक्रिया", "procedure", "apply", "अर्ज", "form", "फॉर्म", "cap", "भरती"],
  eligibility: ["eligibility", "eligible", "पात्रता", "criteria", "qualification", "qualify", "requirement", "लागते"],
  course: ["course", "courses", "अभ्यासक्रम", "कोर्स", "branch", "branches", "ब्रांच", "programme", "program", "intake", "जागा", "seats", "seat", "सीटें", "सीट", "क्षमता", "capacity", "offered", "विभाग", "department"],
  hostel: ["hostel", "hostels", "वसतिगृह", "हॉस्टेल", "छात्रावास", "accommodation", "होस्टेल", "राहणे", "rehne", "stay", "वसतिगृहात"],
  girls: ["girls", "girl", "मुली", "मुलींसाठी", "मुलींचे", "मुलींना", "ladies", "लडकियों", "daughter", "मुलगी"],
  mess: ["mess", "मेस", "food", "जेवण", "dining", "canteen", "meals", "khana", "खाना", "भोजन", "जेवायला"],
  transport: ["bus", "बस", "buses", "transport", "वाहतूक", "transportation", "travel", "pickup", "route", "रूट"],
  scholarship: ["scholarship", "scholarships", "शिष्यवृत्ती", "छात्रवृत्ति", "स्कॉलरशिप", "mahadbt", "महाडीबीटी", "ebc", "ईबीसी", "freeship", "tfws", "concession", "सवलत", "waiver"],
  // note: "campus" deliberately excluded — "college"/"कॉलेज" expands to it,
  // which would drag plain campus questions into the placements answer.
  placement: ["placement", "placements", "प्लेसमेंट", "नोकरी", "नौकरी", "job", "jobs", "naukri", "package", "पॅकेज", "पगार", "salary", "lpa", "companies", "recruiters", "कंपन्या", "career"],
  documents: ["document", "documents", "दस्तऐवज", "कागदपत्रे", "दस्तावेज़", "कागजात", "certificate", "certificates", "प्रमाणपत्र", "marksheet", "मार्कशीट", "papers"],
  contact: ["contact", "संपर्क", "phone", "फोन", "number", "नंबर", "call", "कॉल", "email", "ईमेल", "whatsapp", "व्हॉट्सअॅप", "office", "ऑफिस", "helpline"],
  location: ["address", "पत्ता", "location", "located", "where", "कुठे", "कहाँ", "reach", "पोहोचायचे", "जायचे", "map", "नकाशा", "directions", "distance", "अंतर", "wadhe", "वाढे"],
  engineering: ["engineering", "btech", "engg", "अभियांत्रिकी", "इंजिनिअरिंग", "बीटेक", "mtech", "एमटेक", "cse", "mechanical", "civil", "electrical", "entc", "robotics", "mechatronics"],
  pharmacy: ["pharmacy", "pharma", "फार्मसी", "bpharm", "dpharm", "mpharm", "pharmd", "फार्मा", "औषधनिर्माण"],
  polytechnic: ["polytechnic", "diploma", "डिप्लोमा", "पॉलिटेक्निक", "poly"],
  mbamca: ["mba", "एमबीए", "mca", "एमसीए", "management", "व्यवस्थापन", "bba", "bca"],
  dse: ["direct", "second", "dse", "दुसऱ्या", "dusrya", "lateral", "थेट"],
  accreditation: ["naac", "नॅक", "nba", "एनबीए", "accreditation", "accredited", "autonomous", "स्वायत्त", "grade", "ranking", "approval", "aicte", "मान्यता", "affiliated", "affiliation", "university", "विद्यापीठ"],
};

/* ---------------- the answer book ---------------- */
export const CANNED: CannedAnswer[] = [
  /* ---------- admission process ---------- */
  {
    id: "admissions",
    required: [G.admission],
    priority: 5,
    source: { title: "Admission Process", heading: "How admission works at Yashoda", url: SITE },
    answers: {
      en: `Here's how it works at Yashoda. Most seats are filled through the Centralized Admission Process (CAP) run by the Maharashtra State CET Cell:

• B.Tech — MHT-CET, then CAP rounds
• MBA — MAH-MBA/MMS-CET · MCA — MAH-MCA-CET
• B.Pharmacy / Pharm D / D.Pharmacy — as per CET Cell and PCI norms
• Polytechnic diploma — after SSC, through the centralised first-year process

Seats left vacant after CAP are filled at institute level by our office, so it's always worth calling to ask about your branch.

Next step: keep your marksheets and CET scorecard ready, and call the admission office on ${PHONE}. Would you like the full document list?`,
      hi: `यशोदा में प्रक्रिया ऐसी चलती है। ज़्यादातर सीटें महाराष्ट्र राज्य CET सेल की केंद्रीभूत प्रवेश प्रक्रिया (CAP) से भरती हैं:

• बी.टेक — MHT-CET, फिर CAP राउंड
• MBA — MAH-MBA/MMS-CET · MCA — MAH-MCA-CET
• बी.फार्मसी / फार्म डी / डी.फार्मसी — CET सेल और PCI नियमों के अनुसार
• पॉलिटेक्निक डिप्लोमा — 10वीं के बाद, केंद्रीभूत प्रक्रिया से

CAP के बाद खाली रह गई सीटें संस्था स्तर पर भरी जाती हैं — इसलिए अपनी ब्रांच के बारे में ऑफिस से पूछना फ़ायदेमंद रहता है।

अगला कदम: मार्कशीट और CET स्कोरकार्ड तैयार रखें, और ऑफिस को ${PHONE} पर कॉल करें। क्या आपको पूरी दस्तावेज़ सूची चाहिए?`,
      mr: `यशोदामध्ये प्रक्रिया अशी चालते. बहुतांश जागा महाराष्ट्र राज्य CET कक्षाच्या केंद्रीभूत प्रवेश प्रक्रियेतून (CAP) भरल्या जातात:

• बी.टेक — MHT-CET, नंतर CAP फेऱ्या
• MBA — MAH-MBA/MMS-CET · MCA — MAH-MCA-CET
• बी.फार्मसी / फार्म डी / डी.फार्मसी — CET कक्ष व PCI नियमांनुसार
• पॉलिटेक्निक डिप्लोमा — दहावीनंतर, केंद्रीभूत प्रक्रियेतून

CAP नंतर रिक्त राहिलेल्या जागा संस्थास्तरावर भरल्या जातात — त्यामुळे आपल्या शाखेबद्दल ऑफिसला विचारणे नेहमीच उपयुक्त ठरते.

पुढची पायरी: मार्कशीट व CET स्कोअरकार्ड तयार ठेवा आणि ऑफिसला ${PHONE} वर कॉल करा. संपूर्ण कागदपत्रांची यादी हवी आहे का?`,
    },
  },

  /* ---------- courses overview ---------- */
  {
    id: "courses",
    required: [G.course],
    priority: 4,
    source: { title: "Courses Offered", heading: "Programmes and intake", url: SITE },
    answers: {
      en: `Yashoda runs the full technical ladder on one campus at Wadhe:

• Faculty of Engineering — B.Tech in CSE (180), E&TC (120), AI & Data Science (120), CSE-Cyber Security (120), Robotics & AI (60), Cloud Computing (60), Electrical (60), Civil (30), Mechanical (30), Mechatronics (30); M.Tech in Mechanical, CSE, EV Technology
• Faculty of Pharmacy — D.Pharmacy (60), B.Pharmacy (100+100), Pharm D (30), M.Pharm in four specializations
• Faculty of Polytechnic — diploma after 10th in Computer (90), Civil, Mechanical, Electrical, E&TC, AI & ML, Automation & Robotics, Instrumentation (60 each)
• MBA (120) and MCA (180), plus BBA and BCA

Which faculty interests you? I can explain that one in detail.`,
      hi: `यशोदा में वाढे कैंपस पर पूरी तकनीकी सीढ़ी उपलब्ध है:

• इंजीनियरिंग — बी.टेक: CSE (180), E&TC (120), AI व डेटा साइंस (120), CSE-साइबर सिक्योरिटी (120), रोबोटिक्स व AI (60), क्लाउड कंप्यूटिंग (60), इलेक्ट्रिकल (60), सिविल (30), मैकेनिकल (30), मेकाट्रॉनिक्स (30); एम.टेक: मैकेनिकल, CSE, EV टेक्नोलॉजी
• फार्मसी — डी.फार्मसी (60), बी.फार्मसी (100+100), फार्म डी (30), एम.फार्म चार विशेषज्ञताओं में
• पॉलिटेक्निक — 10वीं के बाद डिप्लोमा: कंप्यूटर (90), सिविल, मैकेनिकल, इलेक्ट्रिकल, E&TC, AI व ML, ऑटोमेशन व रोबोटिक्स, इंस्ट्रुमेंटेशन (प्रत्येक 60)
• MBA (120) और MCA (180), साथ ही BBA व BCA

आपकी रुचि किस फैकल्टी में है? मैं उसके बारे में विस्तार से बता सकता हूँ।`,
      mr: `यशोदामध्ये वाढे कॅम्पसवर संपूर्ण तांत्रिक शिक्षणाची शिडी उपलब्ध आहे:

• अभियांत्रिकी — बी.टेक: CSE (180), E&TC (120), AI व डेटा सायन्स (120), CSE-सायबर सिक्युरिटी (120), रोबोटिक्स व AI (60), क्लाउड कॉम्प्युटिंग (60), इलेक्ट्रिकल (60), सिव्हिल (30), मेकॅनिकल (30), मेकॅट्रॉनिक्स (30); एम.टेक: मेकॅनिकल, CSE, EV टेक्नॉलॉजी
• फार्मसी — डी.फार्मसी (60), बी.फार्मसी (100+100), फार्म डी (30), एम.फार्म चार विशेषज्ञतांमध्ये
• पॉलिटेक्निक — दहावीनंतर डिप्लोमा: कॉम्प्युटर (90), सिव्हिल, मेकॅनिकल, इलेक्ट्रिकल, E&TC, AI व ML, ऑटोमेशन व रोबोटिक्स, इन्स्ट्रुमेंटेशन (प्रत्येकी 60)
• MBA (120) आणि MCA (180), तसेच BBA व BCA

आपल्याला कोणत्या शाखेत रस आहे? मी त्याबद्दल सविस्तर सांगू शकतो.`,
    },
  },

  /* ---------- engineering ---------- */
  {
    id: "engineering",
    required: [G.engineering],
    boost: [G.course],
    priority: 3,
    source: { title: "Faculty of Engineering", heading: "B.Tech and M.Tech intake", url: "https://engg.yes.edu.in" },
    answers: {
      en: `The Faculty of Engineering at Yashoda runs B.Tech and M.Tech affiliated to DBATU, Lonere:

• Computer Science & Engineering — 180 (NAAC & NBA accredited)
• Electronics & Telecommunication — 120 · AI & Data Science — 120 · CSE Cyber Security — 120
• Robotics & AI — 60 · Cloud Computing — 60 · Civil & Environmental (IL) — 60 · Electrical — 60 (NAAC & NBA)
• Civil — 30 · Mechanical — 30 · Mechatronics — 30
• M.Tech — Mechanical (12), CSE (18), Electric Vehicle Technology (18)

Students work in the Microchip and E-Plan Centres of Excellence and the EV laboratory on campus.

Next step: admission is through MHT-CET and the CAP rounds — the office on ${PHONE} can check this year's position for your branch.`,
      hi: `यशोदा की इंजीनियरिंग फैकल्टी में बी.टेक और एम.टेक (DBATU, लोणेरे से संलग्न) चलते हैं:

• कंप्यूटर साइंस व इंजीनियरिंग — 180 (NAAC व NBA मान्यताप्राप्त)
• इलेक्ट्रॉनिक्स व टेलीकम्युनिकेशन — 120 · AI व डेटा साइंस — 120 · CSE साइबर सिक्योरिटी — 120
• रोबोटिक्स व AI — 60 · क्लाउड कंप्यूटिंग — 60 · सिविल व एनवायरनमेंटल (IL) — 60 · इलेक्ट्रिकल — 60
• सिविल — 30 · मैकेनिकल — 30 · मेकाट्रॉनिक्स — 30
• एम.टेक — मैकेनिकल (12), CSE (18), इलेक्ट्रिक व्हीकल टेक्नोलॉजी (18)

कैंपस पर माइक्रोचिप व E-Plan सेंटर ऑफ एक्सीलेंस और EV लैब में छात्र काम करते हैं।

अगला कदम: प्रवेश MHT-CET व CAP राउंड से होता है — ${PHONE} पर ऑफिस इस साल की स्थिति बता देगा।`,
      mr: `यशोदाच्या अभियांत्रिकी शाखेत बी.टेक व एम.टेक (DBATU, लोणेरे संलग्न) चालतात:

• कॉम्प्युटर सायन्स अँड इंजिनिअरिंग — 180 (NAAC व NBA मानांकित)
• इलेक्ट्रॉनिक्स अँड टेलिकम्युनिकेशन — 120 · AI व डेटा सायन्स — 120 · CSE सायबर सिक्युरिटी — 120
• रोबोटिक्स व AI — 60 · क्लाउड कॉम्प्युटिंग — 60 · सिव्हिल अँड एन्व्हायर्नमेंटल (IL) — 60 · इलेक्ट्रिकल — 60
• सिव्हिल — 30 · मेकॅनिकल — 30 · मेकॅट्रॉनिक्स — 30
• एम.टेक — मेकॅनिकल (12), CSE (18), इलेक्ट्रिक व्हेइकल टेक्नॉलॉजी (18)

कॅम्पसवर मायक्रोचिप व E-Plan सेंटर ऑफ एक्सलन्स आणि EV प्रयोगशाळेत विद्यार्थी काम करतात.

पुढची पायरी: प्रवेश MHT-CET व CAP फेऱ्यांमधून होतो — ${PHONE} वर ऑफिस यावर्षीची स्थिती सांगेल.`,
    },
  },

  /* ---------- pharmacy ---------- */
  {
    id: "pharmacy",
    required: [G.pharmacy],
    boost: [G.course],
    priority: 3,
    source: { title: "Faculty of Pharmacy", heading: "Pharmacy courses and intake", url: "https://pharma.yes.edu.in" },
    answers: {
      en: `The Faculty of Pharmacy at Yashoda is PCI-approved and offers the complete pharmacy ladder:

• D.Pharmacy — intake 60, after 12th, MSBTE affiliated, NBA accredited
• B.Pharmacy — intake 100 + 100, DBATU Lonere
• Pharm D — intake 30, started 2024
• M.Pharmacy — Pharmaceutics (15), Pharmacology (9), Pharmaceutical Chemistry (15), Regulatory Affairs (15)

Graduates move into pharmaceutical industry, regulatory affairs, hospital and clinical pharmacy, and teaching — several of our alumni are assistant professors today.

Next step: the admission office on ${PHONE} will confirm this year's eligibility and the CET Cell schedule for pharmacy.`,
      hi: `यशोदा की फार्मसी फैकल्टी PCI-अनुमोदित है और पूरी फार्मसी सीढ़ी उपलब्ध कराती है:

• डी.फार्मसी — 60 सीटें, MSBTE संलग्न, NBA मान्यताप्राप्त
• बी.फार्मसी — 100 + 100 सीटें, DBATU लोणेरे
• फार्म डी — 30 सीटें, 2024 से
• एम.फार्मसी — फार्मास्युटिक्स (15), फार्माकोलॉजी (9), फार्मास्युटिकल केमिस्ट्री (15), रेगुलेटरी अफेयर्स (15)

स्नातक दवा उद्योग, रेगुलेटरी अफेयर्स, हॉस्पिटल व क्लिनिकल फार्मसी और शिक्षण में जाते हैं — हमारे कई पूर्व छात्र आज सहायक प्राध्यापक हैं।

अगला कदम: ${PHONE} पर ऑफिस इस साल की पात्रता और CET सेल का कार्यक्रम बता देगा।`,
      mr: `यशोदाची फार्मसी शाखा PCI-मान्यताप्राप्त असून संपूर्ण फार्मसी शिडी उपलब्ध करते:

• डी.फार्मसी — 60 जागा, MSBTE संलग्न, NBA मानांकित
• बी.फार्मसी — 100 + 100 जागा, DBATU लोणेरे
• फार्म डी — 30 जागा, 2024 पासून
• एम.फार्मसी — फार्मास्युटिक्स (15), फार्माकोलॉजी (9), फार्मास्युटिकल केमिस्ट्री (15), रेग्युलेटरी अफेअर्स (15)

पदवीधर औषध उद्योग, रेग्युलेटरी अफेअर्स, हॉस्पिटल व क्लिनिकल फार्मसी आणि अध्यापनात जातात — आमचे अनेक माजी विद्यार्थी आज सहायक प्राध्यापक आहेत.

पुढची पायरी: ${PHONE} वर ऑफिस यावर्षीची पात्रता व CET कक्षाचे वेळापत्रक सांगेल.`,
    },
  },

  /* ---------- polytechnic ---------- */
  {
    id: "polytechnic",
    required: [G.polytechnic],
    boost: [G.course],
    priority: 3,
    source: { title: "Faculty of Polytechnic", heading: "Diploma courses and intake", url: "https://poly.yes.edu.in" },
    answers: {
      en: `The Faculty of Polytechnic at Yashoda offers three-year diplomas after SSC (10th), affiliated to MSBTE, Mumbai:

• Computer Engineering — 90
• Civil, Mechanical, Electrical, Electronics & Telecommunication — 60 each
• AI & Machine Learning — 60
• Automation & Robotics — 60 · Instrumentation & Control — 60

Diploma students use the same campus facilities as degree students — laboratories, library, hostels, bus facility and canteen — and can later take direct second-year admission to B.Tech here itself.

Next step: admission is after SSC through the centralised first-year diploma process. Call ${PHONE} and the office will guide you through the forms.`,
      hi: `यशोदा की पॉलिटेक्निक फैकल्टी 10वीं के बाद तीन वर्षीय डिप्लोमा देती है (MSBTE, मुंबई से संलग्न):

• कंप्यूटर इंजीनियरिंग — 90
• सिविल, मैकेनिकल, इलेक्ट्रिकल, इलेक्ट्रॉनिक्स व टेलीकम्युनिकेशन — प्रत्येक 60
• AI व मशीन लर्निंग — 60
• ऑटोमेशन व रोबोटिक्स — 60 · इंस्ट्रुमेंटेशन व कंट्रोल — 60

डिप्लोमा छात्रों को डिग्री छात्रों जैसी ही सुविधाएँ मिलती हैं — प्रयोगशालाएँ, लाइब्रेरी, हॉस्टेल, बस सुविधा और कैंटीन — और आगे यहीं बी.टेक में सीधे दूसरे वर्ष प्रवेश ले सकते हैं।

अगला कदम: प्रवेश 10वीं के बाद केंद्रीभूत प्रक्रिया से होता है। ${PHONE} पर कॉल करें, ऑफिस फॉर्म में मदद करेगा।`,
      mr: `यशोदाची पॉलिटेक्निक शाखा दहावीनंतर तीन वर्षांचे डिप्लोमा देते (MSBTE, मुंबई संलग्न):

• कॉम्प्युटर इंजिनिअरिंग — 90
• सिव्हिल, मेकॅनिकल, इलेक्ट्रिकल, इलेक्ट्रॉनिक्स व टेलिकम्युनिकेशन — प्रत्येकी 60
• AI व मशीन लर्निंग — 60
• ऑटोमेशन व रोबोटिक्स — 60 · इन्स्ट्रुमेंटेशन व कंट्रोल — 60

डिप्लोमाच्या विद्यार्थ्यांना पदवीच्या विद्यार्थ्यांसारख्याच सुविधा मिळतात — प्रयोगशाळा, ग्रंथालय, वसतिगृह, बस सुविधा व कॅन्टीन — आणि पुढे इथेच बी.टेकला थेट द्वितीय वर्ष प्रवेश घेता येतो.

पुढची पायरी: प्रवेश दहावीनंतर केंद्रीभूत प्रक्रियेतून होतो. ${PHONE} वर कॉल करा, ऑफिस फॉर्म भरण्यात मदत करेल.`,
    },
  },

  /* ---------- MBA / MCA ---------- */
  {
    id: "mbamca",
    required: [G.mbamca],
    boost: [G.course],
    priority: 3,
    source: { title: "MBA and MCA", heading: "Management and computer applications", url: "https://mba.yes.edu.in" },
    answers: {
      en: `Both post-graduate programmes at Yashoda are affiliated to Shivaji University, Kolhapur:

• MBA — intake 120, running since 2011, approved by AICTE and DTE Maharashtra. Admission through MAH-MBA/MMS-CET and the CAP rounds. The faculty also runs the T360 professional development programme.
• MCA — intake 180, since 2011, NAAC and NBA accredited. Admission through MAH-MCA-CET and CAP.

The campus also has Faculty of BBA and Faculty of BCA for students coming straight after 12th.

Next step: keep your graduation marksheets and CET scorecard ready — the office on ${PHONE} will confirm this year's eligibility for your category.`,
      hi: `यशोदा के दोनों स्नातकोत्तर कार्यक्रम शिवाजी विश्वविद्यालय, कोल्हापुर से संलग्न हैं:

• MBA — 120 सीटें, 2011 से, AICTE व DTE महाराष्ट्र अनुमोदित। प्रवेश MAH-MBA/MMS-CET और CAP राउंड से। फैकल्टी T360 प्रोफेशनल डेवलपमेंट प्रोग्राम भी चलाती है।
• MCA — 180 सीटें, 2011 से, NAAC व NBA मान्यताप्राप्त। प्रवेश MAH-MCA-CET और CAP से।

12वीं के बाद आने वाले छात्रों के लिए कैंपस पर BBA व BCA फैकल्टी भी हैं।

अगला कदम: स्नातक की मार्कशीट और CET स्कोरकार्ड तैयार रखें — ${PHONE} पर ऑफिस आपकी श्रेणी की पात्रता बता देगा।`,
      mr: `यशोदाचे दोन्ही पदव्युत्तर अभ्यासक्रम शिवाजी विद्यापीठ, कोल्हापूरशी संलग्न आहेत:

• MBA — 120 जागा, 2011 पासून, AICTE व DTE महाराष्ट्र मान्यताप्राप्त. प्रवेश MAH-MBA/MMS-CET व CAP फेऱ्यांमधून. शाखा T360 प्रोफेशनल डेव्हलपमेंट कार्यक्रमही चालवते.
• MCA — 180 जागा, 2011 पासून, NAAC व NBA मानांकित. प्रवेश MAH-MCA-CET व CAP मधून.

बारावीनंतर येणाऱ्या विद्यार्थ्यांसाठी कॅम्पसवर BBA व BCA शाखादेखील आहेत.

पुढची पायरी: पदवीच्या मार्कशीट व CET स्कोअरकार्ड तयार ठेवा — ${PHONE} वर ऑफिस आपल्या प्रवर्गाची पात्रता सांगेल.`,
    },
  },

  /* ---------- eligibility ---------- */
  {
    id: "eligibility",
    required: [G.eligibility],
    priority: 5,
    source: { title: "Admission Process", heading: "Eligibility for each programme", url: SITE },
    answers: {
      en: `Eligibility at Yashoda is set by the affiliating university and the State CET Cell for each admission year — so I'll give you the shape of it, and the office confirms the exact numbers (they change every year):

• B.Tech first year — HSC Science with Physics, Chemistry and Mathematics, through CAP
• B.Tech direct second year — a recognised engineering diploma in a relevant branch
• B.Pharmacy / Pharm D — HSC Science as per PCI and CET Cell norms
• D.Pharmacy and Polytechnic diploma — after SSC (10th)
• M.Tech — relevant B.E./B.Tech · M.Pharm — B.Pharmacy
• MBA — any recognised graduation · MCA — graduation with required background

I don't quote cut-offs or percentages, because last year's numbers mislead families.

Next step: call ${PHONE} with your marksheet in hand — the office will tell you exactly where you stand for your category.`,
      hi: `यशोदा में पात्रता हर प्रवेश वर्ष के लिए संलग्न विश्वविद्यालय और राज्य CET सेल तय करते हैं — इसलिए मैं ढाँचा बता देता हूँ, सटीक आँकड़े ऑफिस कन्फर्म करेगा (वे हर साल बदलते हैं):

• बी.टेक प्रथम वर्ष — 12वीं विज्ञान (भौतिकी, रसायन, गणित), CAP के माध्यम से
• बी.टेक सीधे दूसरे वर्ष — संबंधित ब्रांच का मान्यताप्राप्त इंजीनियरिंग डिप्लोमा
• बी.फार्मसी / फार्म डी — 12वीं विज्ञान, PCI व CET सेल नियमानुसार
• डी.फार्मसी व पॉलिटेक्निक डिप्लोमा — 10वीं के बाद
• एम.टेक — संबंधित बी.ई./बी.टेक · एम.फार्म — बी.फार्मसी
• MBA — कोई भी मान्यताप्राप्त स्नातक · MCA — आवश्यक पृष्ठभूमि के साथ स्नातक

मैं कट-ऑफ या प्रतिशत नहीं बताता, क्योंकि पिछले साल के आँकड़े परिवारों को भ्रमित करते हैं।

अगला कदम: मार्कशीट लेकर ${PHONE} पर कॉल करें — ऑफिस आपकी श्रेणी की सही स्थिति बताएगा।`,
      mr: `यशोदामध्ये पात्रता दरवर्षी संलग्न विद्यापीठ व राज्य CET कक्ष ठरवतात — म्हणून मी स्वरूप सांगतो, नेमके आकडे ऑफिस कन्फर्म करेल (ते दरवर्षी बदलतात):

• बी.टेक प्रथम वर्ष — बारावी विज्ञान (भौतिकशास्त्र, रसायनशास्त्र, गणित), CAP मधून
• बी.टेक थेट द्वितीय वर्ष — संबंधित शाखेचा मान्यताप्राप्त अभियांत्रिकी डिप्लोमा
• बी.फार्मसी / फार्म डी — बारावी विज्ञान, PCI व CET कक्ष नियमांनुसार
• डी.फार्मसी व पॉलिटेक्निक डिप्लोमा — दहावीनंतर
• एम.टेक — संबंधित बी.ई./बी.टेक · एम.फार्म — बी.फार्मसी
• MBA — कोणतीही मान्यताप्राप्त पदवी · MCA — आवश्यक पार्श्वभूमीसह पदवी

मी कट-ऑफ किंवा टक्केवारी सांगत नाही, कारण मागील वर्षीचे आकडे कुटुंबांची दिशाभूल करतात.

पुढची पायरी: मार्कशीट घेऊन ${PHONE} वर कॉल करा — ऑफिस आपल्या प्रवर्गाची नेमकी स्थिती सांगेल.`,
    },
  },

  /* ---------- fees (never a number) ---------- */
  {
    id: "fees",
    required: [G.fee],
    priority: 6,
    source: { title: "Fees", heading: "FRA-approved fee structure", url: "https://www.yes.edu.in/fra-fee-approved" },
    answers: {
      en: `On fees I'll be straight with you: I never quote an amount, because fees at Yashoda are approved every year by the Fees Regulating Authority (FRA), Government of Maharashtra, and they differ by programme and year. An old number would mislead you.

The current, official structure is here:
• FRA-approved fees — yes.edu.in/fra-fee-approved
• Engineering fee structure — engg.yes.edu.in/engineering-fee-structures
• Hostel fees (meals and accommodation included) are published separately by the hostel office

Fee payment can be made online through the institute's portal, and there is a published fee refund policy.

Next step: open the fee page above, or call the office on ${PHONE} and they'll read out the exact figure for your programme and category.`,
      hi: `फीस के बारे में साफ़ बात: मैं कभी रकम नहीं बताता, क्योंकि यशोदा की फीस हर साल महाराष्ट्र सरकार की शुल्क नियामक प्राधिकरण (FRA) मंज़ूर करती है और यह कोर्स व वर्ष के अनुसार बदलती है। पुराना आँकड़ा आपको गुमराह करेगा।

मौजूदा आधिकारिक संरचना यहाँ है:
• FRA-मंज़ूर फीस — yes.edu.in/fra-fee-approved
• इंजीनियरिंग फीस — engg.yes.edu.in/engineering-fee-structures
• हॉस्टेल फीस (भोजन व निवास सहित) हॉस्टेल ऑफिस अलग से प्रकाशित करता है

फीस ऑनलाइन पोर्टल से भरी जा सकती है, और रिफंड नीति भी प्रकाशित है।

अगला कदम: ऊपर दिया फीस पेज खोलें, या ${PHONE} पर कॉल करें — ऑफिस आपके कोर्स और श्रेणी की सटीक रकम बता देगा।`,
      mr: `फीबद्दल स्पष्ट सांगतो: मी कधीही रक्कम सांगत नाही, कारण यशोदाची फी दरवर्षी महाराष्ट्र शासनाची शुल्क नियामक प्राधिकरण (FRA) मंजूर करते आणि ती अभ्यासक्रम व वर्षानुसार बदलते. जुना आकडा आपली दिशाभूल करेल.

सध्याची अधिकृत रचना इथे आहे:
• FRA-मंजूर फी — yes.edu.in/fra-fee-approved
• अभियांत्रिकी फी — engg.yes.edu.in/engineering-fee-structures
• वसतिगृह फी (जेवण व निवासासह) वसतिगृह कार्यालय स्वतंत्रपणे प्रसिद्ध करते

फी ऑनलाइन पोर्टलवरून भरता येते, आणि परतावा धोरणही प्रसिद्ध आहे.

पुढची पायरी: वरील फी पेज उघडा, किंवा ${PHONE} वर कॉल करा — ऑफिस आपल्या अभ्यासक्रमाची व प्रवर्गाची नेमकी रक्कम सांगेल.`,
    },
  },

  /* ---------- girls hostel ---------- */
  {
    id: "girls_hostel",
    required: [G.hostel, G.girls],
    priority: 9,
    source: { title: "Hostel", heading: "Girls hostel", url: "https://www.yes.edu.in/about-hostel-facilities" },
    answers: {
      en: `Yes — and this is the question parents ask me most. The girls hostel is inside the campus boundary at Wadhe, not outside it, with a total capacity of 350 seats. Meals and accommodation are included in the hostel fee.

Day to day: a spacious, clean dining hall for hostellers, hygienic mess food, RO drinking water, first-aid facilities in the hostel, and the library, canteen, sports grounds and gymkhana all within walking distance on the same green campus.

Hostel admission is handled separately by the hostel office, after the course admission is confirmed.

Next step: confirm the course seat first, then book the hostel seat early — call ${PHONE}, and do ask for a campus visit so you can see the hostel yourself.`,
      hi: `जी हाँ — और यही सवाल माता-पिता सबसे ज़्यादा पूछते हैं। लड़कियों का हॉस्टेल वाढे कैंपस के भीतर ही है, बाहर नहीं, और कुल क्षमता 350 सीटों की है। हॉस्टेल फीस में भोजन व निवास शामिल हैं।

रोज़मर्रा: हॉस्टेल वालों के लिए विशाल, स्वच्छ भोजन कक्ष, स्वच्छ मेस भोजन, RO पानी, हॉस्टेल में प्राथमिक चिकित्सा सुविधा, और उसी हरे-भरे कैंपस में पैदल दूरी पर लाइब्रेरी, कैंटीन, खेल मैदान व जिमखाना।

हॉस्टेल प्रवेश कोर्स प्रवेश कन्फर्म होने के बाद हॉस्टेल ऑफिस अलग से करता है।

अगला कदम: पहले कोर्स की सीट कन्फर्म करें, फिर हॉस्टेल सीट जल्दी बुक करें — ${PHONE} पर कॉल करें, और कैंपस विज़िट ज़रूर माँगें ताकि आप हॉस्टेल खुद देख सकें।`,
      mr: `होय — आणि पालक मला हाच प्रश्न सर्वाधिक विचारतात. मुलींचे वसतिगृह वाढे कॅम्पसच्या आतच आहे, बाहेर नाही, आणि एकूण क्षमता 350 जागांची आहे. वसतिगृह फीमध्ये जेवण व निवास समाविष्ट आहे.

रोजचे जीवन: वसतिगृहातील विद्यार्थिनींसाठी प्रशस्त, स्वच्छ भोजनकक्ष, स्वच्छ मेसचे जेवण, RO पाणी, वसतिगृहात प्रथमोपचार सुविधा, आणि त्याच हरित कॅम्पसवर चालत जाण्याच्या अंतरावर ग्रंथालय, कॅन्टीन, क्रीडांगण व जिमखाना.

वसतिगृह प्रवेश हा अभ्यासक्रमाचा प्रवेश निश्चित झाल्यावर वसतिगृह कार्यालय स्वतंत्रपणे करते.

पुढची पायरी: आधी अभ्यासक्रमाची जागा निश्चित करा, मग वसतिगृहाची जागा लवकर नोंदवा — ${PHONE} वर कॉल करा, आणि कॅम्पस भेटीची विनंती जरूर करा म्हणजे वसतिगृह स्वतः पाहता येईल.`,
    },
  },

  /* ---------- hostel fees ---------- */
  {
    id: "hostel_fees",
    required: [G.hostel, G.fee],
    priority: 10,
    source: { title: "Hostel", heading: "Hostel fees", url: "https://www.yes.edu.in/about-hostel-facilities" },
    answers: {
      en: `The hostel fee at Yashoda includes both meals and accommodation — but I won't quote the figure, because the hostel office publishes it fresh each year and an old number would mislead you.

What I can tell you: the girls hostel inside the campus has 350 seats, the boys hostel has 100, and both include the dining hall, mess food, RO water and first-aid facilities in that fee.

Next step: call the office on ${PHONE} and ask for this year's hostel fee structure along with the course fee — they'll give you both figures together, so you can plan properly.`,
      hi: `यशोदा की हॉस्टेल फीस में भोजन और निवास दोनों शामिल हैं — पर मैं रकम नहीं बताऊँगा, क्योंकि हॉस्टेल ऑफिस इसे हर साल नया प्रकाशित करता है और पुराना आँकड़ा गुमराह करेगा।

जो मैं बता सकता हूँ: कैंपस के भीतर लड़कियों के हॉस्टेल में 350 सीटें और लड़कों के हॉस्टेल में 100 सीटें हैं, और उसी फीस में भोजन कक्ष, मेस भोजन, RO पानी व प्राथमिक चिकित्सा शामिल हैं।

अगला कदम: ${PHONE} पर कॉल करके इस साल की हॉस्टेल फीस कोर्स फीस के साथ माँगें — ऑफिस दोनों आँकड़े एक साथ देगा, जिससे आप ठीक से योजना बना सकें।`,
      mr: `यशोदाच्या वसतिगृह फीमध्ये जेवण व निवास दोन्ही समाविष्ट आहेत — पण मी रक्कम सांगणार नाही, कारण वसतिगृह कार्यालय ती दरवर्षी नव्याने प्रसिद्ध करते आणि जुना आकडा दिशाभूल करेल.

मी एवढे सांगू शकतो: कॅम्पसमधील मुलींच्या वसतिगृहात 350 जागा व मुलांच्या वसतिगृहात 100 जागा आहेत, आणि त्याच फीमध्ये भोजनकक्ष, मेसचे जेवण, RO पाणी व प्रथमोपचार समाविष्ट आहेत.

पुढची पायरी: ${PHONE} वर कॉल करून यावर्षीची वसतिगृह फी अभ्यासक्रमाच्या फीसह विचारा — ऑफिस दोन्ही आकडे एकत्र देईल, म्हणजे नीट नियोजन करता येईल.`,
    },
  },

  /* ---------- mess / food ---------- */
  {
    id: "mess",
    required: [G.mess],
    priority: 7,
    source: { title: "Hostel", heading: "Mess and dining", url: "https://www.yes.edu.in/about-hostel-facilities" },
    answers: {
      en: `Food at Yashoda is looked after properly. Hostellers eat in a spacious, clean dining hall, and the mess food is included in the hostel fee — so there's no separate monthly mess bill to worry about. RO drinking water is available across the campus.

For day scholars and between lectures, the campus canteen serves hygienic, healthy food.

Next step: when you visit the campus, ask the office to show you the dining hall and canteen — most parents want to see this for themselves. Call ${PHONE} to fix a time.`,
      hi: `यशोदा में भोजन का ध्यान ठीक से रखा जाता है। हॉस्टेल के छात्र विशाल, स्वच्छ भोजन कक्ष में खाते हैं, और मेस भोजन हॉस्टेल फीस में शामिल है — इसलिए अलग से मासिक मेस बिल की चिंता नहीं। पूरे कैंपस में RO पीने का पानी उपलब्ध है।

डे-स्कॉलर छात्रों और लेक्चर के बीच के समय के लिए कैंपस कैंटीन स्वच्छ व पौष्टिक भोजन देती है।

अगला कदम: कैंपस विज़िट के समय ऑफिस से भोजन कक्ष और कैंटीन दिखाने को कहें — ज़्यादातर माता-पिता यह खुद देखना चाहते हैं। समय तय करने के लिए ${PHONE} पर कॉल करें।`,
      mr: `यशोदामध्ये जेवणाची काळजी व्यवस्थित घेतली जाते. वसतिगृहातील विद्यार्थी प्रशस्त, स्वच्छ भोजनकक्षात जेवतात, आणि मेसचे जेवण वसतिगृह फीमध्ये समाविष्ट आहे — त्यामुळे वेगळ्या मासिक मेस बिलाची चिंता नाही. संपूर्ण कॅम्पसवर RO पिण्याचे पाणी उपलब्ध आहे.

बाहेरून येणाऱ्या विद्यार्थ्यांसाठी व लेक्चरमधल्या वेळेसाठी कॅम्पस कॅन्टीनमध्ये स्वच्छ व पौष्टिक जेवण मिळते.

पुढची पायरी: कॅम्पस भेटीच्या वेळी ऑफिसला भोजनकक्ष व कॅन्टीन दाखवायला सांगा — बहुतेक पालकांना हे स्वतः पाहायचे असते. वेळ ठरवण्यासाठी ${PHONE} वर कॉल करा.`,
    },
  },

  /* ---------- transport ---------- */
  {
    id: "transport",
    required: [G.transport],
    priority: 7,
    source: { title: "Transport", heading: "Bus facility", url: SITE },
    answers: {
      en: `Yes, the campus runs a bus facility for students from across Satara district — it's one of the facilities the college lists for exactly this reason: most of our students travel in daily from the district.

The campus itself sits at Wadhe on NH-4, about 8–9 km from the Satara bus stand on the Pune side, so autos, cabs and local buses also run there in 15–20 minutes.

Routes, stops and timings are fixed for each academic year by the transport office, so I won't guess at your particular stop.

Next step: call ${PHONE} and tell them which town you're travelling from — the transport office will confirm whether a bus covers your route this year.`,
      hi: `जी हाँ, कैंपस पूरे सातारा ज़िले से छात्रों के लिए बस सुविधा चलाता है — कॉलेज इसे अपनी सुविधाओं में इसीलिए गिनाता है: हमारे ज़्यादातर छात्र रोज़ ज़िले से आते-जाते हैं।

कैंपस NH-4 पर वाढे में है, सातारा बस स्टैंड से पुणे की ओर लगभग 8–9 किमी — वहाँ ऑटो, कैब और लोकल बसें भी 15–20 मिनट में पहुँचाती हैं।

रूट, स्टॉप व समय हर शैक्षणिक वर्ष के लिए ट्रांसपोर्ट ऑफिस तय करता है, इसलिए मैं आपके स्टॉप के बारे में अनुमान नहीं लगाऊँगा।

अगला कदम: ${PHONE} पर कॉल करके बताएँ कि आप किस शहर से आएँगे — ट्रांसपोर्ट ऑफिस इस साल आपके रूट की पुष्टि कर देगा।`,
      mr: `होय, कॅम्पस संपूर्ण सातारा जिल्ह्यातून येणाऱ्या विद्यार्थ्यांसाठी बस सुविधा चालवतो — महाविद्यालय ही सुविधा मुद्दाम नमूद करते, कारण आमचे बहुतेक विद्यार्थी रोज जिल्ह्यातून ये-जा करतात.

कॅम्पस NH-4 वर वाढे येथे आहे, सातारा बस स्थानकापासून पुण्याच्या दिशेने सुमारे 8–9 किमी — तिथे रिक्षा, कॅब व लोकल बसही 15–20 मिनिटांत पोहोचवतात.

मार्ग, थांबे व वेळा दरवर्षी वाहतूक कार्यालय ठरवते, त्यामुळे मी आपल्या थांब्याबद्दल अंदाज बांधणार नाही.

पुढची पायरी: ${PHONE} वर कॉल करून आपण कोणत्या गावाहून येणार ते सांगा — वाहतूक कार्यालय यावर्षी आपला मार्ग आहे का ते कन्फर्म करेल.`,
    },
  },

  /* ---------- hostel general ---------- */
  {
    id: "hostel",
    required: [G.hostel],
    priority: 6,
    source: { title: "Hostel", heading: "Hostels at Yashoda", url: "https://www.yes.edu.in/about-hostel-facilities" },
    answers: {
      en: `Yashoda has hostels for both girls and boys inside the green campus at Wadhe — the girls hostel with 350 seats and the boys hostel with 100 seats.

What's included: meals and accommodation in the hostel fee, a spacious and clean dining hall, hygienic mess food, RO drinking water and first-aid facilities in each hostel. The library, canteen, sports grounds and gymkhana are all on the same campus.

Hostel admission is done separately by the hostel office once the course admission is confirmed.

Next step: confirm the course seat, then book the hostel seat early — seats fill up during the admission season. Call ${PHONE} for this year's hostel form and fee structure.`,
      hi: `यशोदा में वाढे के हरे-भरे कैंपस के भीतर लड़कियों और लड़कों दोनों के हॉस्टेल हैं — लड़कियों का हॉस्टेल 350 सीटों का और लड़कों का 100 सीटों का।

क्या शामिल है: हॉस्टेल फीस में भोजन व निवास, विशाल व स्वच्छ भोजन कक्ष, स्वच्छ मेस भोजन, RO पीने का पानी और हर हॉस्टेल में प्राथमिक चिकित्सा सुविधा। लाइब्रेरी, कैंटीन, खेल मैदान व जिमखाना उसी कैंपस पर हैं।

हॉस्टेल प्रवेश कोर्स प्रवेश कन्फर्म होने के बाद हॉस्टेल ऑफिस अलग से करता है।

अगला कदम: कोर्स की सीट कन्फर्म करें, फिर हॉस्टेल सीट जल्दी बुक करें — प्रवेश सीज़न में सीटें भर जाती हैं। इस साल का फॉर्म व फीस संरचना के लिए ${PHONE} पर कॉल करें।`,
      mr: `यशोदामध्ये वाढे येथील हरित कॅम्पसच्या आत मुली व मुलगे दोघांसाठी वसतिगृहे आहेत — मुलींचे वसतिगृह 350 जागांचे आणि मुलांचे 100 जागांचे.

काय समाविष्ट आहे: वसतिगृह फीमध्ये जेवण व निवास, प्रशस्त व स्वच्छ भोजनकक्ष, स्वच्छ मेसचे जेवण, RO पिण्याचे पाणी आणि प्रत्येक वसतिगृहात प्रथमोपचार सुविधा. ग्रंथालय, कॅन्टीन, क्रीडांगण व जिमखाना त्याच कॅम्पसवर आहेत.

वसतिगृह प्रवेश अभ्यासक्रमाचा प्रवेश निश्चित झाल्यावर वसतिगृह कार्यालय स्वतंत्रपणे करते.

पुढची पायरी: अभ्यासक्रमाची जागा निश्चित करा, मग वसतिगृहाची जागा लवकर नोंदवा — प्रवेश हंगामात जागा भरतात. यावर्षीचा फॉर्म व फी रचनेसाठी ${PHONE} वर कॉल करा.`,
    },
  },

  /* ---------- scholarships ---------- */
  {
    id: "scholarships",
    required: [G.scholarship],
    priority: 6,
    source: { title: "Scholarships", heading: "Scholarships as per Government norms", url: "https://mahadbtmahait.gov.in" },
    answers: {
      en: `Scholarships at Yashoda are given as per Government of Maharashtra and Government of India norms, and the campus has a desk that helps students file them correctly:

• Post-matric scholarships and freeships for SC, ST, OBC, VJNT and SBC students — through the MahaDBT portal (mahadbtmahait.gov.in)
• EBC concession — the Rajarshi Chhatrapati Shahu Maharaj scheme, for eligible families, also through MahaDBT
• TFWS (Tuition Fee Waiver Scheme) seats, allotted during the CAP rounds
• Minority and national scholarships through scholarships.gov.in

One practical tip from the office: applications fail more often for missing papers than for eligibility. Keep your caste certificate and validity, income certificate, domicile and bank details ready early.

Next step: call ${PHONE} and ask for the scholarship desk — they'll tell you which scheme fits your category this year.`,
      hi: `यशोदा में छात्रवृत्तियाँ महाराष्ट्र सरकार और भारत सरकार के नियमों के अनुसार मिलती हैं, और कैंपस में एक डेस्क है जो आवेदन सही भरवाने में मदद करती है:

• SC, ST, OBC, VJNT व SBC छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति व फ्रीशिप — MahaDBT पोर्टल से (mahadbtmahait.gov.in)
• EBC सवलत — राजर्षि छत्रपती शाहू महाराज योजना, पात्र परिवारों के लिए, MahaDBT से
• TFWS (शुल्क माफी योजना) सीटें, CAP राउंड में आवंटित
• अल्पसंख्यक व राष्ट्रीय छात्रवृत्तियाँ — scholarships.gov.in से

ऑफिस की एक व्यावहारिक सलाह: आवेदन पात्रता से ज़्यादा कागज़ों की कमी से रुकते हैं। जाति प्रमाणपत्र व वैधता, आय प्रमाणपत्र, डोमिसाइल और बैंक विवरण पहले से तैयार रखें।

अगला कदम: ${PHONE} पर कॉल करके छात्रवृत्ति डेस्क माँगें — वे बताएँगे कि इस साल आपकी श्रेणी के लिए कौन-सी योजना सही है।`,
      mr: `यशोदामध्ये शिष्यवृत्ती महाराष्ट्र शासन व भारत सरकारच्या निकषांनुसार मिळते, आणि कॅम्पसवर अर्ज योग्य प्रकारे भरून घेणारा स्वतंत्र कक्ष आहे:

• SC, ST, OBC, VJNT व SBC विद्यार्थ्यांसाठी पोस्ट-मॅट्रिक शिष्यवृत्ती व फ्रीशिप — MahaDBT पोर्टलवरून (mahadbtmahait.gov.in)
• EBC सवलत — राजर्षी छत्रपती शाहू महाराज योजना, पात्र कुटुंबांसाठी, MahaDBT मधून
• TFWS (शुल्क माफी योजना) जागा, CAP फेऱ्यांमध्ये वाटप
• अल्पसंख्याक व राष्ट्रीय शिष्यवृत्ती — scholarships.gov.in वरून

ऑफिसचा एक व्यावहारिक सल्ला: अर्ज पात्रतेपेक्षा कागदपत्रांच्या कमतरतेमुळे जास्त अडकतात. जातीचा दाखला व वैधता, उत्पन्नाचा दाखला, अधिवास व बँक तपशील आधीच तयार ठेवा.

पुढची पायरी: ${PHONE} वर कॉल करून शिष्यवृत्ती कक्ष मागा — यावर्षी आपल्या प्रवर्गासाठी कोणती योजना योग्य आहे ते ते सांगतील.`,
    },
  },

  /* ---------- placements ---------- */
  {
    id: "placements",
    required: [G.placement],
    priority: 6,
    source: { title: "Training & Placement", heading: "Placements at Yashoda", url: SITE },
    answers: {
      en: `Placement support at Yashoda runs through a dedicated Training and Placement Cell — campus interviews, aptitude and soft-skill training, industrial tours and guest lectures, backed by 300+ industry connects.

The figures the campus publishes: 105 companies visiting, 2,033 students placed, highest package 22 LPA and average 4 LPA. Companies in our placement records include Capgemini, Atos, Byju's, Thermax, Burns McDonnell and GaragePlug, among others. Pharmacy graduates also move into industry and academia.

I'll be honest with you, because you deserve that: outcomes vary by programme, year and the student's own effort — no honest institution promises a job to every student.

Next step: ask the placement cell for the latest year's summary for your branch when you visit, or call ${PHONE}.`,
      hi: `यशोदा में प्लेसमेंट सहायता एक समर्पित ट्रेनिंग व प्लेसमेंट सेल से चलती है — कैंपस इंटरव्यू, एप्टीट्यूड व सॉफ्ट-स्किल ट्रेनिंग, औद्योगिक दौरे और अतिथि व्याख्यान, 300+ इंडस्ट्री कनेक्ट्स के साथ।

कैंपस द्वारा प्रकाशित आँकड़े: 105 कंपनियों का आगमन, 2,033 छात्र प्लेस्ड, उच्चतम पैकेज 22 LPA और औसत 4 LPA। हमारे प्लेसमेंट रिकॉर्ड में Capgemini, Atos, Byju's, Thermax, Burns McDonnell और GaragePlug जैसी कंपनियाँ शामिल हैं। फार्मसी स्नातक उद्योग व शिक्षण क्षेत्र में भी जाते हैं।

मैं आपसे ईमानदारी से कहूँगा: परिणाम कोर्स, वर्ष और छात्र के अपने प्रयास पर निर्भर करते हैं — कोई भी ईमानदार संस्था हर छात्र को नौकरी का वादा नहीं करती।

अगला कदम: कैंपस विज़िट पर प्लेसमेंट सेल से अपनी ब्रांच का ताज़ा सारांश माँगें, या ${PHONE} पर कॉल करें।`,
      mr: `यशोदामध्ये प्लेसमेंट सहाय्य स्वतंत्र ट्रेनिंग अँड प्लेसमेंट सेलमार्फत चालते — कॅम्पस मुलाखती, अ‍ॅप्टिट्यूड व सॉफ्ट-स्किल प्रशिक्षण, औद्योगिक भेटी आणि तज्ज्ञांची व्याख्याने, 300+ उद्योग संपर्कांसह.

कॅम्पसने प्रसिद्ध केलेली आकडेवारी: 105 कंपन्यांची भेट, 2,033 विद्यार्थी प्लेस्ड, सर्वोच्च पॅकेज 22 LPA व सरासरी 4 LPA. आमच्या प्लेसमेंट नोंदींमध्ये Capgemini, Atos, Byju's, Thermax, Burns McDonnell व GaragePlug अशा कंपन्या आहेत. फार्मसीचे पदवीधर उद्योग व अध्यापन क्षेत्रातही जातात.

मी आपल्याशी प्रामाणिक राहीन: निकाल अभ्यासक्रम, वर्ष आणि विद्यार्थ्याच्या स्वतःच्या मेहनतीवर अवलंबून असतात — कोणतीही प्रामाणिक संस्था प्रत्येक विद्यार्थ्याला नोकरीचे वचन देत नाही.

पुढची पायरी: कॅम्पस भेटीत प्लेसमेंट सेलकडून आपल्या शाखेचा अद्ययावत तपशील मागा, किंवा ${PHONE} वर कॉल करा.`,
    },
  },

  /* ---------- documents ---------- */
  {
    id: "documents",
    required: [G.documents],
    priority: 6,
    source: { title: "Admission Process", heading: "Documents to keep ready", url: SITE },
    answers: {
      en: `Here's the folder to prepare before CAP reporting or institute-level admission at Yashoda — originals plus a few photocopies:

• SSC (10th) and HSC (12th) marksheets — or diploma marksheets for direct second year and PG
• Entrance scorecard — MHT-CET / MAH-MBA-CET / MAH-MCA-CET as applicable
• School or college leaving certificate (LC/TC)
• Domicile certificate and nationality proof
• Caste certificate and caste validity, where applicable
• Non-creamy layer certificate, where applicable
• Income certificate — for scholarship, EBC or TFWS benefits
• Aadhaar card, passport-size photographs, and a gap affidavit if there's a study gap

Next step: the office checks this list first at reporting, so put it together now — call ${PHONE} if you're unsure about any one document for your category.`,
      hi: `यशोदा में CAP रिपोर्टिंग या संस्था-स्तरीय प्रवेश से पहले यह फ़ोल्डर तैयार रखें — मूल प्रति और कुछ फोटोकॉपी:

• 10वीं और 12वीं की मार्कशीट — या सीधे दूसरे वर्ष/PG के लिए डिप्लोमा मार्कशीट
• प्रवेश परीक्षा स्कोरकार्ड — MHT-CET / MAH-MBA-CET / MAH-MCA-CET
• स्कूल या कॉलेज छोड़ने का प्रमाणपत्र (LC/TC)
• डोमिसाइल प्रमाणपत्र व राष्ट्रीयता प्रमाण
• जाति प्रमाणपत्र व जाति वैधता, जहाँ लागू हो
• नॉन-क्रीमी लेयर प्रमाणपत्र, जहाँ लागू हो
• आय प्रमाणपत्र — छात्रवृत्ति, EBC या TFWS लाभ के लिए
• आधार कार्ड, पासपोर्ट साइज़ फोटो, और पढ़ाई में अंतराल हो तो गैप एफिडेविट

अगला कदम: रिपोर्टिंग पर ऑफिस सबसे पहले यही सूची जाँचता है, इसलिए अभी तैयार कर लें — किसी दस्तावेज़ पर संदेह हो तो ${PHONE} पर कॉल करें।`,
      mr: `यशोदामध्ये CAP रिपोर्टिंग किंवा संस्थास्तरीय प्रवेशापूर्वी ही फाईल तयार ठेवा — मूळ प्रती व काही झेरॉक्स:

• दहावी व बारावीच्या मार्कशीट — किंवा थेट द्वितीय वर्ष/पदव्युत्तरसाठी डिप्लोमा मार्कशीट
• प्रवेश परीक्षेचे स्कोअरकार्ड — MHT-CET / MAH-MBA-CET / MAH-MCA-CET
• शाळा किंवा महाविद्यालय सोडल्याचा दाखला (LC/TC)
• अधिवास दाखला व राष्ट्रीयत्वाचा पुरावा
• जातीचा दाखला व जात वैधता, लागू असल्यास
• नॉन-क्रिमी लेयर दाखला, लागू असल्यास
• उत्पन्नाचा दाखला — शिष्यवृत्ती, EBC किंवा TFWS लाभासाठी
• आधार कार्ड, पासपोर्ट आकाराचे फोटो, आणि शिक्षणात खंड असल्यास गॅप अ‍ॅफिडेव्हिट

पुढची पायरी: रिपोर्टिंगच्या वेळी ऑफिस हीच यादी आधी तपासते, त्यामुळे आत्ताच जुळवून ठेवा — एखाद्या कागदाबाबत शंका असल्यास ${PHONE} वर कॉल करा.`,
    },
  },

  /* ---------- direct second year ---------- */
  {
    id: "direct_second_year",
    required: [G.dse, G.admission],
    priority: 8,
    source: { title: "Admission Process", heading: "Direct second year", url: SITE },
    answers: {
      en: `Yes — diploma holders can join B.Tech at Yashoda through direct second-year admission, in a branch relevant to the diploma. It's a common path here: our own polytechnic students often continue into the Faculty of Engineering on the same campus.

The admission runs through the State CET Cell's centralised process for direct second year, and the exact eligibility and schedule are published for each year.

Next step: keep all diploma marksheets and your leaving certificate ready, and call ${PHONE} — the office will tell you which branches have direct second-year seats this year.`,
      hi: `जी हाँ — डिप्लोमा धारक यशोदा में सीधे दूसरे वर्ष बी.टेक में प्रवेश ले सकते हैं, डिप्लोमा से संबंधित ब्रांच में। यहाँ यह सामान्य रास्ता है: हमारे अपने पॉलिटेक्निक छात्र अक्सर इसी कैंपस की इंजीनियरिंग फैकल्टी में आगे पढ़ते हैं।

प्रवेश राज्य CET सेल की सीधे दूसरे वर्ष की केंद्रीभूत प्रक्रिया से होता है, और सटीक पात्रता व कार्यक्रम हर साल प्रकाशित होते हैं।

अगला कदम: डिप्लोमा की सभी मार्कशीट और लीविंग सर्टिफिकेट तैयार रखें, और ${PHONE} पर कॉल करें — ऑफिस बताएगा कि इस साल किन ब्रांच में सीधे दूसरे वर्ष की सीटें हैं।`,
      mr: `होय — डिप्लोमाधारक विद्यार्थी यशोदामध्ये थेट द्वितीय वर्ष प्रवेशाने बी.टेकला येऊ शकतात, डिप्लोमाशी संबंधित शाखेत. इथे हा नेहमीचा मार्ग आहे: आमचेच पॉलिटेक्निकचे विद्यार्थी अनेकदा त्याच कॅम्पसवरील अभियांत्रिकी शाखेत पुढे शिकतात.

प्रवेश राज्य CET कक्षाच्या थेट द्वितीय वर्षाच्या केंद्रीभूत प्रक्रियेतून होतो, आणि नेमकी पात्रता व वेळापत्रक दरवर्षी प्रसिद्ध होते.

पुढची पायरी: डिप्लोमाच्या सर्व मार्कशीट व सोडल्याचा दाखला तयार ठेवा, आणि ${PHONE} वर कॉल करा — यावर्षी कोणत्या शाखांमध्ये थेट द्वितीय वर्षाच्या जागा आहेत ते ऑफिस सांगेल.`,
    },
  },

  /* ---------- location ---------- */
  {
    id: "location",
    required: [G.location],
    priority: 5,
    source: { title: "Contact", heading: "Address and how to reach", url: "https://www.yes.edu.in/contact" },
    answers: {
      en: `The campus is at Wadhe, on National Highway 4 (the Pune–Bengaluru highway), Satara, Maharashtra — about 8–9 km from the Satara bus stand on the Pune side. From the bus stand an auto or cab takes 15–20 minutes.

Road distances: Pune about 110 km (2.5–3 hours) · Karad about 50 km (45 minutes) · Kolhapur about 130 km · Sangli about 120 km · Mumbai about 260 km (5–6 hours via the Expressway and NH-4). MSRTC buses connect Satara with all major Maharashtra cities, and the nearest airport is Pune (PNQ).

Next step: if you're planning to visit, call ${PHONE} first and the office will fix a time and arrange a campus tour — laboratories, library, hostels and the canteen.`,
      hi: `कैंपस वाढे में है, राष्ट्रीय राजमार्ग 4 (पुणे–बेंगलुरु हाईवे) पर, सातारा, महाराष्ट्र — सातारा बस स्टैंड से पुणे की ओर लगभग 8–9 किमी। बस स्टैंड से ऑटो या कैब 15–20 मिनट लेती है।

सड़क दूरी: पुणे लगभग 110 किमी (2.5–3 घंटे) · कराड लगभग 50 किमी (45 मिनट) · कोल्हापुर लगभग 130 किमी · सांगली लगभग 120 किमी · मुंबई लगभग 260 किमी (एक्सप्रेसवे व NH-4 से 5–6 घंटे)। MSRTC बसें सातारा को महाराष्ट्र के सभी बड़े शहरों से जोड़ती हैं, और निकटतम हवाई अड्डा पुणे (PNQ) है।

अगला कदम: आने की योजना हो तो पहले ${PHONE} पर कॉल करें — ऑफिस समय तय करेगा और कैंपस टूर कराएगा: प्रयोगशालाएँ, लाइब्रेरी, हॉस्टेल व कैंटीन।`,
      mr: `कॅम्पस वाढे येथे आहे, राष्ट्रीय महामार्ग 4 (पुणे–बेंगळुरू महामार्ग) वर, सातारा, महाराष्ट्र — सातारा बस स्थानकापासून पुण्याच्या दिशेने सुमारे 8–9 किमी. बस स्थानकावरून रिक्षा किंवा कॅबने 15–20 मिनिटे लागतात.

रस्त्याने अंतर: पुणे सुमारे 110 किमी (2.5–3 तास) · कराड सुमारे 50 किमी (45 मिनिटे) · कोल्हापूर सुमारे 130 किमी · सांगली सुमारे 120 किमी · मुंबई सुमारे 260 किमी (एक्स्प्रेसवे व NH-4 मार्गे 5–6 तास). MSRTC बसेस सातारा महाराष्ट्रातील सर्व प्रमुख शहरांशी जोडतात, आणि जवळचे विमानतळ पुणे (PNQ) आहे.

पुढची पायरी: येण्याचा विचार असेल तर आधी ${PHONE} वर कॉल करा — ऑफिस वेळ ठरवेल आणि कॅम्पस फेरी घडवेल: प्रयोगशाळा, ग्रंथालय, वसतिगृहे व कॅन्टीन.`,
    },
  },

  /* ---------- contact ---------- */
  {
    id: "contact",
    required: [G.contact],
    priority: 5,
    source: { title: "Contact", heading: "Admission office", url: "https://www.yes.edu.in/contact" },
    answers: {
      en: `You can reach the Yashoda admission office directly:

• Phone and WhatsApp — ${PHONE}
• Email — yspmadmin@yes.edu.in
• Campus — YSPM's Yashoda Technical Campus, Wadhe, NH-4, Satara, Maharashtra

The office handles everything: course and intake queries, eligibility for your category, the FRA-approved fee structure, hostel seats, bus routes and scholarship paperwork.

Next step: calling ahead is worth it, especially on weekends and during the CAP season — they'll fix a time and show you the campus properly. You can also tap the WhatsApp button below and continue this conversation with the office directly.`,
      hi: `आप यशोदा एडमिशन ऑफिस से सीधे संपर्क कर सकते हैं:

• फ़ोन और WhatsApp — ${PHONE}
• ईमेल — yspmadmin@yes.edu.in
• कैंपस — YSPM's यशोदा टेक्निकल कैंपस, वाढे, NH-4, सातारा, महाराष्ट्र

ऑफिस सब कुछ देखता है: कोर्स व सीटों की जानकारी, आपकी श्रेणी की पात्रता, FRA-मंज़ूर फीस संरचना, हॉस्टेल सीटें, बस रूट और छात्रवृत्ति के कागज़ात।

अगला कदम: पहले से कॉल करना बेहतर रहता है, खासकर वीकेंड और CAP सीज़न में — वे समय तय करके कैंपस ठीक से दिखाएँगे। आप नीचे WhatsApp बटन दबाकर यह बातचीत सीधे ऑफिस के साथ भी जारी रख सकते हैं।`,
      mr: `आपण यशोदा ऍडमिशन ऑफिसशी थेट संपर्क साधू शकता:

• फोन व WhatsApp — ${PHONE}
• ईमेल — yspmadmin@yes.edu.in
• कॅम्पस — YSPM चे यशोदा टेक्निकल कॅम्पस, वाढे, NH-4, सातारा, महाराष्ट्र

ऑफिस सर्व काही पाहते: अभ्यासक्रम व जागांची माहिती, आपल्या प्रवर्गाची पात्रता, FRA-मंजूर फी रचना, वसतिगृहाच्या जागा, बस मार्ग आणि शिष्यवृत्तीची कागदपत्रे.

पुढची पायरी: आधी फोन करणे उपयुक्त ठरते, विशेषतः शनिवार-रविवार व CAP हंगामात — ते वेळ ठरवून कॅम्पस व्यवस्थित दाखवतील. खालील WhatsApp बटण दाबून आपण हा संवाद थेट ऑफिससोबतही सुरू ठेवू शकता.`,
    },
  },

  /* ---------- accreditation ---------- */
  {
    id: "accreditation",
    required: [G.accreditation],
    priority: 4,
    source: { title: "About the campus", heading: "Approvals and accreditation", url: SITE },
    answers: {
      en: `Yashoda Technical Campus has been conferred Autonomous Status by the UGC, and is accredited by NAAC with a 'B+' grade, with NBA accreditation for programmes including CSE, Electrical, MCA and D.Pharmacy.

Approvals and affiliations:
• Approved by AICTE, New Delhi and DTE, Government of Maharashtra
• Pharmacy programmes approved by PCI, New Delhi
• B.Tech, M.Tech, B.Pharm, M.Pharm, Pharm D — DBATU, Lonere
• MBA, MCA — Shivaji University, Kolhapur
• Polytechnic diploma and D.Pharmacy — MSBTE, Mumbai

The campus was founded by YSPM in 2009 and has over 5,000 students today.

Next step: the approval letters and NAAC/NBA certificates are published on yes.edu.in, and the office on ${PHONE} can walk you through what autonomy means for your degree.`,
      hi: `यशोदा टेक्निकल कैंपस को UGC द्वारा स्वायत्त दर्जा मिला है, और NAAC से 'B+' ग्रेड मान्यता प्राप्त है; CSE, इलेक्ट्रिकल, MCA व डी.फार्मसी जैसे कार्यक्रमों को NBA मान्यता है।

अनुमोदन व संबद्धता:
• AICTE, नई दिल्ली और DTE, महाराष्ट्र सरकार द्वारा अनुमोदित
• फार्मसी कार्यक्रम PCI, नई दिल्ली द्वारा अनुमोदित
• बी.टेक, एम.टेक, बी.फार्म, एम.फार्म, फार्म डी — DBATU, लोणेरे
• MBA, MCA — शिवाजी विश्वविद्यालय, कोल्हापुर
• पॉलिटेक्निक डिप्लोमा व डी.फार्मसी — MSBTE, मुंबई

कैंपस की स्थापना YSPM ने 2009 में की थी और आज यहाँ 5,000 से अधिक छात्र हैं।

अगला कदम: अनुमोदन पत्र और NAAC/NBA प्रमाणपत्र yes.edu.in पर प्रकाशित हैं, और ${PHONE} पर ऑफिस बताएगा कि स्वायत्तता का आपकी डिग्री के लिए क्या अर्थ है।`,
      mr: `यशोदा टेक्निकल कॅम्पसला UGC कडून स्वायत्त दर्जा मिळाला आहे, आणि NAAC कडून 'B+' श्रेणी मानांकन आहे; CSE, इलेक्ट्रिकल, MCA व डी.फार्मसी अशा अभ्यासक्रमांना NBA मानांकन आहे.

मान्यता व संलग्नता:
• AICTE, नवी दिल्ली आणि DTE, महाराष्ट्र शासन यांची मान्यता
• फार्मसी अभ्यासक्रमांना PCI, नवी दिल्लीची मान्यता
• बी.टेक, एम.टेक, बी.फार्म, एम.फार्म, फार्म डी — DBATU, लोणेरे
• MBA, MCA — शिवाजी विद्यापीठ, कोल्हापूर
• पॉलिटेक्निक डिप्लोमा व डी.फार्मसी — MSBTE, मुंबई

कॅम्पसची स्थापना YSPM ने 2009 मध्ये केली आणि आज येथे 5,000 पेक्षा अधिक विद्यार्थी आहेत.

पुढची पायरी: मान्यता पत्रे व NAAC/NBA प्रमाणपत्रे yes.edu.in वर प्रसिद्ध आहेत, आणि ${PHONE} वर ऑफिस स्वायत्ततेचा आपल्या पदवीसाठी काय अर्थ आहे ते समजावून सांगेल.`,
    },
  },
];

/* ====================================================================
   CONVERSATION THREADS
   Each answer ends with a natural question ("would you like the document
   list?"). These maps make that real: `next` powers the tappable chips
   under the answer, and `yes` is what a bare "yes / हो / हाँ / haan"
   resolves to. So a parent can go admissions → documents → eligibility →
   scholarships without the LLM being touched once.
   ==================================================================== */

export const INTENT_LABELS: Record<string, Record<Lang, string>> = {
  admissions: { en: "Admission process", hi: "एडमिशन प्रक्रिया", mr: "प्रवेश प्रक्रिया" },
  courses: { en: "All courses", hi: "सभी कोर्स", mr: "सर्व अभ्यासक्रम" },
  engineering: { en: "Engineering", hi: "इंजीनियरिंग", mr: "अभियांत्रिकी" },
  pharmacy: { en: "Pharmacy", hi: "फार्मसी", mr: "फार्मसी" },
  polytechnic: { en: "Polytechnic", hi: "पॉलिटेक्निक", mr: "पॉलिटेक्निक" },
  mbamca: { en: "MBA / MCA", hi: "MBA / MCA", mr: "MBA / MCA" },
  eligibility: { en: "Eligibility", hi: "पात्रता", mr: "पात्रता" },
  fees: { en: "Fees", hi: "फीस", mr: "फी" },
  hostel: { en: "Hostel", hi: "हॉस्टेल", mr: "वसतिगृह" },
  girls_hostel: { en: "Girls hostel", hi: "लड़कियों का हॉस्टेल", mr: "मुलींचे वसतिगृह" },
  hostel_fees: { en: "Hostel fees", hi: "हॉस्टेल फीस", mr: "वसतिगृह फी" },
  mess: { en: "Mess & food", hi: "मेस व भोजन", mr: "मेस व जेवण" },
  transport: { en: "Bus facility", hi: "बस सुविधा", mr: "बस सुविधा" },
  scholarships: { en: "Scholarships", hi: "छात्रवृत्ति", mr: "शिष्यवृत्ती" },
  placements: { en: "Placements", hi: "प्लेसमेंट", mr: "प्लेसमेंट" },
  documents: { en: "Documents needed", hi: "ज़रूरी दस्तावेज़", mr: "लागणारी कागदपत्रे" },
  direct_second_year: { en: "Direct second year", hi: "सीधे दूसरा वर्ष", mr: "थेट द्वितीय वर्ष" },
  location: { en: "How to reach", hi: "कैसे पहुँचें", mr: "कसे पोहोचायचे" },
  contact: { en: "Contact the office", hi: "ऑफिस से संपर्क", mr: "ऑफिसशी संपर्क" },
  accreditation: { en: "NAAC / NBA status", hi: "NAAC / NBA दर्जा", mr: "NAAC / NBA दर्जा" },
};

/** `yes` = what a bare "yes" continues to · `next` = the chips shown */
export const THREADS: Record<string, { yes: string; next: string[] }> = {
  admissions: { yes: "documents", next: ["documents", "eligibility", "fees"] },
  courses: { yes: "engineering", next: ["engineering", "pharmacy", "polytechnic", "mbamca"] },
  engineering: { yes: "eligibility", next: ["eligibility", "fees", "placements", "direct_second_year"] },
  pharmacy: { yes: "eligibility", next: ["eligibility", "fees", "placements"] },
  polytechnic: { yes: "direct_second_year", next: ["direct_second_year", "eligibility", "fees"] },
  mbamca: { yes: "eligibility", next: ["eligibility", "fees", "placements"] },
  eligibility: { yes: "documents", next: ["documents", "admissions", "fees"] },
  fees: { yes: "scholarships", next: ["scholarships", "hostel_fees", "documents"] },
  hostel: { yes: "hostel_fees", next: ["hostel_fees", "mess", "transport"] },
  girls_hostel: { yes: "hostel_fees", next: ["hostel_fees", "mess", "location"] },
  hostel_fees: { yes: "mess", next: ["mess", "scholarships", "contact"] },
  mess: { yes: "hostel", next: ["hostel", "hostel_fees", "transport"] },
  transport: { yes: "location", next: ["location", "hostel", "contact"] },
  scholarships: { yes: "documents", next: ["documents", "fees", "contact"] },
  placements: { yes: "courses", next: ["courses", "engineering", "contact"] },
  documents: { yes: "eligibility", next: ["eligibility", "admissions", "scholarships"] },
  direct_second_year: { yes: "documents", next: ["documents", "engineering", "fees"] },
  location: { yes: "transport", next: ["transport", "contact", "hostel"] },
  contact: { yes: "location", next: ["location", "admissions", "documents"] },
  accreditation: { yes: "courses", next: ["courses", "placements", "admissions"] },
};

/** Chips shown when we have no thread context (handoff, LLM, decline). */
export const DEFAULT_NEXT = ["admissions", "courses", "fees", "hostel", "scholarships", "placements"];

export interface FollowUp {
  intent: string;
  label: string;
}

export function followUpsFor(intentId: string, lang: Lang): FollowUp[] {
  const ids = THREADS[intentId]?.next ?? DEFAULT_NEXT;
  return ids
    .filter((id) => byId.has(id))
    .map((id) => ({ intent: id, label: INTENT_LABELS[id]?.[lang] ?? INTENT_LABELS[id]?.en ?? id }));
}

/** "yes, please" in the four ways a Satara parent actually types it. */
const AFFIRM = /^\s*(yes|yess+|yeah|yep|yup|ya|ok(ay)?|sure|please|pls|plz|yes\s*please|send|share|show|tell\s*me|go\s*on|continue|list|haan?|han|ha+n?|jee?|ji\s*haan?|bilkul|batao|bata\s*do|zaroor|sangа|sanga|नक्की|हो|होय|हा|हाँ|हां|जी|जी\s*हाँ|हो\s*ना|चालेल|सांगा|सांग|दाखवा|बताओ|बता\s*दीजिए|बताइए|ज़रूर|जरूर|पाठवा|हवी|हवे|हवं)\s*[!।.?,]*\s*$/i;

/** "no, thanks" — so we don't push a follow-up the family didn't ask for. */
const NEGATE = /^\s*(no|nope|nah|not\s*now|later|nahi+|nahin|नको|नाही|नहीं|ना)\s*[!।.?,]*\s*$/i;

export function isAffirmative(text: string): boolean {
  return AFFIRM.test(String(text || ""));
}
export function isNegative(text: string): boolean {
  return NEGATE.test(String(text || ""));
}

/** Reply when a family says "no thanks" mid-thread. */
export const DECLINE_THREAD: Record<Lang, string> = {
  en: "Of course. I'm here whenever you need — ask me anything else about Yashoda, or tap a topic below. If you'd rather speak to a person, the admission office is on +91 91722 20775.",
  hi: "बिल्कुल। जब ज़रूरत हो, मैं यहीं हूँ — यशोदा के बारे में कुछ और पूछिए, या नीचे कोई विषय चुनिए। अगर किसी व्यक्ति से बात करनी हो, एडमिशन ऑफिस +91 91722 20775 पर उपलब्ध है।",
  mr: "नक्कीच. गरज असेल तेव्हा मी इथेच आहे — यशोदाबद्दल आणखी काही विचारा, किंवा खालील विषय निवडा. व्यक्तीशी बोलायचे असल्यास ऍडमिशन ऑफिस +91 91722 20775 वर उपलब्ध आहे.",
};

/* ---------------- matching ---------------- */

const byId = new Map(CANNED.map((c) => [c.id, c]));
export function cannedById(id: string): CannedAnswer | undefined {
  return byId.get(id);
}

function groupHit(group: string[], tokens: Set<string>): boolean {
  for (const g of group) if (tokens.has(g)) return true;
  return false;
}

export interface CannedMatch {
  entry: CannedAnswer;
  score: number;
}

/**
 * Escape hatch. A canned answer must never *stand in* for a question it
 * doesn't actually answer. "Who is the HOD of civil engineering?" contains
 * "engineering", but the engineering FAQ has no HOD name in it — so these
 * questions skip the answer book and go to retrieval / the office instead.
 *
 * Covers: people and names · exact dates and deadlines · timings · counts
 * the content doesn't hold · "how many marks / what rank" style asks.
 */
const NEEDS_SPECIFICS =
  /\b(who|whom|whose|name of|hod|h\.o\.d|head of|principal|director|dean|professor|faculty member|teacher|warden|coordinator|in charge|incharge)\b|\b(when|what time|timing|timings|schedule|last date|deadline|due date|cut\s*-?\s*off|cutoff|merit list|rank|percentile|how many marks|how much marks|minimum marks|passing marks)\b|कोण आहे|कोण असेल|नाव काय|प्राचार्य|विभागप्रमुख|कधी आहे|शेवटची तारीख|वेळ काय|कट\s*ऑफ|किती गुण|कितवा नंबर|कौन है|कौन हैं|नाम क्या|प्राचार्य कौन|विभागाध्यक्ष|कब है|आखिरी तारीख|समय क्या|कितने अंक|कितने मार्क/i;

export function needsSpecifics(text: string): boolean {
  return NEEDS_SPECIFICS.test(String(text || ""));
}

/**
 * Deterministic intent match. Returns the most specific canned entry whose
 * required concept groups are all present in the (synonym-expanded) question.
 * Specificity wins: "hostel fees" beats both "hostel" and "fees".
 */
export function matchCanned(query: string): CannedMatch | null {
  // Asking for a person, a date, a timing or a cut-off? The answer book
  // cannot honestly serve that — let retrieval or the office handle it.
  if (needsSpecifics(query)) return null;

  const tokens = new Set(expandTokens(tokenize(query)));
  if (tokens.size === 0) return null;

  let best: CannedMatch | null = null;
  for (const entry of CANNED) {
    let ok = true;
    for (const group of entry.required) {
      if (!groupHit(group, tokens)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    let score = 10 * entry.required.length;
    for (const group of entry.boost ?? []) if (groupHit(group, tokens)) score += 3;
    score += (entry.priority ?? 0) * 0.1;

    if (!best || score > best.score) best = { entry, score };
  }
  return best;
}
