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
    {
      path: "/reaseguro",
      component: () => import("@/layouts/MainLayout.vue"),
      meta: { requiresAuth: true, requiresVerification: true },
      children: [
        { ...calculoRoutes },
        { ...contratosReaseguroRoutes },

        // no se especificaba a donde pertenecian
        // Autos
        {
          path: "/visualizarContrato",
          name: "visualizarContratos",
          component: () =>
            import("@/pages/reaseguro/Contratos/Danios/NuevoContratoPage.vue"),
          meta: { title: "Visualizar Contratos" },
        },
        //Configuracion tarifas
        {
          path: "/configuracion_tarifas",
          name: "configuracion_tarifas",
          component: () =>
            import("@/pages/reaseguro/ConfiguracionTarifas/ConfiguracionTarifasPage.vue"),
          meta: { title: "Configuracion de tarifas" },
        },
        {
          path: "/configuracion_tarifas_archivo/:id",
          name: "configuracion_tarifas_archivo",
          component: () =>
            import("@/pages/reaseguro/ConfiguracionTarifas/ConfigTarifaVistaAPage.vue"),
          meta: { title: "Configuracion de tarifas Identificador de archivo" },
        },
      ],
    },

    insumosRoutes,
    catalogosRoutes,
  ];

  return { routes };
}
