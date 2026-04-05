import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET /api/routine?date=YYYY-MM-DD
router.get('/', async (req: Request, res: Response) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const result = await pool.query(
      'SELECT task_key FROM routine_completions WHERE completed_date = $1',
      [date]
    );
    const completed: Record<string, boolean> = {};
    result.rows.forEach((r) => { completed[r.task_key] = true; });
    res.json({ date, completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch routine' });
  }
});

// POST /api/routine/toggle
router.post('/toggle', async (req: Request, res: Response) => {
  try {
    const { task_key, date } = req.body as { task_key: string; date: string };
    if (!task_key || !date) {
      res.status(400).json({ error: 'task_key and date required' });
      return;
    }

    // Check if exists
    const existing = await pool.query(
      'SELECT id FROM routine_completions WHERE task_key = $1 AND completed_date = $2',
      [task_key, date]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'DELETE FROM routine_completions WHERE task_key = $1 AND completed_date = $2',
        [task_key, date]
      );
      res.json({ completed: false });
    } else {
      await pool.query(
        'INSERT INTO routine_completions (task_key, completed_date) VALUES ($1, $2)',
        [task_key, date]
      );
      res.json({ completed: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

// GET /api/routine/streak
router.get('/streak', async (req: Request, res: Response) => {
  try {
    const TOTAL_TASKS = 17;
    const THRESHOLD = Math.floor(TOTAL_TASKS * 0.7);

    const result = await pool.query(`
      SELECT completed_date, COUNT(*) as done_count
      FROM routine_completions
      WHERE completed_date < CURRENT_DATE
      GROUP BY completed_date
      ORDER BY completed_date DESC
      LIMIT 90
    `);

    let streak = 0;
    let expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - 1);

    for (const row of result.rows) {
      const rowDate = new Date(row.completed_date);
      const expected = expectedDate.toISOString().split('T')[0];
      const actual = rowDate.toISOString().split('T')[0];

      if (actual === expected && parseInt(row.done_count) >= THRESHOLD) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate streak' });
  }
});

// GET /api/routine/history — last 30 days completion %
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const TOTAL_TASKS = 17;
    const result = await pool.query(`
      SELECT completed_date::text, COUNT(*) as done
      FROM routine_completions
      WHERE completed_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY completed_date
      ORDER BY completed_date ASC
    `);
    const history = result.rows.map((r) => ({
      date: r.completed_date,
      pct: Math.round((parseInt(r.done) / TOTAL_TASKS) * 100),
    }));
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
