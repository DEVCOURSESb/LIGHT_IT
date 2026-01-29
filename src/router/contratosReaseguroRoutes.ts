export const contratosReaseguroRoutes = {
  path: "/contratos",
  name: "contratos",
  meta: { title: "Contratos de reaseguro" },
  children: [
    {
      path: "accidentes_enfermedades",
      name: "accidentes_enfermedades",
      meta: { title: "Accidentes y enfermedades" },
      children: [
        {
          path: "nuevo",
          name: "nuevo",
          component: () =>
            import("@/pages/reaseguro/Contratos/accidentes-enfermedades/AccidentesEnfermedadesPage.vue"),
          meta: { title: "Nuevo contrato accidentes y enfermedades" },
        },
      ],
    },
    // reaseguro- danios
    {
      path: "danios",
      name: "danios",
      meta: { title: "Daños" },
      children: [
        {
          path: "nuevoContrato",
          name: "nuevoContrato",
          component: () =>
            import("@/pages/reaseguro/Contratos/Danios/NuevoContratoPage.vue"),
          meta: { title: "Nuevo contrato" },
        },
        {
          path: "modificarContrato",
          name: "modificarContratos",
          component: () =>
            import("@/pages/reaseguro/Contratos/Danios/ModificarContratosPage.vue"),
          meta: { title: "Modificar contrato" },
        },
        {
          path: "modificarContratoId",
          name: "modificarContratosId",
          component: () =>
            import("@/pages/reaseguro/Contratos/Danios/ModificarContrato/ModificarContratoPag.vue"),
          meta: { title: "Modificar contrato" },
        },
        {
          path: "visualizarContrato",
          name: "visualizarContratos",
          component: () =>
            import("@/pages/reaseguro/Contratos/Danios/VisualizarContratosPage.vue"),
          meta: { title: "Visualizar Contratos" },
        },
      ],
    },
    // Vida
    {
      path: "vida",
      name: "vida",
      meta: { title: "Vida" },
      children: [
        {
          path: "nuevo",
          name: "nuevo",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/NuevoContratoVidaPage.vue"),
          meta: { title: "Nuevo Contrato Vida" },
        },
        {
          path: "modificarContratoVida",
          name: "modificarContratoVida",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/ModificarContratosVidaPage.vue"),
          meta: { title: "Modificar Contratos Vida" },
        },
        {
          path: "modificarContratoVidaId",
          name: "modificarContratoVidaId",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/ModificarContratoVida/ModificarContVidaPage.vue"),
          meta: { title: "Modificar Contratos Vida ID" },
        },
        {
          path: "visualizarContratoVida",
          name: "visualizarContratoVida",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/VisualizarContratosVidaPage.vue"),
          meta: { title: "Visualizar Contratos Vida" },
        },
        {
          path: "visualizarContratoVidaId",
          name: "visualizarContratoVidaId",
          component: () =>
            import("@/pages/reaseguro/Contratos/Vida/VisualizarContratoVida/VisualizarContratoVidaPage.vue"),
          meta: { title: "Visualizar Contratos Vida" },
        },
      ],
    },
  ],
};
