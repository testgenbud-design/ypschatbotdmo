#!/usr/bin/env node
/**
 * scripts/selftest.mjs — calibration run for the retrieval threshold.
 * Prints the top score for representative parent questions (en/hi/mr/hinglish)
 * plus a few off-topic questions that must stay BELOW the threshold.
 * Run after `node scripts/ingest.js`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { retrieve, ANSWER_THRESHOLD } from "../src/lib/retrieval/retrieve.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const kb = JSON.parse(fs.readFileSync(path.join(root, "..", "data", "chunks.json"), "utf8"));

const cases = [
  // [query, expect answered?]
  ["What is the intake for Computer Science engineering?", true],
  ["How do I get admission in B.Tech at Yashoda?", true],
  ["What documents are needed for admission?", true],
  ["What is the fee for CSE branch?", true],
  ["Is there a girls hostel on campus?", true],
  ["Does the college have a bus facility from Karad?", true],
  ["Scholarship for OBC students?", true],
  ["What are the placement statistics and average package?", true],
  ["बी.टेक साठी पात्रता काय आहे?", true],
  ["मुलींसाठी वसतिगृह आहे का?", true],
  ["फी किती आहे?", true],
  ["शिष्यवृत्ती मिळते का?", true],
  ["एडमिशन के लिए कौन से दस्तावेज़ चाहिए?", true],
  ["हॉस्टेल की फीस कितनी है?", true],
  ["fees kitni hai CSE ki?", true],
  ["hostel mein rehne ka kya scene hai?", true],
  ["What D pharmacy intake do you have?", true],
  ["MBA admission process batayein", true],
  ["Where exactly is the college located?", true],
  ["college ka contact number kya hai", true],
  // off-topic — must NOT cross the threshold
  ["Write python code for fibonacci series", false],
  ["Who won the cricket match yesterday?", false],
  ["Tell me a joke about engineers", false],
  ["What is the weather in Mumbai today?", false],
  ["Best restaurants in Satara", false],
];

let pass = 0;
console.log(`threshold = ${ANSWER_THRESHOLD}\n`);
for (const [q, shouldAnswer] of cases) {
  const top = retrieve(q, kb.chunks, 5);
  const s = top[0]?.score ?? 0;
  const answered = s >= ANSWER_THRESHOLD;
  const ok = answered === shouldAnswer;
  if (ok) pass++;
  console.log(
    `${ok ? "✔" : "✘"} ${s.toFixed(3)} cov=${(top[0]?.coverage ?? 0).toFixed(2)} ${answered ? "ANS " : "HAND"}  ${q}\n` +
      `      → ${top[0]?.id} · ${top[0]?.heading}` +
      (top[1] ? `\n      · next: ${top[1].score.toFixed(3)} ${top[1].id}` : "")
  );
}
console.log(`\n${pass}/${cases.length} classified as expected`);
