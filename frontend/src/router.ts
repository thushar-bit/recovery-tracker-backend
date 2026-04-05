import { createRouter, createWebHistory } from 'vue-router'
import Routine from './views/Routine.vue'
import Roadmap from './views/Roadmap.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/routine' },
    { path: '/routine', component: Routine },
    { path: '/roadmap', component: Roadmap },
  ],
})

export default router
