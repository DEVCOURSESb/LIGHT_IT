import { calculoRoutes } from "./calculoRoutes";
import { contratosReaseguroRoutes } from "./contratosReaseguroRoutes";
import { insumosRoutes } from "./insumosRoutes";
import { catalogosRoutes } from "./catalogosRoutes";

export function AppRouter() {
  const routes = [
    {
      path: "/",
      name: "login",
      component: () => import("@/pages/auth/Login.vue"),
      meta: { public: true },
    },
    {
      path: "/login",
      name: "loginC",
      component: () => import("@/pages/auth/LoginC.vue"),
      meta: { public: true },
    },
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      meta: { requiresAuth: true, requiresVerification: true },
      children: [
        {
          path: "home",
          name: "home",
          component: () => import("@/pages/Home.vue"),
        },
        {
          path: "administracion/bitacora",
          name: "administracion",
          component: () =>
            import("@/pages/administracion/AdministracionPage.vue"),
          meta: { title: "Bitácora" },
        },
      ],
    },
    catalogosRoutes,
    {
      path: "/reaseguro",
      component: () => import("@/layouts/MainLayout.vue"),
      meta: { requiresAuth: true, requiresVerification: true },
      children: [
        { ...contratosReaseguroRoutes },
        { ...calculoRoutes },
        {
          path: "configuracion_tarifas",
          name: "configuracion_tarifas",
          component: () =>
            import("@/pages/reaseguro/ConfiguracionTarifas/ConfiguracionTarifasPage.vue"),
          meta: { title: "Configuracion de tarifas" },
        },
        {
          path: "bordereaux",
          name: "bordereaux",
          component: () =>
            import("@/pages/TodoPage.vue"),
          meta: { title: "Bordereaux" },
        },
        {
          path: "estadosCuentaReaseg",
          name: "estadosCuentaReaseg",
          component: () =>
            import("@/pages/TodoPage.vue"),
          meta: { title: "Estados de cuenta reaseguro" },
        },
        {
          path: "reportesReaseguro",
          component: () => import("@/pages/reaseguro/Reportes/CalReportes.vue"),
          meta: { title: "Reportes Reaseguro" },
          children: [
            {
              path: "CalReportes", 
              component: () => import("@/pages/reaseguro/Reportes/CalReportes.vue"),
              meta: { title: "Cálculo de Reportes" },
            },
          ],
        },
        {
          path: "RR6",
          name: "rr6",
          component: () =>
            import("@/pages/TodoPage.vue"),
          meta: { title: "RR6" },
        },

        // no se especificaba a donde pertenecian
        // Autos
        {
          path: "configuracion_tarifas_archivo/:id",
          name: "configuracion_tarifas_archivo",
          component: () =>
            import("@/pages/reaseguro/ConfiguracionTarifas/ConfigTarifaVistaAPage.vue"),
          meta: { title: "Configuracion de tarifas Identificador de archivo" },
        },
      ],
    },

    insumosRoutes,
  ];

  return { routes };
}
