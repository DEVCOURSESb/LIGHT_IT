export const calculoRoutes = {
  path: "calculo",
  name: "calculo",
  meta: { title: "Cálculo" },
  children: [
    {
      path: "vida",
      name: "vida",
      meta: { title: "Vida" },
      children: [
        {
          path: "calculo_primas",
          name: "primasVida",
          component: () =>
            import("@/pages/reaseguro/calculos/vida/PrimasPage.vue"),
          meta: { title: "Cálculo de Primas de Vida" },
        },
        {
          path: "calculo_siniestros",
          name: "siniestrosVida",
          component: () =>
            import("@/pages/reaseguro/calculos/vida/SiniestrosPage.vue"),
          meta: { title: "Cálculo de Siniestros de Vida" },
        },
        {
          path: "ptu_comision_escalonada",
          name: "ptuComisionEscalonada",
          component: () =>
            import("@/pages/reaseguro/calculos/vida/PtuComisionEscalonadaPage.vue"),
          meta: { title: "PTU Comision Escalonada" },
        },
      ],
    },
  ],
};
