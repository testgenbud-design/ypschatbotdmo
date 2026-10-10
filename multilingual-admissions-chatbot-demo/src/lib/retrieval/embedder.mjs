/**
 * embedder.mjs — deterministic local embedder shared by scripts/ingest.js
 * and the /api/chat route handler.
 *
 * Why local hashing instead of an embeddings API: the demo must run with a
 * single secret (OPENROUTER_API_KEY), ingest must work offline, and the
 * knowledge base is small (~20 chunks). A signed hashing projection of
 * word + character n-grams, with a multilingual query-expansion lexicon,
 * gives stable, inspectable retrieval across English / हिन्दी / मराठी /
 * Hinglish at zero cost and millisecond latency.
 */

export const DIM = 768;

const STOPWORDS = new Set(
  (
    "the a an of for in on at to and or with from by is are was were be been do does did can could will would shall should may might must " +
    "how what when where which who whom why that this these those it its as if than then so such not no yes i we you he she they them our your my me us him her " +
    "hai hain ho hone hoga hogi ke ki ka ko me mein par se aur ya ek bhi koi toh nahi yes ji much many " +
    "आहे आहेत असते आणि व चा ची चे हा ही हे तो ती ते का या ये मध्ये साठी मधील बद्दल की कोणते मला आम्हाला असेल काय किती कसे केव्हा तरी देखील एक " +
    "है हैं हो होगा होगी के की का को में पर से और यह वह एक भी क्या कोई तो नहीं जी था थी थे गा गी गे कितना कितनी कितने लिए"
  ).split(/\s+/)
);

