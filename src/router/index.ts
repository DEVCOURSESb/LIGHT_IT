// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { AppRouter } from './AppRouter';

const { routes } = AppRouter();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
