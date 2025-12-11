import MainLayout from "@/layouts/MainLayout.vue";
import AdministracionPage from "@/pages/administracion/AdministracionPage.vue";
import AutenticacionC from "@/pages/AutenticacionC.vue";
import Home from "@/pages/Home.vue";
import Login from "@/pages/Login.vue";
import LoginC from "@/pages/LoginC.vue";
import ModificarContratosPage from "@/pages/reaseguro/Contratos/Daños/ModificarContratosPage.vue";
import NuevoContratoPage from "@/pages/reaseguro/Contratos/Daños/NuevoContratoPage.vue";
import VisualizarContratosPage from "@/pages/reaseguro/Contratos/Daños/VisualizarContratosPage.vue";
import NuevoContratoVidaPage from "@/pages/reaseguro/Contratos/Vida/NuevoContratoVidaPage.vue";
import ModificarContratoVidaPage from "@/pages/reaseguro/Contratos/Vida/ModificarContratosVidaPage.vue";
import VisualizarContratosVidaPage from "@/pages/reaseguro/Contratos/Vida/VisualizarContratosVidaPage.vue";

export function AppRouter() {
  const routes = [
    {
      path: "/",
      name: "login",
      component: Login,
      meta: { public: true },
    },
    {
      path: "/login",
      name: "loginC",
      component: LoginC,
      meta: { public: true },
    },
    {
      path: "/",
      component: MainLayout,
      meta: { requiresAuth: true, requiresVerification: true },
      children: [
        {
          path: "/home",
          name: "home",
          component: Home,
        },
        {
          path: "administracion/bitacora",
          name: "administracion",
          component: AdministracionPage,
          meta: { title: "Bitácora" },
        },
        // reaseguro - Daños
        {
          path: "/reaseguro/contratosReaseguro/nuevoContrato",
          name: "nuevoContrato",
          component: NuevoContratoPage,
          meta: { title: "Nuevo contrato" },
        },
        {
          path: "/reaseguro/contratosReaseguro/modificarContrato",
          name: "modificarContratos",
          component: ModificarContratosPage,
          meta: { title: "Modificar contrato" },
        },
        {
          path: "/reaseguro/contratosReaseguro/visualizarContrato",
          name: "visualizarContratos",
          component: VisualizarContratosPage,
          meta: { title: "Visualizar Contratos" },
        },
        // Vida
        {
          path: "/reaseguro/contratosReaseguro/nuevoContratoVida",
          name: "nuevoContratoVida",
          component: NuevoContratoVidaPage,
          meta: { title: "Visualizar Contratos Vida" },
        },
        {
          path: "/reaseguro/contratosReaseguro/modificarContratoVida",
          name: "modificarContratoVida",
          component: ModificarContratoVidaPage,
          meta: { title: "Visualizar Contratos" },
        },
        {
          path: "/reaseguro/contratosReaseguro/visualizarContratoVida",
          name: "visualizarContratoVida",
          component: VisualizarContratosVidaPage,
          meta: { title: "Visualizar Contratos" },
        },
        // Autos
        {
          path: "/reaseguro/visualizarContrato",
          name: "visualizarContratos",
          component: VisualizarContratosPage,
          meta: { title: "Visualizar Contratos" },
        },
      ],
    },
    {
      path: "/catalogos",
      component: MainLayout,
      children: [
        {
          path: "intermediarios",
          name: "intermediarios",
          component: () => import("@/pages/catalogos/IntermediariosPage.vue"),
          meta: { title: "Intermediarios" },
        },
        {
          path: "reaseguradores",
          name: "reaseguradores",
          component: () => import("@/pages/catalogos/ReaseguradoresPage.vue"),
          meta: { title: "Reaseguradores" },
        },
        {
          path: "operaciones_ramos",
          name: "operaciones_ramos",
          component: () => import("@/pages/catalogos/OperacionesRamosPage.vue"),
          meta: { title: "Operaciones Ramos" },
        },
        {
          path: "tipos_contrato",
          name: "tipos_contrato",
          component: () => import("@/pages/catalogos/TiposContratoPage.vue"),
          meta: { title: "Tipos Contrato" },
        },
        {
          path: "monedas",
          name: "monedas",
          component: () => import("@/pages/catalogos/MonedaPage.vue"),
          meta: { title: "Monedas" },
        },
        {
          path: "tipos_captura",
          name: "tipos_captura",
          component: () => import("@/pages/catalogos/TiposCapturaPage.vue"),
          meta: { title: "Tipos Captura" },
        },
        {
          path: "extensiones",
          name: "extensiones",
          component: () => import("@/pages/catalogos/ExtensionPage.vue"),
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
          component: () => import("@/pages/catalogos/FormaContractualPage.vue"),
          meta: { title: "Forma Contractual" },
        },
        {
          path: "ptu",
          name: "ptu",
          component: () => import("@/pages/catalogos/PtuPage.vue"),
          meta: { title: "PTU" },
        },
        {
          path: "asignacion",
          name: "asignacion",
          component: () => import("@/pages/catalogos/TipoAsignacionPage.vue"),
          meta: { title: "Tipo Asignación" },
        },
        {
          path: "tipo_reaseguro",
          name: "tipo_reaseguro",
          component: () => import("@/pages/catalogos/TipoReaseguroPage.vue"),
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
          path: "coberturas",
          name: "coberturas",
          component: () => import("@/pages/catalogos/CoberturaPage.vue"),
          meta: { title: "Coberturas" },
        },
        {
          path: "criterios_de_asignacion",
          name: "criterios_de_asignacion",
          component: () =>
            import("@/pages/catalogos/CriteriosAsignacionPage.vue"),
          meta: { title: "Criterios de Asignación" },
        },
        {
          path: "estatus_recibo",
          name: "estatus_recibo",
          component: () => import("@/pages/catalogos/EstatusReciboPage.vue"),
          meta: { title: "Estatus recibo" },
        },
        {
          path: "tipo_endoso",
          name: "tipo_endoso",
          component: () => import("@/pages/catalogos/TipoEndosoPage.vue"),
          meta: { title: "Tipo Endoso" },
        },
        {
          path: "forma_de_pago",
          name: "forma_de_pago",
          component: () => import("@/pages/catalogos/FormaPagoPage.vue"),
          meta: { title: "Forma Pago" },
        },
        {
          path: "sexo",
          name: "sexo",
          component: () => import("@/pages/catalogos/SexoPage.vue"),
          meta: { title: "Sexo" },
        },
        {
          path: "estatus",
          name: "estatus",
          component: () => import("@/pages/catalogos/EstatusPage.vue"),
          meta: { title: "Estatus" },
        },
        {
          path: "fumador",
          name: "fumador",
          component: () => import("@/pages/catalogos/FumadorPage.vue"),
          meta: { title: "Fumador" },
        },
        {
          path: "tipo_cambio",
          name: "tipo_cambio",
          component: () => import("@/pages/catalogos/TiposCambioPage.vue"),
          meta: { title: "Tipo Cambio" },
        },
        {
          path: "entidad_federativa",
          name: "entidad_federativa",
          component: () =>
            import("@/pages/catalogos/EntidadFederativaPage.vue"),
          meta: { title: "Entidad federativa" },
        },
        {
          path: "criterio_cobertura",
          name: "criterio_cobertura",
          component: () =>
            import("@/pages/catalogos/CriteriosCoberturaPage.vue"),
          meta: { title: "Criterio cobertura" },
        },
      ],
    },
  ];

  return { routes };
}
