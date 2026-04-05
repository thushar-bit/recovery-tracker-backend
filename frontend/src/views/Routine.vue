<template>
  <div class="routine-page">
    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-num">{{ streak }}</div>
        <div class="stat-label">day streak</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{{ doneCount }}</div>
        <div class="stat-label">done today</div>
      </div>
      <div class="stat-card accent" :class="{ full: pct === 100 }">
        <div class="stat-num">{{ pct }}%</div>
        <div class="stat-label">complete</div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="prog-wrap">
      <div class="prog-bar">
        <div class="prog-fill" :style="{ width: pct + '%' }" />
      </div>
      <span class="prog-text">{{ doneCount }} / {{ ROUTINE.length }}</span>
    </div>

    <!-- Task list -->
    <div v-if="loading" class="loading">loading...</div>
    <div v-else class="task-list">
      <div
        v-for="task in ROUTINE"
        :key="task.key"
        class="task-item"
        :class="[`tag-${task.tag}`, { done: completed[task.key] }]"
        @click="toggle(task.key)"
      >
        <div class="task-check">
          <svg v-if="completed[task.key]" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="task-time">{{ task.time }}</div>
        <div class="task-body">
          <span class="task-text">{{ task.text }}</span>
          <span class="task-tag">{{ task.tag }}</span>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="error-msg">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ROUTINE } from '../data'
import { fetchRoutine, toggleRoutineTask, fetchStreak } from '../api'

const today = new Date().toISOString().split('T')[0]
const completed = ref<Record<string, boolean>>({})
const streak = ref(0)
const loading = ref(true)
const error = ref('')

const doneCount = computed(() => ROUTINE.filter(t => completed.value[t.key]).length)
const pct = computed(() => Math.round((doneCount.value / ROUTINE.length) * 100))

onMounted(async () => {
  try {
    const [routineData, streakData] = await Promise.all([
      fetchRoutine(today),
      fetchStreak(),
    ])
    completed.value = routineData.completed
    streak.value = streakData.streak
  } catch (e) {
    error.value = 'Could not connect to backend. Make sure it is running on port 3001.'
  } finally {
    loading.value = false
  }
})

async function toggle(key: string) {
  const prev = completed.value[key]
  completed.value[key] = !prev
  try {
    await toggleRoutineTask(key, today)
    const s = await fetchStreak()
    streak.value = s.streak
  } catch {
    completed.value[key] = prev
    error.value = 'Failed to save. Check backend.'
  }
}
</script>

<style scoped>
.routine-page { display: flex; flex-direction: column; gap: 20px; }

.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  transition: border-color 0.2s;
}

.stat-card.accent { border-color: var(--accent-dim); }
.stat-card.full { background: var(--accent-dim); border-color: var(--accent); }
.stat-card.full .stat-num { color: var(--accent); }

.stat-num {
  font-size: 32px;
  font-weight: 600;
  color: var(--text);
  line-height: 1;
  font-family: var(--font-mono);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.prog-wrap { display: flex; align-items: center; gap: 12px; }

.prog-bar {
  flex: 1;
  height: 3px;
  background: var(--bg-card);
  border-radius: 99px;
  overflow: hidden;
}

.prog-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 99px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.prog-text {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  min-width: 40px;
  text-align: right;
}

.loading {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-dim);
  padding: 40px 0;
  text-align: center;
}

.task-list { display: flex; flex-direction: column; gap: 4px; }

.task-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.task-item:hover { border-color: var(--border-strong); background: var(--bg-hover); }

.task-item.done {
  background: var(--bg-surface);
  border-color: var(--border);
}

.task-item.done .task-text { text-decoration: line-through; color: var(--text-dim); }
.task-item.done .task-time { color: var(--text-dim); }

.task-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
  color: var(--accent);
}

.task-item.done .task-check {
  background: var(--accent-dim);
  border-color: var(--accent);
}

.task-time {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  min-width: 68px;
  flex-shrink: 0;
}

.task-body { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }

.task-text { font-size: 14px; color: var(--text); flex: 1; line-height: 1.4; }

.task-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 99px;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.tag-health .task-tag { background: var(--success-dim); color: var(--success); }
.tag-tech .task-tag { background: var(--info-dim); color: var(--info); }
.tag-work .task-tag { background: var(--bg-hover); color: var(--text-muted); }
.tag-recovery .task-tag { background: var(--accent-dim); color: var(--accent); }

.error-msg {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--danger);
  background: var(--danger-dim);
  border: 1px solid var(--danger);
  border-radius: var(--radius);
  padding: 10px 14px;
}
</style>
