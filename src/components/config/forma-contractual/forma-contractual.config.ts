import { FormaContractualActions } from "@/API/catalogos/forma-contractual/forma-contractual.actions";

const actions = FormaContractualActions();

export const FormaContractualConfig = {
  entity: "forma-contractual",
  title: "Forma contractual",
  searchPlaceholder: "forma contractual",
  addButtonText: "Agregar forma contractual",
  modalTitle: "Agregar nueva forma",
  tableTitle: "Lista de forma contractual",

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
      type: "number",
      required: true,
      dataKey: "cveFcontrac",
      defaultValue: 0,
    },
    {
      name: "descFcontrac",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descFcontrac",
      defaultValue: "",
    },
    {
      name: "esActivo",
      label: "Activo",
      type: "select",
      items: ["Sí", "No"],
      required: true,
      dataKey: "esActivo",
      defaultValue: "Sí",
      transformFromAPI: (value: number) => (value === 1 ? "Sí" : "No"),
      transformToAPI: (value: string) => (value === "Sí" ? 1 : 0),
    },
  ],

  validationSchema: {
    cveFcontrac: (value: number) => !!value && value > 0 || "La clave es requerida y mayor que 0",
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
