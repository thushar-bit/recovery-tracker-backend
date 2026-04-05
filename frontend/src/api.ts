import axios from 'axios'

const api = axios.create({
  baseURL: 'https://recovery-tracker-backend-production.up.railway.app',
  headers: { 'Content-Type': 'application/json' },
})

// ─── Routine ──────────────────────────────────────────────
export async function fetchRoutine(date: string) {
  const { data } = await api.get<{ date: string; completed: Record<string, boolean> }>(
    `/routine?date=${date}`
  )
  return data
}

export async function toggleRoutineTask(task_key: string, date: string) {
  const { data } = await api.post<{ completed: boolean }>('/routine/toggle', { task_key, date })
  return data
}

export async function fetchStreak() {
  const { data } = await api.get<{ streak: number }>('/routine/streak')
  return data
}

export async function fetchRoutineHistory() {
  const { data } = await api.get<{ history: { date: string; pct: number }[] }>('/routine/history')
  return data
}

// ─── Roadmap ──────────────────────────────────────────────
export async function fetchRoadmap() {
  const { data } = await api.get<{ completed: Record<string, boolean> }>('/roadmap')
  return data
}

export async function toggleRoadmapTopic(phase: number, topic_index: number) {
  const { data } = await api.post<{ completed: boolean }>('/roadmap/toggle', { phase, topic_index })
  return data
}

export async function fetchRoadmapStats() {
  const { data } = await api.get<{
    stats: Record<number, { done: number; total: number; pct: number }>
  }>('/roadmap/stats')
  return data
}
