// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { AppRouter } from './AppRouter'
import { AuthStore } from '@/stores/authStore'

const { routes } = AppRouter()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = AuthStore()

  authStore.checkAuth()

  const isAuthenticated = authStore.isLoggedIn
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isPublicRoute = to.matched.some(record => record.meta.public)

  // Si la ruta requiere autenticación y el usuario NO está autenticado
  if (requiresAuth && !isAuthenticated) {
    next({ path: '/' })
    return
  }

  // Si el usuario está autenticado e intenta acceder a rutas públicas (login)
  if (isAuthenticated && isPublicRoute) {
    next({ path: '/home' })
    return
  }

  // Continuar normalmente
  next()
})

export default router
