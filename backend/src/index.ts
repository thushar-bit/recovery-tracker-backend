import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db';
import routineRouter from './routes/routine';
import roadmapRouter from './routes/roadmap';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/routine', routineRouter);
app.use('/api/roadmap', roadmapRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function main() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`✓ Backend running on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
