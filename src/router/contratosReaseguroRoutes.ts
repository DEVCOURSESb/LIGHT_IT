// contratosReaseguroRoutes.ts
export const contratosReaseguroRoutes = {
  path: "contratos", // Sin "/" inicial - relativo
  name: "contratos",
  meta: { title: "Contratos de reaseguro" },
  children: [
    // Accidentes y enfermedades
    {
      path: "accidentes_enfermedades",
      name: "contratos-accidentes-enfermedades",
      meta: { title: "Accidentes y enfermedades" },
      children: [
        {
          path: "nuevo",
          name: "contratos-accidentes-nuevo",
          component: () =>
            import("@/pages/reaseguro/Contratos/accidentes-enfermedades/AccidentesEnfermedadesPage.vue"),
          meta: { title: "Nuevo contrato accidentes y enfermedades" },
        },
        {
          path: "modificarContrato",
          name: "contratos-accidentes-modificar",
          component: () => import("@/pages/TodoPage.vue"),
          meta: { title: "Modificar Contratos" },
        },
        {
          path: "visualizarContrato",
          name: "contratos-accidentes-visualizar",
          component: () => import("@/pages/reaseguro/Contratos/accidentes-enfermedades/VisualizarContratoAyEPage.vue"),
          meta: { title: "Visualizar Contratos" },
        },
      ],
    },
    // Daños
    {
      path: "danios",
      name: "contratos-danios",
      meta: { title: "Daños" },
      children: [
        {
          path: "proporcional",
          name: "contratos-danios-proporcional",
          meta: { title: "Proporcional" },
          children: [
            {
              path: "nuevoContrato",
              name: "contratos-danios-proporcional-nuevo",
              component: () =>
                import("@/pages/reaseguro/Contratos/Danios/NuevoContratoPage.vue"),
              meta: { title: "Nuevo contrato" },
            },
            {
              path: "modificarContrato",
              name: "contratos-danios-proporcional-modificar",
              component: () =>
                import("@/pages/reaseguro/Contratos/Danios/ModificarContratosPage.vue"),
              meta: { title: "Modificar contrato" },
            },
            {
              path: "modificarContrato/:id",
              name: "contratos-danios-proporcional-modificar-id",
              component: () =>
                import("@/pages/reaseguro/Contratos/Danios/ModificarContrato/ModificarContratoPag.vue"),
              meta: { title: "Modificar contrato" },
            },
            {
              path: "visualizarContrato",
              name: "contratos-danios-proporcional-visualizar",
              component: () =>
                import("@/pages/reaseguro/Contratos/Danios/VisualizarContratosPage.vue"),
              meta: { title: "Visualizar Contratos" },
            },
          ],
        },
        {
          path: "noProporcional",
          name: "contratos-danios-no-proporcional",
          component: () => import("@/pages/TodoPage.vue"),
          meta: { title: "No Proporcional" },
        },
      ],
    },
    // Vida
    {
      path: "vida",
      name: "contratos-vida",
      meta: { title: "Vida" },
      children: [
        {
          path: "nuevo",
          name: "contratos-vida-nuevo",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/NuevoContratoVidaPage.vue"),
          meta: { title: "Nuevo Contrato Vida" },
        },
        {
          path: "modificarContratoVida",
          name: "contratos-vida-modificar",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/ModificarContratosVidaPage.vue"),
          meta: { title: "Modificar Contratos Vida" },
        },
        {
          path: "modificarContratoVida/:id",
          name: "contratos-vida-modificar-id",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/ModificarContratoVida/ModificarContVidaPage.vue"),
          meta: { title: "Modificar Contratos Vida ID" },
        },
        {
          path: "visualizarContratoVida",
          name: "contratos-vida-visualizar",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/VisualizarContratosVidaPage.vue"),
          meta: { title: "Visualizar Contratos Vida" },
        },
        {
          path: "visualizarContratoVida/:id",
          name: "contratos-vida-visualizar-id",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/VisualizarContratoVida/VisualizarContratoVidaPage.vue"),
          meta: { title: "Visualizar Contratos Vida" },
        },
      ],
    },
    // Autos
    {
      path: "autos",
      name: "contratos-autos",
      meta: { title: "Autos" },
      component: () => import("@/pages/TodoPage.vue"),
    },
  ],
};
