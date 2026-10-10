import { embed, tokenize, expandTokens, SYNONYMS } from "./embedder.mjs";

export const ANSWER_THRESHOLD = 0.21;

const K1 = 1.2;
const B = 0.75;
const statsCache = new WeakMap();

/** Corpus statistics (df, avgdl) computed once per loaded KB. */
function corpusStats(chunks) {
  let s = statsCache.get(chunks);
  if (s) return s;
  const df = new Map();
  let dlTotal = 0;
  for (const c of chunks) {
    const toks = c._toks || (c._toks = (c.tokens || tokenize(`${c.title} ${c.text}`)));
    dlTotal += toks.length;
    for (const t of new Set(toks)) df.set(t, (df.get(t) || 0) + 1);
  }
  s = { df, N: chunks.length, avgdl: dlTotal / Math.max(1, chunks.length) };
  statsCache.set(chunks, s);
  return s;
}

function idf(stats, t) {
  const df = stats.df.get(t) || 0;
  return Math.log(1 + (stats.N - df + 0.5) / (df + 0.5));
}

/** char-bigram Dice coefficient for tolerant Devanagari/spelling matching */
function dice(a, b) {
  if (a === b) return 1;
  if (a.length < 3 || b.length < 3) return 0;
  const grams = new Set();
  for (let i = 0; i + 2 <= a.length; i++) grams.add(a.slice(i, i + 2));
  let hit = 0;
  for (let i = 0; i + 2 <= b.length; i++) if (grams.has(b.slice(i, i + 2))) hit++;
  return (2 * hit) / (a.length - 1 + b.length - 1);
}

function commonPrefix(a, b) {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n;
}

/**
 * Match quality of query token t against document token u: 0..1.
 * exact 1 · long shared prefix 0.85 · fuzzy (Dice) 0.75
 */
function matchQuality(t, u) {
  if (t === u) return 1;
  if (t.length >= 6 && u.length >= 6 && commonPrefix(t, u) >= 6) return 0.85;
  if (Math.abs(t.length - u.length) <= 3 && t[0] === u[0] && dice(t, u) >= 0.7) return 0.75;
  return 0;
}

/**
 * Hybrid score: BM25-lite over raw chunk tokens (exact + fuzzy matching,
 * query-side synonym expansion) blended with the hashed-embedding cosine,
 * plus a small title/programme tag boost. Also returns term coverage so the
 * caller can demand real topical overlap before trusting the score.
 */
export function retrieve(query, chunks, k = 5) {
  const stats = corpusStats(chunks);
  const rawTokens = tokenize(query);
  const expanded = expandTokens(rawTokens);
  const qVec = embed(query, { expand: true });

  // query terms with weights: raw 1.0, expansion-only 0.55
  const rawSet = new Set(rawTokens);
  const qTerms = [];
  const seenT = new Set();
  for (const t of expanded) {
    if (seenT.has(t)) continue;
    seenT.add(t);
    qTerms.push({ t, w: rawSet.has(t) ? 1 : 0.55 });
  }
  const normDenom = qTerms.reduce((s, qt) => s + Math.max(0.0001, idf(stats, qt.t)) * qt.w, 0) || 1;

  const results = chunks.map((c) => {
    const toks = c._toks || (c._toks = (c.tokens || tokenize(`${c.title} ${c.text}`)));
    const tfMap = c._tf || (c._tf = (() => { const m = new Map(); for (const u of toks) m.set(u, (m.get(u) || 0) + 1); return m; })());
    const dl = toks.length;
    const lenNorm = K1 * (1 - B + (B * dl) / stats.avgdl);

    let bm25 = 0;
    const matchedRaw = new Set();
    for (const qt of qTerms) {
      // find the best matching doc token
      let bestU = null;
      let bestQ = 0;
      if (tfMap.has(qt.t)) {
        bestU = qt.t;
        bestQ = 1;
      } else {
        for (const u of tfMap.keys()) {
          const qu = matchQuality(qt.t, u);
          if (qu > bestQ) { bestQ = qu; bestU = u; if (qu >= 0.99) break; }
        }
      }
      if (!bestU) continue;
      if (rawSet.has(qt.t)) matchedRaw.add(qt.t);
      // expansions can also "witness" a raw token (its synonym matched) → coverage credit
      else {
        for (const [raw, exs] of Object.entries(SYNONYMS)) {
          // cheap: only if raw belongs to this query
          if (!rawSet.has(raw)) continue;
          if (exs.includes(qt.t)) { matchedRaw.add(raw); break; }
        }
      }
      const termIdf = Math.max(0.0001, idf(stats, bestU));
      const tf = tfMap.get(bestU);
      bm25 += qt.w * bestQ * termIdf * ((tf * (K1 + 1)) / (tf + lenNorm));
    }
    const bm25n = Math.min(1, bm25 / (normDenom * 2.2));

    let cos = 0;
    const dv = c.vec;
    for (let i = 0; i < qVec.length; i++) cos += qVec[i] * dv[i];

    let boost = 0;
    if (Array.isArray(c.tags)) {
      const exp = new Set(expanded);
      for (const t of c.tags) {
        if (exp.has(t)) { boost += 0.03; if (boost >= 0.09) break; }
      }
    }

    const coverage = rawTokens.length ? matchedRaw.size / rawTokens.length : 0;
    const score = 0.62 * bm25n + 0.38 * Math.max(0, cos) + boost;
    return { ...c, score, cosine: cos, bm25: bm25n, coverage };
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, k);
}
