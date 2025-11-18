import { FormaContractualActions } from "@/API/catalogos/forma-contractual/forma-contractual.actions";

const actions = FormaContractualActions();

export const FormaContractualConfig = {
  entity: "distribucion-cesion",
  title: "Distribución de Cesión",
  searchPlaceholder: "distribución...",
  addButtonText: "Agregar distribución",
  modalTitle: "Agregar nueva distribución",
  tableTitle: "Lista de Distribuciones de Cesión",

  headers: [
    { title: "Clave", key: "cveFcontrac", sortable: true },
    { title: "Descripción", key: "descFcontrac", sortable: true },
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
      name: "cveFcontrac",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveFcontrac",
    },
    {
      name: "descFcontrac",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descFcontrac",
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
    cveFcontrac: (value: string) => value?.length >= 2 || "La clave es requerida",
    descFcontrac: (value: string) => value?.length > 0 || "La descripción es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchFormaContractual,
    create: actions.createFormaContractual,
    update: actions.updateFormaContractual,
    delete: actions.deleteFormaContractual,
  },
};
