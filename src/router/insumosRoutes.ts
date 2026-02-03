export const insumosRoutes = {
  path: "/insumos",
  component: () => import("@/layouts/MainLayout.vue"),
  meta: { requiresAuth: true, requiresVerification: true },
  children: [
    {
      path: "cifras_control",
      name: "cifras_control",
      component: () => import("@/pages/insumos/CifrasControlPage.vue"),
      meta: { title: "Cifras de Control" },
    },
    {
      path: "carga_emision",
      name: "carga_emision",
      component: () => import("@/pages/insumos/cargas/EmisionPage.vue"),
      meta: { title: "Carga Emisión" },
    },
    {
      path: "carga_siniestros",
      name: "carga_siniestros",
      component: () => import("@/pages/insumos/cargas/SiniestrosPage.vue"),
      meta: { title: "Carga Siniestros" },
    },
  ],
};
