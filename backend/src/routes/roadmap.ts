import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET /api/roadmap — all completions
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT phase, topic_index FROM roadmap_completions ORDER BY phase, topic_index'
    );
    const completed: Record<string, boolean> = {};
    result.rows.forEach((r) => {
      completed[`p${r.phase}_${r.topic_index}`] = true;
    });
    res.json({ completed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

// POST /api/roadmap/toggle
router.post('/toggle', async (req: Request, res: Response) => {
  try {
    const { phase, topic_index } = req.body as { phase: number; topic_index: number };
    if (phase === undefined || topic_index === undefined) {
      res.status(400).json({ error: 'phase and topic_index required' });
      return;
    }

    const existing = await pool.query(
      'SELECT id FROM roadmap_completions WHERE phase = $1 AND topic_index = $2',
      [phase, topic_index]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'DELETE FROM roadmap_completions WHERE phase = $1 AND topic_index = $2',
        [phase, topic_index]
      );
      res.json({ completed: false });
    } else {
      await pool.query(
        'INSERT INTO roadmap_completions (phase, topic_index) VALUES ($1, $2)',
        [phase, topic_index]
      );
      res.json({ completed: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle topic' });
  }
});

// GET /api/roadmap/stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT phase, COUNT(*) as done FROM roadmap_completions GROUP BY phase'
    );
    const PHASE_TOTALS: Record<number, number> = { 1: 16, 2: 14, 3: 15 };
    const stats: Record<number, { done: number; total: number; pct: number }> = {};
    [1, 2, 3].forEach((p) => {
      const row = result.rows.find((r) => parseInt(r.phase) === p);
      const done = row ? parseInt(row.done) : 0;
      const total = PHASE_TOTALS[p];
      stats[p] = { done, total, pct: Math.round((done / total) * 100) };
    });
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
