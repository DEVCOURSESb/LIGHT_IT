import MainLayout from "@/layouts/MainLayout.vue";
import IntermediariosPage from "@/pages/catalogos/IntermediariosPage.vue";
import MonedaPage from "@/pages/catalogos/MonedaPage.vue";
import OperacionesRamosPage from "@/pages/catalogos/OperacionesRamosPage.vue";
import ReaseguradoresPage from "@/pages/catalogos/ReaseguradoresPage.vue";
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
          ],
        },
      ],
    },
  ];

  return {
    routes,
  };
};
