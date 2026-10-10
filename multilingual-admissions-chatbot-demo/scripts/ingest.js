#!/usr/bin/env node
/**
 * scripts/ingest.js
 * Reads /content/*.md  →  chunks every file into 200–400 word passages
 * (tagged with source file, page title and programme)  →  embeds each
 * chunk with the shared local embedder  →  writes /data/chunks.json.
 *
 * Usage:  node scripts/ingest.js
 * Re-run whenever the registrar provides new college text (brochure PDFs
 * converted to .md, updated fee pages, new courses) and redeploy.
 */
const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "content");
const OUT_FILE = path.join(__dirname, "..", "data", "chunks.json");

const MIN_WORDS = 200;
const MAX_WORDS = 400;

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta = {};
  if (m) {
    for (const line of m[1].split("\n")) {
      const kv = line.match(/^([a-z_]+):\s*(.*)$/i);
      if (kv) meta[kv[1].trim().toLowerCase()] = kv[2].trim();
    }
  }
  return { meta, body: m ? raw.slice(m[0].length) : raw };
}

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

/** Split one section into 200–400 word chunks on paragraph boundaries. */
function chunkSection(heading, text, slug, ordinalStart) {
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks = [];
  let buf = [];
  let words = 0;
  let ordinal = ordinalStart;

  const flush = () => {
    if (!buf.length) return;
    const body = buf.join("\n\n");
    chunks.push({ heading: heading || "Overview", text: body, words: wordCount(body), ordinal: ordinal++ });
    buf = [];
    words = 0;
  };

  for (const p of paras) {
    const w = wordCount(p);
    if (words + w > MAX_WORDS && words >= MIN_WORDS) flush();
    // a single paragraph longer than MAX_WORDS: hard-split by sentence
    if (w > MAX_WORDS) {
      flush();
      const sentences = p.split(/(?<=[.!?।])\s+/);
      let sbuf = [];
      let swords = 0;
      for (const s of sentences) {
        const sw = wordCount(s);
        if (swords + sw > MAX_WORDS && swords >= 80) {
          chunks.push({ heading: heading || "Overview", text: sbuf.join(" "), words: swords, ordinal: ordinal++ });
          sbuf = [];
          swords = 0;
        }
        sbuf.push(s);
        swords += sw;
      }
      if (sbuf.length) {
        chunks.push({ heading: heading || "Overview", text: sbuf.join(" "), words: swords, ordinal: ordinal++ });
      }
      continue;
    }
    buf.push(p);
    words += w;
  }
  flush();
  return chunks;
}

(async () => {
  const { embed, tokenize } = await import("../src/lib/retrieval/embedder.mjs");

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort();
  if (!files.length) {
    console.error("No .md files found in /content — drop the college text there first.");
    process.exit(1);
  }

  const all = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { meta, body } = parseFrontmatter(raw);
    const title = meta.title || slug;
    const programme = meta.programme || "all";
    const sourceUrl = meta.source_url || "";

    // split body by '## ' headings; text before the first heading is its own section
    const sections = [];
    let currentHeading = "";
    let current = [];
    for (const line of body.split("\n")) {
      const h = line.match(/^##\s+(.*)$/);
      if (h) {
        if (current.length) sections.push({ heading: currentHeading, text: current.join("\n") });
        currentHeading = h[1].trim();
        current = [];
      } else {
        current.push(line);
      }
    }
    if (current.join("").trim()) sections.push({ heading: currentHeading, text: current.join("\n") });

    let ordinal = 0;
    for (const sec of sections) {
      for (const c of chunkSection(sec.heading, sec.text, slug, ordinal)) {
        all.push({
          id: `${slug}#${c.ordinal}`,
          source: slug,
          source_url: sourceUrl,
          title,
          programme,
          heading: c.heading,
          text: c.text.replace(/\s+\n/g, "\n").trim(),
          words: c.words,
          tokens: tokenize(c.text),
          tags: tokenize(`${title} ${programme} ${c.heading} ${slug}`).slice(0, 40),
        });
        ordinal = c.ordinal + 1;
      }
    }
  }

  // merge tiny chunks (< 110 words) into the previous chunk of the same file
  const merged = [];
  for (const c of all) {
    if (c.words < 110 && merged.length && merged[merged.length - 1].source === c.source && merged[merged.length - 1].words + c.words <= MAX_WORDS + 60) {
      const prev = merged[merged.length - 1];
      prev.text += "\n\n" + (c.heading && c.heading !== "Overview" ? c.heading + " — " : "") + c.text;
      prev.words += c.words;
      c._merged = true;
    } else {
      merged.push(c);
    }
  }

  for (const c of merged) {
    c.tokens = tokenize(c.text);
    const vec = embed(`${c.title} — ${c.heading}\n${c.text}`);
    c.vec = vec.map((x) => Math.round(x * 1000) / 1000);
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  const payload = {
    meta: {
      generator: "scripts/ingest.js",
      embedder: "local-hashing-v1 (768-dim signed FNV-1a, word+char n-grams, query expansion)",
      generatedAt: new Date().toISOString(),
      files: files.length,
      chunks: merged.length,
    },
    chunks: merged,
  };
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload));
  const kb = (fs.statSync(OUT_FILE).size / 1024).toFixed(1);
  console.log(`✔ ingested ${files.length} files → ${merged.length} chunks (${kb} KB) → data/chunks.json`);
  for (const c of merged) console.log(`  ${c.id.padEnd(34)} ${String(c.words).padStart(3)} words  [${c.programme}] ${c.heading}`);
})();
