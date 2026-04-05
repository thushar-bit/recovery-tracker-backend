<template>
  <div class="layout">
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <span class="logo-dot" />
          <span class="logo-text">recovery.tracker</span>
        </div>
        <nav class="nav">
          <RouterLink to="/routine" class="nav-link" :class="{ active: route.path === '/routine' }">
            daily routine
          </RouterLink>
          <RouterLink to="/roadmap" class="nav-link" :class="{ active: route.path === '/roadmap' }">
            tech roadmap
          </RouterLink>
        </nav>
        <div class="header-date">{{ dateStr }}</div>
      </div>
    </header>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const dateStr = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
})
</script>

<style scoped>
.layout { min-height: 100vh; display: flex; flex-direction: column; }

.header {
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(14,14,15,0.92);
  backdrop-filter: blur(12px);
}

.header-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo { display: flex; align-items: center; gap: 8px; }

.logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.logo-text {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

.nav { display: flex; gap: 4px; flex: 1; }

.nav-link {
  padding: 6px 14px;
  border-radius: var(--radius);
  font-size: 13px;
  color: var(--text-muted);
  transition: all 0.15s;
  font-weight: 400;
}

.nav-link:hover { color: var(--text); background: var(--bg-hover); }
.nav-link.active { color: var(--text); background: var(--bg-card); }

.header-date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  margin-left: auto;
}

.main {
  flex: 1;
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
  padding: 32px 24px 64px;
}
</style>
