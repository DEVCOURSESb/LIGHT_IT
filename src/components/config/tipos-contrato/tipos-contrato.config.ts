import { TiposContratoActions } from "@/API/catalogos/tipos-contrato/tipos-contrato.actions";

const actions = TiposContratoActions();

export const tiposContratoConfig = {
  entity: "tipos-contrato",
  title: "Tipos de Contrato",
  searchPlaceholder: "tipo contrato",
  addButtonText: "Agregar tipo de contrato",
  modalTitle: "Agregar nuevo tipo de contrato",
  tableTitle: "Lista de Tipos de Contrato",

  headers: [
    { title: "Clave", key: "cveTcontrato", sortable: true },
    { title: "Clave tipo reaseguro", key: "cveTreaseg", sortable: true },
    { title: "Descripción tipo contrato", key: "descTcontrato", sortable: true },
    { title: "Activo", key: "esActivo", sortable: true },
    { title: "Fecha de registro", key: "fechaRegistro", sortable: true },
    { title: "Tipo contrato", key: "idTcontrato", sortable: false, },
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
      name: "cveTcontrato",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveTcontrato",
    },
    {
      name: "cveTreaseg",
      label: "Clave tipo reaseguro",
      type: "text",
      required: true,
      dataKey: "cveTreaseg",
    },
    {
      name: "descTcontrato",
      label: "Descripción tipo contrato",
      type: "text",
      required: true,
      dataKey: "descTcontrato",
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
    {
      name: "idTcontrato",
      label: "ID tipo contrato",
      type: "text",
      required: true,
      dataKey: "idTcontrato",
    },
  ],

  validationSchema: {
    cveTcontrato: (value: string) => value?.length >= 2 || "La clave es requerida",
    cveTreaseg: (value: string) => value?.length > 0 || "La clave tipo reaseguro es requerida",
    descTcontrato: (value: string) => value?.length > 0 || "La descripción es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
    idTcontrato: (value: string) => value?.length > 0 || "El ID tipo contrato es requerido",
  },

  apiActions: {
    fetch: actions.fetchTipoContratos,
    create: actions.createTipoContrato,
    update: actions.updateTipoContrato,
    delete: actions.deleteTipoContrato,
  },
};
