import { PtuActions } from "@/API/catalogos/ptu/ptu.actions";

const actions = PtuActions();

export const ptuConfig = {
  entity: "ptu",
  title: "PTU",
  searchPlaceholder: "ptu",
  addButtonText: "Agregar ptu",
  modalTitle: "Agregar nuevo ptu",
  tableTitle: "Lista de PTU",

  headers: [
    { title: "Clave", key: "cvePtu", sortable: true },
    { title: "Formula PTU", key: "formulaPtu", sortable: true },
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
      name: "cvePtu",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cvePtu",
      defaultValue: 0,
    },
    {
      name: "formulaPtu",
      label: "Formula PTU",
      type: "text",
      required: true,
      dataKey: "formulaPtu",
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
    cvePtu: (value: number) => !!value && value > 0 || "La clave es requerida y mayor que 0",
    formulaPtu: (value: string) => value?.length > 0 || "La fórmula es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchPtus,
    create: actions.createPtu,
    update: actions.updatePtu,
    delete: actions.deletePtu,
  },
};
