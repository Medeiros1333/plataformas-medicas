// Adaptive study trail ("Trilha CONAREM", beta).
//
// Everything in this file is pure (no DB, no clock, no Math.random unless
// injected) so the selection logic can be tested in isolation. The routes in
// routes/trail.js load the user's per-question progress, call these functions
// and persist the results.

const PASS_PCT = 70;

// Base share of each area in the real exam, used when a mission is "mixed".
const AREA_SHARE = { PED: 0.25, MI: 0.25, CIR: 0.2, GO: 0.2, SP: 0.1 };

const ZONES = [
  { id: "sp", name: "Valle de Salud Pública", area: "SP", color: "#2F7BD9" },
  { id: "ped", name: "Bosque Pediátrico", area: "PED", color: "#2E9E6B" },
  { id: "go", name: "Colinas Obstétricas", area: "GO", color: "#C2528B" },
  { id: "mi", name: "Montaña de Clínica Médica", area: "MI", color: "#D08A1E" },
  { id: "cir", name: "Puerto Quirúrgico", area: "CIR", color: "#B5443B" },
  { id: "final", name: "Ciudadela CONAREM", area: null, color: "#6B4FC4" },
];

const MISSIONS_PER_ZONE = 6;
const SIZE = { mission: 10, boss: 15, final: 30 };

function buildMap() {
  const nodes = [];
  ZONES.forEach((z) => {
    for (let i = 1; i <= MISSIONS_PER_ZONE; i++) {
      nodes.push({
        index: nodes.length,
        zoneId: z.id,
        kind: "mission",
        area: z.area,
        size: SIZE.mission,
        title: z.area ? `Misión ${i}` : `Repaso ${i}`,
      });
    }
    if (z.id === "final") {
      nodes.push({ index: nodes.length, zoneId: z.id, kind: "final", area: null, size: SIZE.final, title: "Gran examen CONAREM" });
    } else {
      nodes.push({ index: nodes.length, zoneId: z.id, kind: "boss", area: z.area, size: SIZE.boss, title: "Jefe de zona" });
    }
  });
  return nodes;
}

const NODES = buildMap();

// Days until a question is due again after N correct answers in a row.
const INTERVAL_DAYS = [1, 3, 7, 16, 35];

/**
 * Update one question's progress after an answer.
 * A wrong answer resets the streak and makes the question due right away, so
 * it keeps coming back until the user gets it right consistently.
 */
function applyAnswer(prev, correct, now) {
  const p = prev
    ? { ...prev }
    : { attempts: 0, wrong: 0, streak: 0, lastCorrect: false, dueAt: now };
  p.attempts += 1;
  p.lastSeenAt = now;
  p.lastCorrect = correct;
  if (correct) {
    p.streak += 1;
    const days = INTERVAL_DAYS[Math.min(p.streak - 1, INTERVAL_DAYS.length - 1)];
    p.dueAt = new Date(now.getTime() + days * 86400000);
  } else {
    p.wrong += 1;
    p.streak = 0;
    p.dueAt = now;
  }
  return p;
}

/**
 * Selection weight of one question. Unseen = 1. Seen questions weigh more the
 * more often they were missed and when they are due; questions the user
 * answered correctly and are not due yet almost never come back.
 */
function questionWeight(p, now) {
  if (!p || p.attempts === 0) return 1;
  const errRate = p.wrong / p.attempts;
  let w = 0.25 + 2.5 * errRate + (p.lastCorrect ? 0 : 1.5);
  const due = p.dueAt && new Date(p.dueAt).getTime() <= now.getTime();
  w *= due ? 1.5 : 0.15;
  if (p.streak >= 3) w *= 0.3;
  return w;
}

// Weighted sampling without replacement (Efraimidis-Spirakis).
function weightedSample(items, weightOf, n, rng) {
  const keyed = items
    .map((it) => {
      const w = Math.max(weightOf(it), 1e-9);
      return { it, key: -Math.log(1 - rng()) / w };
    })
    .sort((a, b) => a.key - b.key);
  return keyed.slice(0, n).map((k) => k.it);
}

// Accuracy-based weakness of an area from the per-question progress.
function areaError(bank, progress, area) {
  let attempts = 0;
  let wrong = 0;
  for (const q of bank) {
    if (q.area !== area) continue;
    const p = progress.get(q.id);
    if (p) {
      attempts += p.attempts;
      wrong += p.wrong;
    }
  }
  // Prior of 2 attempts at 30% error so an area with no data is neutral.
  return (wrong + 0.6) / (attempts + 2);
}

/**
 * Draw the questions of a mission.
 *
 * Each mission is a mix, so a struggling student is never handed a wall of
 * only-hard questions:
 *   - about 40% "review": questions previously missed that are due again,
 *     weighted by how often they were missed (this is what makes the weak
 *     spots come back more often than the strong ones);
 *   - the rest: material not seen yet, then "seen" questions if the unseen
 *     pool of the zone runs out.
 * Area missions draw the focus part from the zone's area (review may come
 * from anywhere, so older material keeps returning across the trail). Mixed
 * missions and the final exam draw from the whole bank, with the area share
 * of the real exam scaled up for the areas where the user errs more.
 */
