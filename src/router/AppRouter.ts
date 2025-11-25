import MainLayout from '@/layouts/MainLayout.vue'
import AdministracionPage from '@/pages/administracion/AdministracionPage.vue'
import AutenticacionC from '@/pages/AutenticacionC.vue'
import IntermediariosPage from '@/pages/catalogos/IntermediariosPage.vue'
import OperacionesRamosPage from '@/pages/catalogos/OperacionesRamosPage.vue'
import ReaseguradoresPage from '@/pages/catalogos/ReaseguradoresPage.vue'
import Home from '@/pages/Home.vue'
import LoginC from '@/pages/LoginC.vue'
import ModificarContratosPage from '@/pages/reaseguro/Contratos/ModificarContratosPage.vue'
import NuevoContratoPage from '@/pages/reaseguro/Contratos/NuevoContratoPage.vue'
import VisualizarContratosPage from '@/pages/reaseguro/Contratos/VisualizarContratosPage.vue'

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
      meta: { requiresAuth: true, requiresUnverified: true },
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
          path: 'administracion/bitacora',
          name: 'administracion',
          component: AdministracionPage,
          meta: { title: 'Bitácora' },
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
        // reaseguro
        {
          path: '/reaseguro/nuevoContrato',
          name: 'nuevoContrato',
          component: NuevoContratoPage,
          meta: { title: 'Nuevo contrato' },
        },
        {
          path: '/reaseguro/modificarContratos',
          name: 'modificarContratos',
          component: ModificarContratosPage,
          meta: { title: 'Modificar contrato' },
        },
        {
          path: '/reaseguro/visualizarContratos',
          name: 'visualizarContratos',
          component: VisualizarContratosPage,
          meta: { title: 'Visualizar Contratos' },
        },
      ],
    },
  ]

  return { routes }
}
