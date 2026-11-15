const fs = require("fs");
const path = require("path");

// The question bank lives as a plain JS array literal (`var Q = [...]`)
// embedded inside frontend/app.html -- there is no "questions" table in
// Postgres, that file is the actual source of truth the exam runner reads
// from. To show an accurate, always-current count on the landing page
// without re-parsing a ~3MB file on every request, we parse it once here
// (at module load / server start) and cache the result in memory. Because
// app.html only changes via a redeploy (which restarts this process), the
// cached count can never go stale while the server is running.

const APP_HTML_PATH = path.join(__dirname, "..", "..", "frontend", "app.html");

// Depth-and-string-aware scan for the closing "]" of `var Q = [ ... ];`.
// A naive regex/indexOf would break on "]" characters that appear inside
// question/answer strings (there are plenty), so this walks character by
// character, ignoring brackets while inside a quoted string.
function extractArrayLiteral(src, varDeclaration) {
  const start = src.indexOf(varDeclaration);
  if (start < 0) return null;
  const startIdx = start + varDeclaration.length;
  let depth = 0;
  let inStr = false;
  let strCh = null;
  let esc = false;
  let i = startIdx;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (c === "\\") {
        esc = true;
        continue;
      }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = true;
      strCh = c;
      continue;
    }
    if (c === "[") depth++;
    if (c === "]") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return src.slice(startIdx, i);
}

// A handful of questions are the 2nd/3rd/4th part of a clinical case
// ("(Continuación del caso clínico seriado) ...", "...del caso anterior"):
// they only make sense shown right after the question that states the case.
// This mirrors the same grouping done client-side in frontend/app.html
// (SERIES_GROUPS) so any server-side feature that draws questions (the study
// trail) can keep these runs together and in order too, instead of
// shuffling a continuation away from -- or ahead of -- its stem.
const SERIES_RE = /caso anterior|continuaci[oó]n del caso/i;
function computeSeriesGroups(Q) {
  const groupId = new Array(Q.length).fill(null);
  const groupIndex = new Array(Q.length).fill(0);
  let i = 0;
  while (i < Q.length) {
    if (SERIES_RE.test(Q[i].q)) {
      i++;
      continue;
    }
    let j = i + 1;
    while (j < Q.length && SERIES_RE.test(Q[j].q) && Q[j].area === Q[i].area) j++;
    if (j > i + 1) {
      for (let k = i; k < j; k++) {
        groupId[k] = String(Q[i].id);
        groupIndex[k] = k - i;
      }
    }
    i = j;
  }
  return { groupId, groupIndex };
}

function computeStats() {
  const src = fs.readFileSync(APP_HTML_PATH, "utf8");
  // NB: the declaration marker deliberately excludes the "[" itself, so the
  // scan below starts ON the opening bracket and counts it (depth 0 -> 1).
  const arrText = extractArrayLiteral(src, "var Q = ");
  if (!arrText) throw new Error("could not locate 'var Q = [' in app.html");
  // eslint-disable-next-line no-eval -- trusted, first-party file baked into our own image, not user input
  const Q = eval(arrText);
  const byArea = {};
  Q.forEach((q) => {
    byArea[q.area] = (byArea[q.area] || 0) + 1;
  });
  const { groupId, groupIndex } = computeSeriesGroups(Q);
  return {
    total: Q.length,
    byArea,
    computedAt: new Date().toISOString(),
    // Minimal server-side view of the bank (id/area/answer key) for features
    // that grade or draw questions on the server, e.g. the study trail.
    // groupId/groupIndex: null unless this question is part of a clinical
    // case series, in which case groupId is the series' first question id
    // and groupIndex its 0-based position within the series.
    bank: Q.map((q, i) => ({ id: String(q.id), area: q.area, ans: q.ans, groupId: groupId[i], groupIndex: groupIndex[i] })),
  };
}

let cached = null;
try {
  cached = computeStats();
  console.log(`questionStats: loaded ${cached.total} questions from app.html`);
} catch (e) {
  // Never let a parsing hiccup take the whole app down -- the landing page
  // just falls back to whatever static number is already in its HTML.
  console.error("questionStats: failed to compute question stats:", e.message);
}

function getQuestionStats() {
  if (!cached) return cached;
  const { bank, ...stats } = cached;
  return stats;
}

function getQuestionBank() {
  return cached ? cached.bank : [];
}

module.exports = { getQuestionStats, getQuestionBank };