const REVIEW_SHARE = 0.4;

function drawMission(node, bank, progress, now, rng, excludeIds) {
  const skip = new Set(excludeIds || []);
  const wOf = (q) => questionWeight(progress.get(q.id), now);
  const available = bank.filter((q) => !skip.has(q.id));
  const chosen = [];
  const taken = new Set();
  const take = (arr) =>
    arr.forEach((q) => {
      chosen.push(q);
      taken.add(q.id);
    });
  const isDueWrong = (q) => {
    const p = progress.get(q.id);
    return p && p.attempts > 0 && !p.lastCorrect && new Date(p.dueAt).getTime() <= now.getTime();
  };
  const isUnseen = (q) => {
    const p = progress.get(q.id);
    return !p || p.attempts === 0;
  };

  let areaFactor = () => 1;
  if (!node.area) {
    const errByArea = {};
    Object.keys(AREA_SHARE).forEach((a) => (errByArea[a] = areaError(bank, progress, a)));
    const count = {};
    available.forEach((q) => (count[q.area] = (count[q.area] || 0) + 1));
    areaFactor = (q) => (AREA_SHARE[q.area] * (1 + 2 * errByArea[q.area])) / (count[q.area] || 1);
  }
  const focusOk = (q) => !node.area || q.area === node.area;

  // 1) review slots: due-wrong questions (any area), zone area preferred.
  const reviewN = Math.round(node.size * REVIEW_SHARE);
  take(weightedSample(available.filter(isDueWrong), (q) => wOf(q) * (focusOk(q) ? 2 : 1) * areaFactor(q), reviewN, rng));

  // 2) fresh material from the focus scope.
  const freshN = node.size - chosen.length;
  take(weightedSample(available.filter((q) => focusOk(q) && isUnseen(q) && !taken.has(q.id)), (q) => areaFactor(q), freshN, rng));

  // 3) top up with seen questions of the focus scope, then with anything.
  if (chosen.length < node.size) {
    take(weightedSample(available.filter((q) => focusOk(q) && !taken.has(q.id)), (q) => wOf(q) * areaFactor(q), node.size - chosen.length, rng));
  }
  if (chosen.length < node.size) {
    take(weightedSample(available.filter((q) => !taken.has(q.id)), wOf, node.size - chosen.length, rng));
  }

  // A question that is part of a clinical case series (see groupId/groupIndex
  // in questionStats.js) only makes sense right after the question before it
  // in the same series -- pull in the rest of its group and keep the group
  // itself as one unit below, so a mission never shows a continuation
  // without its stem, or out of order. This can push the mission slightly
  // past node.size (a group is at most 4 questions); that's fine, size is a
  // target here, not a hard contract.
  const units = groupIntoUnits(chosen, bank, skip);
  for (let i = units.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [units[i], units[j]] = [units[j], units[i]];
  }
  return [].concat(...units).map((q) => q.id);
}

function groupIntoUnits(chosenArr, bank, skip) {
  const byGroup = new Map();
  bank.forEach((q) => {
    if (q.groupId == null || skip.has(q.id)) return;
    if (!byGroup.has(q.groupId)) byGroup.set(q.groupId, []);
    byGroup.get(q.groupId).push(q);
  });
  byGroup.forEach((members) => members.sort((a, b) => a.groupIndex - b.groupIndex));

  const emitted = new Set();
  const units = [];
  chosenArr.forEach((q) => {
    if (emitted.has(q.id)) return;
    const members = q.groupId != null ? byGroup.get(q.groupId) : null;
    if (members && members.length > 1) {
      members.forEach((m) => emitted.add(m.id));
      units.push(members);
    } else {
      emitted.add(q.id);
      units.push([q]);
    }
  });
  return units;
}

// Passing needs 70%; after two failed attempts on the same node the bar drops
// to 50% so a student is never stuck forever (they still see the material
// again through the review slots).
function passThreshold(failedAttempts) {
  return failedAttempts >= 2 ? 50 : PASS_PCT;
}

function starsFor(pct, threshold) {
  if (pct < (threshold || PASS_PCT)) return 0;
  if (pct >= 100) return 3;
  if (pct >= 85) return 2;
  return 1;
}

// Per-area mastery summary shown next to the map.
function summarize(bank, progress) {
  const byArea = {};
  Object.keys(AREA_SHARE).forEach((a) => (byArea[a] = { total: 0, seen: 0, mastered: 0, weak: 0, attempts: 0, wrong: 0 }));
  for (const q of bank) {
    const s = byArea[q.area];
    if (!s) continue;
    s.total += 1;
    const p = progress.get(q.id);
    if (!p || p.attempts === 0) continue;
    s.seen += 1;
    s.attempts += p.attempts;
    s.wrong += p.wrong;
    if (p.streak >= 2) s.mastered += 1;
    else if (p.wrong > 0) s.weak += 1;
  }
  return byArea;
}

module.exports = {
  PASS_PCT,
  ZONES,
  NODES,
  AREA_SHARE,
  applyAnswer,
  questionWeight,
  drawMission,
  passThreshold,
  starsFor,
  summarize,
};
