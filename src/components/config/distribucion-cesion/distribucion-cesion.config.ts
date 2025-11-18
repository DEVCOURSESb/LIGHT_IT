import { DistribucionCesionActions } from "@/API/catalogos/distribucion-cesion/distribucion-cesion.actions";

const actions = DistribucionCesionActions();

export const DistribucionCesionConfig = {
  entity: "distribucion-cesion",
  title: "Distribución de Cesión",
  searchPlaceholder: "distribución...",
  addButtonText: "Agregar distribución",
  modalTitle: "Agregar nueva distribución",
  tableTitle: "Lista de Distribuciones de Cesión",

  headers: [
    { title: "Clave", key: "cveDistrcesion", sortable: true },
    { title: "Descripción", key: "descDistrcesion", sortable: true },
    { title: "Activo", key: "esActivo", sortable: true },
    { title: "Fecha de registro", key: "fechaRegistro", sortable: true },
    { title: "Acciones", key: "actions", sortable: false },
  ],

  fields: [
    {
      name: "id",
      label: "ID",
      type: "text",
      hidden: true,
    },
    {
      name: "cveDistrcesion",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveDistrcesion",
    },
    {
      name: "descDistrcesion",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descDistrcesion",
    },
    {
      name: "activo",
      label: "Activo",
      type: "select",
      items: ["Sí", "No"],
      required: true,
      dataKey: "esActivo",
      transformFromAPI: (value: number) => (value === 1 ? "Sí" : "No"),
      transformToAPI: (value: string) => (value === "Sí" ? 1 : 0),
    },
  ],

  validationSchema: {
    cveDistrcesion: (value: string) => value?.length >= 2 || "La clave es requerida",
    descDistrcesion: (value: string) => value?.length > 0 || "La descripción es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchDistribucionesCesion,
    create: actions.createDistribucionCesion,
    update: actions.updateDistribucionCesion,
    delete: actions.deleteDistribucionCesion,
  },
};
