<template>
  <div class="roadmap-page">
    <!-- Phase stats -->
    <div class="phase-stats">
      <div
        v-for="p in [1,2,3]"
        :key="p"
        class="phase-stat"
        :class="{ active: currentPhase === p }"
        @click="currentPhase = p"
      >
        <div class="ps-top">
          <span class="ps-label">Phase {{ p }}</span>
          <span class="ps-pct">{{ stats[p]?.pct ?? 0 }}%</span>
        </div>
        <div class="ps-bar">
          <div class="ps-fill" :style="{ width: (stats[p]?.pct ?? 0) + '%' }" />
        </div>
        <div class="ps-sub">{{ PHASES[p].label }}</div>
      </div>
    </div>

    <!-- Phase info -->
    <div class="phase-info">
      <span class="phase-info-dot" />
      {{ PHASES[currentPhase].info }}
    </div>

    <!-- Phase progress -->
    <div class="prog-wrap">
      <div class="prog-bar">
        <div class="prog-fill" :style="{ width: currentPct + '%' }" />
      </div>
      <span class="prog-text">{{ currentDone }} / {{ PHASES[currentPhase].topics.length }}</span>
    </div>

    <!-- Topics -->
    <div v-if="loading" class="loading">loading...</div>
    <div v-else class="topic-list">
      <div
        v-for="(topic, i) in PHASES[currentPhase].topics"
        :key="i"
        class="topic-item"
        :class="{ done: completed[`p${currentPhase}_${i}`] }"
        @click="toggle(i)"
      >
        <div class="topic-check">
          <svg v-if="completed[`p${currentPhase}_${i}`]" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="topic-day">{{ topic.day }}</div>
        <div class="topic-body">
          <div class="topic-title">{{ topic.title }}</div>
          <div class="topic-desc">{{ topic.desc }}</div>
          <div class="topic-where">
            <span class="where-label">learn →</span> {{ topic.where }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-msg">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PHASES } from '../data'
import { fetchRoadmap, toggleRoadmapTopic, fetchRoadmapStats } from '../api'

const completed = ref<Record<string, boolean>>({})
const stats = ref<Record<number, { done: number; total: number; pct: number }>>({})
const currentPhase = ref(1)
const loading = ref(true)
const error = ref('')

const currentDone = computed(() =>
  PHASES[currentPhase.value].topics.filter((_, i) => completed.value[`p${currentPhase.value}_${i}`]).length
)
const currentPct = computed(() =>
  Math.round((currentDone.value / PHASES[currentPhase.value].topics.length) * 100)
)

onMounted(async () => {
  try {
    const [rm, st] = await Promise.all([fetchRoadmap(), fetchRoadmapStats()])
    completed.value = rm.completed
    stats.value = st.stats
  } catch {
    error.value = 'Could not connect to backend. Make sure it is running on port 3001.'
  } finally {
    loading.value = false
  }
})

async function toggle(i: number) {
  const key = `p${currentPhase.value}_${i}`
  const prev = completed.value[key]
  completed.value[key] = !prev
  try {
    await toggleRoadmapTopic(currentPhase.value, i)
    const st = await fetchRoadmapStats()
    stats.value = st.stats
  } catch {
    completed.value[key] = prev
    error.value = 'Failed to save. Check backend.'
  }
}
</script>

<style scoped>
.roadmap-page { display: flex; flex-direction: column; gap: 20px; }

.phase-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }

.phase-stat {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.phase-stat:hover { border-color: var(--border-strong); }
.phase-stat.active { border-color: var(--accent); background: var(--accent-dim); }

.ps-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }

.ps-label { font-size: 13px; color: var(--text); font-weight: 500; }
.ps-pct { font-family: var(--font-mono); font-size: 13px; color: var(--accent); }

.ps-bar {
  height: 2px;
  background: var(--bg-hover);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 8px;
}

.ps-fill { height: 100%; background: var(--accent); border-radius: 99px; transition: width 0.4s; }

.ps-sub { font-size: 11px; color: var(--text-muted); }

.phase-info {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

.phase-info-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  margin-top: 5px;
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

.topic-list { display: flex; flex-direction: column; gap: 4px; }

.topic-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.topic-item:hover { border-color: var(--border-strong); background: var(--bg-hover); }

.topic-item.done {
  background: var(--bg-surface);
  border-color: var(--border);
}

.topic-item.done .topic-title { text-decoration: line-through; color: var(--text-dim); }
.topic-item.done .topic-desc { color: var(--text-dim); }
.topic-item.done .topic-where { opacity: 0.4; }

.topic-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.15s;
  color: var(--accent);
}

.topic-item.done .topic-check {
  background: var(--accent-dim);
  border-color: var(--accent);
}

.topic-day {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  min-width: 58px;
  flex-shrink: 0;
  padding-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.topic-body { flex: 1; min-width: 0; }

.topic-title { font-size: 14px; color: var(--text); font-weight: 500; line-height: 1.4; margin-bottom: 3px; }

.topic-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 5px; }

.topic-where { font-size: 12px; color: var(--text-dim); }

.where-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--info);
  margin-right: 4px;
}

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
