import { TipoReaseguroActions } from "@/API/catalogos/tipo-reaseguro/tipo-reaseguro.actions";

const actions = TipoReaseguroActions();

export const tipoReaseguroConfig = {
  entity: "tipo-reaseguro",
  title: "Tipo reaseguro",
  searchPlaceholder: "tipo reaseguro",
  addButtonText: "Agregar tipo de reaseguro",
  modalTitle: "Tipo de reaseguro",
  tableTitle: "Lista de tipos de Reaseguro",

  headers: [
    { title: "Clave", key: "cveTreaseg", sortable: true },
    { title: "Descripción", key: "descTreaseg", sortable: true },
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
      name: "cveTreaseg",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveTreaseg",
    },
    {
      name: "descTreaseg",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descTreaseg",
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
    cveTreaseg: (value: string) =>
      value?.length >= 2 || "La clave es requerida",
    descTreaseg: (value: string) =>
      value?.length > 0 || "La fórmula es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchTipoReaseguro,
    create: actions.createTipoReaseguro,
    update: actions.updateTipoReaseguro,
    delete: actions.deleteTipoReaseguro,
  },
};