/** token → semantic neighbours (English / हिन्दी / मराठी / Hinglish bridge) */
export const SYNONYMS = {
  admissions: ["admission"], प्रवेश: ["admission", "admissions"], ऍडमिशन: ["admission"], एडमिशन: ["admission"], दाखिला: ["admission"],
  admission: ["admissions", "pravesh"], pravesh: ["admission"], दाखिले: ["admission"],
  fee: ["fees"], fees: ["fee", "फी", "शुल्क"], फी: ["fees", "fee", "फीस"], फीस: ["fees", "fee", "फी"], शुल्क: ["fees", "fee"],
  cost: ["fees", "fee"], paise: ["fees", "money"], पैसे: ["money", "fees"],
  seat: ["seats", "intake"], seats: ["seat", "intake", "जागा"], intake: ["seats", "capacity", "जागा"], जागा: ["seats", "intake"], सीटें: ["seats", "intake"], सीट: ["seat", "intake"],
  क्षमता: ["capacity", "intake"], capacity: ["intake", "क्षमता"],
  पात्रता: ["eligibility", "eligible", "criteria"], eligibility: ["eligible", "criteria", "पात्रता"], eligible: ["eligibility"],
  हॉस्टेल: ["hostel", "accommodation", "वसतिगृह"], hostel: ["accommodation", "वसतिगृह", "हॉस्टेल", "hostels"], hostels: ["hostel", "accommodation"],
  वसतिगृह: ["hostel", "accommodation", "hostels", "हॉस्टेल"], छात्रावास: ["hostel", "हॉस्टेल"], राहणे: ["stay", "hostel"], rehne: ["stay", "hostel", "accommodation"], stay: ["hostel", "accommodation"],
  मुलींचे: ["girls", "ladies"], girls: ["ladies", "मुली"], मुली: ["girls"], boys: ["मुले"], मुले: ["boys"],
  बस: ["bus", "transport", "वाहतूक"], bus: ["transport", "बस", "buses"], buses: ["bus", "transport"], वाहतूक: ["transport", "bus"], transport: ["bus", "transportation", "वाहतूक", "बस"], transportation: ["transport", "bus"],
  शिष्यवृत्ती: ["scholarship", "scholarships", "ebc", "mahadbt"], छात्रवृत्ति: ["scholarship", "शिष्यवृत्ती"], scholarship: ["scholarships", "शिष्यवृत्ती", "ebc", "freeship"], scholarships: ["scholarship", "शिष्यवृत्ती"],
  स्कॉलरशिप: ["scholarship", "शिष्यवृत्ती"], ebc: ["scholarship", "concession", "tfws", "ईबीसी"], ईबीसी: ["ebc", "scholarship", "concession"], tfws: ["tuition", "waiver", "scholarship"], mahadbt: ["scholarship", "महाडीबीटी"], freeship: ["scholarship"],
  नोकरी: ["placement", "placements", "job", "jobs", "career"], नोकऱ्या: ["jobs", "placement"], placement: ["placements", "job", "career", "package", "नोकरी"], placements: ["placement", "campus", "interviews", "package", "companies"],
  प्लेसमेंट: ["placement", "placements", "job"], नौकरी: ["job", "placement", "नोकरी"], job: ["jobs", "placement", "career", "नोकरी"], jobs: ["job", "placement"], naukri: ["job", "placement", "नोकरी"],
  package: ["salary", "lpa", "placement", "पगार"], salary: ["package", "lpa", "पगार"], पगार: ["salary", "package", "lpa"], lpa: ["package", "salary"], पॅकेज: ["package", "salary"], companies: ["recruiters", "placement"], कंपन्या: ["companies", "recruiters"],
  दस्तऐवज: ["documents", "document", "certificate"], कागदपत्रे: ["documents", "document"], दस्तावेज़: ["documents", "document"], कागजात: ["documents"], documents: ["document", "certificate", "दस्तऐवज"], document: ["documents", "certificate"],
  कोर्स: ["course", "courses", "programme"], course: ["courses", "programme", "branch"], courses: ["course", "programmes", "programme", "अभ्यासक्रम"], programme: ["program", "course"], program: ["programme", "course"],
  अभ्यासक्रम: ["courses", "course", "curriculum", "syllabus"], syllabus: ["curriculum", "अभ्यासक्रम", "courses"], curriculum: ["syllabus", "अभ्यासक्रम"],
  branch: ["branches", "course", "विभाग"], branches: ["branch", "course"], ब्रांच: ["branch", "course"],
  engineering: ["btech", "tech", "इंजिनिअरिंग", "अभियांत्रिकी"], इंजिनिअरिंग: ["engineering", "btech"], अभियांत्रिकी: ["engineering", "btech"], btech: ["engineering", "tech", "बीटेक"], बीटेक: ["btech", "engineering"], tech: ["btech", "engineering"],
  mtech: ["tech", "एमटेक"], एमटेक: ["mtech"],
  pharmacy: ["pharma", "फार्मसी"], pharma: ["pharmacy", "फार्मसी"], फार्मसी: ["pharmacy", "pharma"], bpharm: ["pharmacy", "bachelor"], dpharm: ["diploma", "pharmacy"], mpharm: ["master", "pharmacy"],
  polytechnic: ["diploma", "poly", "पॉलिटेक्निक"], poly: ["polytechnic", "diploma"], डिप्लोमा: ["diploma", "polytechnic"], diploma: ["polytechnic", "डिप्लोमा"], पॉलिटेक्निक: ["polytechnic", "diploma"],
  mba: ["management", "एमबीए"], एमबीए: ["mba", "management"], management: ["mba", "व्यवस्थापन"], mca: ["computer", "application", "एमसीए"], एमसीए: ["mca"], bba: ["bachelor", "management"], bca: ["bachelor", "computer", "application"],
  cse: ["computer", "science", "संगणक"], संगणक: ["computer", "cse"], संगणकीय: ["computer", "cse"], computer: ["cse", "computing", "संगणक"], computers: ["computer", "cse"],
  mechanical: ["mech", "यांत्रिकी"], यांत्रिकी: ["mechanical"], civil: ["सिव्हिल", "सिविल"], सिव्हिल: ["civil"], सिविल: ["civil"], electrical: ["विद्युत"], विद्युत: ["electrical"], electronics: ["entc", "इलेक्ट्रॉनिक्स"],
  ai: ["artificial", "intelligence", "एआय"], artificial: ["ai", "intelligence"], कृत्रिम: ["artificial", "ai"],
  mechatronics: ["mechatronic", "mechanical"], robotics: ["robot", "automation", "रोबोटिक्स"], रोबोटिक्स: ["robotics", "automation"],
  मेस: ["mess", "dining", "canteen", "food"], mess: ["dining", "canteen", "meals", "food", "मेस"], जेवण: ["food", "mess", "dining", "meals"], जेवायला: ["food", "mess", "meals"],
  canteen: ["food", "mess", "dining", "जेवण", "मेस"], food: ["meals", "mes", "canteen", "जेवण"], meals: ["food", "dining", "जेवण"], dining: ["mess", "meals", "मेस"],
  रॅगिंग: ["ragging", "grievance"], ragging: ["anti", "रॅगिंग", "grievance"], तक्रार: ["grievance", "complaint"], grievance: ["complaint", "तक्रार", "ragging"], complaint: ["grievance", "तक्रार"],
  पत्ता: ["address", "location"], address: ["location", "wadhe", "satara", "पत्ता"], location: ["address", "wadhe", "satara", "पत्ता", "reach"], येथे: ["location", "campus"],
  संपर्क: ["contact", "phone", "call"], contact: ["phone", "email", "call", "संपर्क", "office"], phone: ["call", "contact", "फोन", "संपर्क"], फोन: ["phone", "contact", "संपर्क"], नंबर: ["number", "phone", "contact"], number: ["phone", "contact", "नंबर"],
  whatsapp: ["chat", "व्हॉट्सअॅप"], व्हॉट्सअॅप: ["whatsapp"], व्हॉट्सऍप: ["whatsapp"],
  कट: ["cut", "merit", "cutoff"], cutoff: ["cut", "merit", "कट"], cut: ["cutoff", "merit"], मेरिट: ["merit", "cutoff"], merit: ["cutoff", "मेरिट"],
  गुण: ["marks", "score", "percentage"], marks: ["score", "percentage", "merit", "गुण"], टक्के: ["percentage", "marks"], percentage: ["marks", "percent", "टक्के"], percent: ["percentage", "marks"], score: ["marks", "गुण"],
  कॉलेज: ["college", "campus"], college: ["campus", "yashoda", "institute", "कॉलेज"], कॅम्पस: ["campus", "college"], campus: ["yashoda", "कॅम्पस", "facilities", "green"],
  सुविधा: ["facility", "facilities"], सुविधाएं: ["facilities"], facility: ["facilities", "सुविधा"], facilities: ["facility", "सुविधा"],
  lab: ["laboratory", "labs", "प्रयोगशाळा"], labs: ["laboratories", "laboratory", "प्रयोगशाळा"], laboratory: ["labs", "प्रयोगशाळा"], प्रयोगशाळा: ["laboratory", "labs", "lab"],
  लायब्ररी: ["library", "books"], ग्रंथालय: ["library", "books"], library: ["books", "ग्रंथालय", "लायब्ररी"],
  सातारा: ["satara"], satara: ["सातारा", "wadhe"], वाढे: ["wadhe"], wadhe: ["वाढे", "satara", "nh4"], पुणे: ["pune"], pune: ["पुणे"], मुंबई: ["mumbai"], mumbai: ["मुंबई"], कोल्हापूर: ["kolhapur"], kolhapur: ["कोल्हापूर"], कराड: ["karad"], karad: ["कराड"],
  autonomous: ["autonomy", "स्वायत्त"], स्वायत्त: ["autonomous"], naac: ["नॅक", "accreditation", "grade"], नॅक: ["naac", "accreditation"], nba: ["एनबीए", "accreditation"], accreditation: ["accredited", "naac", "nba"], accredited: ["accreditation"],
  kitni: ["fees", "cost", "किती"], kitna: ["fees", "cost", "कितना"], kaise: ["how", "कसे"], kya: ["what", "काय"], milegi: ["available", "get", "मिळते"], milega: ["available", "get", "मिळते"], milta: ["available", "get", "मिळते"], batao: ["tell", "सांगा"], chahiye: ["required", "need", "हवे"], hai: ["is", "आहे"],
  टेक: ["btech", "engineering", "tech"], बीटेकला: ["btech", "engineering"], एमटेकला: ["mtech"],
  मुलींसाठी: ["girls"], मुलांसाठी: ["boys"], मुलींना: ["girls"], मुलांना: ["boys"], मुलींच्या: ["girls"], मुलांच्या: ["boys"],
  मिळते: ["available", "get"], मिळेल: ["available", "get"], मिळतात: ["available", "get"], मिळाले: ["available", "got"], उपलब्ध: ["available"],
  चाहिए: ["required", "need"], हवे: ["required", "need"], लागते: ["required"], लागतात: ["required"], लागणारी: ["required"],
  ऑस्टेल: ["hostel", "हॉस्टेल"], होस्टेल: ["hostel", "हॉस्टेल"], वसतिगृहात: ["hostel", "वसतिगृह"], वसतिगृहाची: ["hostel", "वसतिगृह"], वसतिगृहातील: ["hostel", "वसतिगृह"],
  फीची: ["fees"], फीचा: ["fees"], प्रोसेस: ["process", "प्रक्रिया"], प्रक्रिया: ["process", "procedure"], process: ["प्रक्रिया", "procedure"], प्रोसीजर: ["procedure", "process"],
  कॅप: ["cap", "rounds", "centralized"], cap: ["rounds", "centralized", "cet"], rounds: ["cap", "round"], round: ["rounds", "cap"], सीटी: ["cet"],
  दुसऱ्या: ["direct", "second", "year"], दुसरे: ["direct", "second"], सेकंड: ["second"], second: ["direct", "दुसऱ्या"], year: ["वर्ष"], वर्ष: ["year"], direct: ["second", "दुसऱ्या"],
  फॉर्म: ["form", "apply"], form: ["apply", "फॉर्म"], apply: ["application", "फॉर्म", "अर्ज"], अर्ज: ["application", "apply", "फॉर्म"], application: ["apply", "अर्ज"],
  सायबर: ["cyber", "security"], cyber: ["security", "सायबर"], cloud: ["computing", "क्लाउड"], क्लाउड: ["cloud", "computing"],
  यशोदा: ["yashoda"], yashoda: ["यशोदा", "ytc", "yspm"], ytc: ["yashoda"], yspm: ["yashoda", "यशोदा"],
  घरी: ["home", "distance"], distance: ["far", "अंतर"], अंतर: ["distance"], लांब: ["far", "distance"], far: ["distance", "लांब"], जवळ: ["near"], near: ["जवळ"],
  विद्यार्थी: ["students", "student"], student: ["student", "विद्यार्थी"], students: ["student", "विद्यार्थी"],
  विभाग: ["department", "branch"], department: ["विभाग", "department"],
  पार्किंग: ["parking"], parking: ["पार्किंग"],
};

