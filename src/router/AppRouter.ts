import MainLayout from "@/layouts/MainLayout.vue";
import ExtensionPage from "@/pages/catalogos/ExtensionPage.vue";
import IntermediariosPage from "@/pages/catalogos/IntermediariosPage.vue";
import MonedaPage from "@/pages/catalogos/MonedaPage.vue";
import OperacionesRamosPage from "@/pages/catalogos/OperacionesRamosPage.vue";
import ReaseguradoresPage from "@/pages/catalogos/ReaseguradoresPage.vue";
import TiposCapturaPage from "@/pages/catalogos/TiposCapturaPage.vue";
import TiposContratoPage from "@/pages/catalogos/TiposContratoPage.vue";
import Home from "@/pages/Home.vue";

export const AppRouter = () => {
  const routes = [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
        },
        {
          path: "catalogos",
          children: [
            {
              path: "intermediarios",
              name: "intermediarios",
              component: IntermediariosPage,
              meta: { title: "Intermediarios" },
            },
            {
              path: "reaseguradores",
              name: "reaseguradores",
              component: ReaseguradoresPage,
              meta: { title: "Reaseguradores" },
            },
            {
              path: "operaciones_ramos",
              name: "operaciones_ramos",
              component: OperacionesRamosPage,
              meta: { title: "Operaciones Ramos" },
            },
            {
              path: "tipos_contrato",
              name: "tipos_contrato",
              component: TiposContratoPage,
              meta: { title: "Tipos Contrato" },
            },
            {
              path: "monedas",
              name: "monedas",
              component: MonedaPage,
              meta: { title: "Monedas" },
            },
            {
              path: "tipos_captura",
              name: "tipos_captura",
              component: TiposCapturaPage,
              meta: { title: "Tipos Captura" },
            },
            {
              path: "extensiones",
              name: "extensiones",
              component: ExtensionPage,
              meta: { title: "Extensiones" },
            },
            {
              path: "clasificacion_cobertura",
              name: "clasificacion_cobertura",
              component: () =>
                import("@/pages/catalogos/ClasificacionCoberturaPage.vue"),
              meta: { title: "Clasificación Cobertura" },
            },
            {
              path: "distribucion_cesion",
              name: "distribucion_cesion",
              component: () =>
                import("@/pages/catalogos/DistribucionCesionPage.vue"),
              meta: { title: "Distribución Cesión" },
            },
            {
              path: "forma_contractual",
              name: "forma_contractual",
              component: () =>
                import("@/pages/catalogos/FormaContractualPage.vue"),
              meta: { title: "Forma Contractual" },
            },
            {
              path: "ptu",
              name: "ptu",
              component: () => import("@/pages/catalogos/PtuPage.vue"),
              meta: { title: "PTU" },
            },
            {
              path: "tipo_asignacion",
              name: "tipo_asignacion",
              component: () =>
                import("@/pages/catalogos/TipoAsignacionPage.vue"),
              meta: { title: "Tipo Asignación" },
            },
            {
              path: "tipo_reaseguro",
              name: "tipo_reaseguro",
              component: () =>
                import("@/pages/catalogos/TipoReaseguroPage.vue"),
              meta: { title: "Tipo Reaseguro" },
            },
            {
              path: "tipo_tarifa",
              name: "tipo_tarifa",
              component: () => import("@/pages/catalogos/TipoTarifaPage.vue"),
              meta: { title: "Tipo Tarifa" },
            },
            {
              path: "perfil",
              name: "perfil",
              component: () => import("@/pages/catalogos/PerfilPage.vue"),
              meta: { title: "Perfil" },
            },
            {
              path: "cobertura",
              name: "cobertura",
              component: () => import("@/pages/catalogos/CoberturaPage.vue"),
              meta: { title: "Cobertura" },
            },
          ],
        },
      ],
    },
  ];

  return {
    routes,
  };
};
