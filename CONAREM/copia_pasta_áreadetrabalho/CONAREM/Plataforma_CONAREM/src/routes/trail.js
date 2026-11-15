const express = require("express");
const { z } = require("zod");
const prisma = require("../db");
const { requireAuth } = require("../middleware/requireAuth");
const { requireAdmin } = require("../middleware/requireAdmin");
const { validateBody } = require("../middleware/validate");
const { getQuestionBank } = require("../services/questionStats");
const T = require("../services/trail");

// Adaptive study trail -- BETA. Restricted to admins while it is tested; when
// it opens to everyone, drop requireAdmin here (and the client-side gate).
const router = express.Router();
router.use(requireAuth, requireAdmin);

const bankById = new Map(getQuestionBank().map((q) => [q.id, q]));

async function loadState(userId) {
  return prisma.trailState.upsert({ where: { userId }, update: {}, create: { userId, completed: {} } });
}

async function loadProgress(userId) {
  const rows = await prisma.questionProgress.findMany({ where: { userId } });
  const map = new Map();
  rows.forEach((r) => map.set(r.questionId, r));
  return map;
}

function firstIncomplete(completed) {
  for (let i = 0; i < T.NODES.length; i++) if (!completed[String(i)] || !completed[String(i)].passed) return i;
  return T.NODES.length; // trail finished
}

router.get("/", async (req, res, next) => {
  try {
    const [state, progress] = await Promise.all([loadState(req.user.id), loadProgress(req.user.id)]);
    const completed = state.completed || {};
    const current = firstIncomplete(completed);
    const bank = getQuestionBank();
    res.json({
      zones: T.ZONES,
      passPct: T.PASS_PCT,
      current,
      nodes: T.NODES.map((n) => {
        const c = completed[String(n.index)] || {};
        return {
          ...n,
          passed: !!c.passed,
          stars: c.stars || 0,
          bestPct: c.bestPct == null ? null : c.bestPct,
          attempts: c.attempts || 0,
          fails: c.fails || 0,
          threshold: T.passThreshold(c.fails || 0),
          unlocked: n.index <= current,
        };
      }),
      mastery: T.summarize(bank, progress),
      activeIndex: state.active ? state.active.index : null,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/missions/:index/start", async (req, res, next) => {
  try {
    const index = Number(req.params.index);
    const node = T.NODES[index];
    if (!node) return res.status(404).json({ error: "mission_not_found" });
    const state = await loadState(req.user.id);
    const completed = state.completed || {};
    if (index > firstIncomplete(completed)) return res.status(403).json({ error: "mission_locked" });

    // Resume the same draw if the user reloaded in the middle of a mission.
    const act = state.active;
    if (act && act.index === index && Date.now() - act.startedAt < 6 * 3600 * 1000) {
      return res.json({ index, ids: act.ids, kind: node.kind, resumed: true });
    }

    const progress = await loadProgress(req.user.id);
    const ids = T.drawMission(node, getQuestionBank(), progress, new Date(), Math.random, []);
    await prisma.trailState.update({
      where: { userId: req.user.id },
      data: { active: { index, ids, startedAt: Date.now() } },
    });
    res.json({ index, ids, kind: node.kind, resumed: false });
  } catch (err) {
    next(err);
  }
});

const finishSchema = z.object({ answers: z.record(z.string().max(1)) });

router.post("/missions/:index/finish", validateBody(finishSchema), async (req, res, next) => {
  try {
    const index = Number(req.params.index);
    const node = T.NODES[index];
    if (!node) return res.status(404).json({ error: "mission_not_found" });
    const state = await loadState(req.user.id);
    const act = state.active;
    if (!act || act.index !== index) return res.status(409).json({ error: "no_active_mission" });

    const now = new Date();
    const progress = await loadProgress(req.user.id);
    const results = [];
    const writes = [];
    let correctCount = 0;
    for (const id of act.ids) {
      const q = bankById.get(id);
      const given = req.body.answers[id];
      const correct = !!q && given === q.ans;
      if (correct) correctCount++;
      results.push({ id, given: given || null, ans: q ? q.ans : null, correct });
      // Unanswered questions are not counted as attempts (no learning signal).
      if (!q || !given) continue;
      const next = T.applyAnswer(progress.get(id), correct, now);
      writes.push(
        prisma.questionProgress.upsert({
          where: { userId_questionId: { userId: req.user.id, questionId: id } },
          create: {
            userId: req.user.id,
            questionId: id,
            area: q.area,
            attempts: next.attempts,
            wrong: next.wrong,
            streak: next.streak,
            lastCorrect: next.lastCorrect,
            lastSeenAt: now,
            dueAt: next.dueAt,
          },
          update: {
            attempts: next.attempts,
            wrong: next.wrong,
            streak: next.streak,
            lastCorrect: next.lastCorrect,
            lastSeenAt: now,
            dueAt: next.dueAt,
          },
        })
      );
    }

    const total = act.ids.length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    const completed = { ...(state.completed || {}) };
    const prev = completed[String(index)] || { attempts: 0, fails: 0, bestPct: 0, stars: 0, passed: false };
    const threshold = T.passThreshold(prev.fails);
    const passed = pct >= threshold;
    const stars = T.starsFor(pct, threshold);
    completed[String(index)] = {
      attempts: prev.attempts + 1,
      fails: prev.fails + (passed ? 0 : 1),
      bestPct: Math.max(prev.bestPct || 0, pct),
      stars: Math.max(prev.stars || 0, stars),
      passed: prev.passed || passed,
      passedAt: prev.passed ? prev.passedAt : passed ? now.toISOString() : null,
    };

    await prisma.$transaction([
      ...writes,
      prisma.trailState.update({ where: { userId: req.user.id }, data: { completed, active: null } }),
    ]);

    res.json({
      pct,
      correct: correctCount,
      total,
      passed,
      threshold,
      stars,
      results,
      next: firstIncomplete(completed),
      finished: firstIncomplete(completed) >= T.NODES.length,
    });
  } catch (err) {
    next(err);
  }
});

// Beta helper: wipe the caller's trail progress and per-question history so
// the whole flow can be tested again from the start.
router.post("/reset", async (req, res, next) => {
  try {
    await prisma.$transaction([
      prisma.questionProgress.deleteMany({ where: { userId: req.user.id } }),
      prisma.trailState.deleteMany({ where: { userId: req.user.id } }),
    ]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