// remove any accidental undefined entries
for (const k of Object.keys(SYNONYMS)) if (!SYNONYMS[k]) delete SYNONYMS[k];

export function tokenize(text) {
  // \p{M} is essential: Devanagari vowel signs (matras), virama and anusvara
  // are Unicode combining marks — without them words like "पात्रता" split apart.
  const m = String(text || "").toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu);
  if (!m) return [];
  const out = [];
  for (const t of m) {
    if (t.length < 2 || STOPWORDS.has(t)) continue;
    out.push(t);
  }
  return out;
}

/** Query-side expansion: append semantic neighbours (weight comes from re-tokenization). */
export function expandTokens(tokens) {
  const out = [...tokens];
  const seen = new Set(out);
  for (const t of tokens) {
    const ex = SYNONYMS[t];
    if (!ex) continue;
    for (const e of ex) {
      if (e && !seen.has(e)) {
        seen.add(e);
        out.push(e);
      }
    }
  }
  return out;
}

function fnv1a(str, seed) {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Embed text into a fixed-size vector via signed feature hashing of
 * word unigrams (w2), word bigrams (w1.5) and padded char trigrams (w1).
 * Returns an L2-normalized number[DIM].
 */
export function embed(text, { expand = false } = {}) {
  let tokens = tokenize(text);
  if (expand) tokens = expandTokens(tokens);
  const v = new Float64Array(DIM);

  const add = (feat, w) => {
    const idx = fnv1a(feat + "#i", 0x811c9dc5) % DIM;
    const sign = (fnv1a(feat + "#s", 0x9e3779b9) & 1) === 0 ? 1 : -1;
    v[idx] += sign * w;
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    add("w:" + t, 2.0);
    if (i + 1 < tokens.length) add("b:" + t + " " + tokens[i + 1], 1.5);
    const padded = "_" + t + "_";
    for (let j = 0; j + 3 <= padded.length; j++) {
      add("c:" + padded.slice(j, j + 3), 1.0);
    }
  }

  // sublinear compression, then L2 normalize
  let norm = 0;
  for (let i = 0; i < DIM; i++) {
    const x = v[i];
    const y = x === 0 ? 0 : Math.sign(x) * Math.log1p(Math.abs(x));
    v[i] = y;
    norm += y * y;
  }
  norm = Math.sqrt(norm) || 1;
  const out = new Array(DIM);
  for (let i = 0; i < DIM; i++) out[i] = v[i] / norm;
  return out;
}
