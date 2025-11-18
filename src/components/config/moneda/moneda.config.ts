import { MonedaActions } from "@/API/catalogos/monedas/moneda.actions";

const actions = MonedaActions();

export const monedaConfig = {
  entity: "moneda",
  title: "Monedas",
  searchPlaceholder: "moneda",
  addButtonText: "Agregar moneda",
  modalTitle: "Agregar nuevo moneda",
  tableTitle: "Lista de Monedas",

  headers: [
    { title: "Clave", key: "cveMoneda", sortable: true },
    { title: "Descripción", key: "descMoneda", sortable: true },
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
      name: "cveMoneda",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveMoneda",
    },
    {
      name: "descMoneda",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descMoneda",
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
    cveMoneda: (value: string) => value?.length >= 2 || "La clave es requerida",
    descMoneda: (value: string) => value?.length > 0 || "La descripción es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchMonedas,
    create: actions.createMoneda,
    update: actions.updateMoneda,
    delete: actions.deleteMoneda,
  },
};
