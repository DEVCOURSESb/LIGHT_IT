// calculoRoutes.ts
export const calculoRoutes = {
  path: "calculo",
  name: "calculo",
  meta: { title: "Cálculo" },
  children: [
    {
      path: "vida",
      name: "calculo-vida",
      meta: { title: "Vida" },
      children: [
        {
          path: "calculo_primas",
          name: "calculo-vida-primas",
          component: () =>
            import("@/pages/reaseguro/calculos/vida/PrimasPage.vue"),
          meta: { title: "Cálculo de Primas de Vida" },
        },
        {
          path: "calculo_siniestros",
          name: "calculo-vida-siniestros",
          component: () =>
            import("@/pages/reaseguro/calculos/vida/SiniestrosPage.vue"),
          meta: { title: "Cálculo de Siniestros de Vida" },
        },
        {
          path: "ptu_comision_escalonada",
          name: "calculo-vida-ptu",
          component: () =>
            import("@/pages/reaseguro/calculos/vida/PtuComisionEscalonadaPage.vue"),
          meta: { title: "PTU Comision Escalonada" },
        },
      ],
    },
  ],
};