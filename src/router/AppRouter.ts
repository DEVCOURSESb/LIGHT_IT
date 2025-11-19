import MainLayout from '@/layouts/MainLayout.vue'
import AutenticacionC from '@/pages/AutenticacionC.vue'
import IntermediariosPage from '@/pages/catalogos/IntermediariosPage.vue'
import OperacionesRamosPage from '@/pages/catalogos/OperacionesRamosPage.vue'
import ReaseguradoresPage from '@/pages/catalogos/ReaseguradoresPage.vue'
import Home from '@/pages/Home.vue'
import LoginC from '@/pages/LoginC.vue'

export function AppRouter () {
  const routes = [
    {
      path: '/',
      name: 'login',
      component: LoginC,
      meta: { public: true },
    },
    {
      path: '/autenticacion',
      name: 'autenticacion',
      component: AutenticacionC,
      meta: { requiresAuth: true, requiresUnverified: true }
    },
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true, requiresVerification: true },
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home,
        },
        {
          path: '/catalogos/intermediarios',
          name: 'intermediarios',
          component: IntermediariosPage,
          meta: { title: 'Intermediarios' },
        },
        {
          path: '/catalogos/reaseguradores',
          name: 'reaseguradores',
          component: ReaseguradoresPage,
          meta: { title: 'Reaseguradores' },
        },
        {
          path: '/catalogos/operaciones_ramos',
          name: 'operaciones_ramos',
          component: OperacionesRamosPage,
          meta: { title: 'Operaciones Ramos' },
        },
      ],
    },
  ]

  return { routes }
}
