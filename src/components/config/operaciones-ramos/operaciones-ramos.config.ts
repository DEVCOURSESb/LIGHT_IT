import { OperacionesRamosActions } from "@/API/catalogos/operaciones-ramos/operaciones-ramos.actions";

const actions = OperacionesRamosActions();

export const operacionesRamosConfig = {
  entity: "operaciones-ramos",
  title: "Operaciones Ramos",
  searchPlaceholder: "operación ramo",
  addButtonText: "Agregar operación ramo",
  modalTitle: "Agregar nuevo operación ramo",
  tableTitle: "Lista de Operaciones Ramos",

  headers: [
    { title: "Clave cobertura", key: "cveCobertura", sortable: true },
    { title: "Clave extra cobertura", key: "cveExtCober", sortable: true },
    { title: "Descripción operación ramos", key: "descOperacionRamos", sortable: true, },
    { title: "Activo", key: "esActivo", sortable: true },
    { title: "Fecha de registro", key: "fechaRegistro", sortable: true },
    { title: "Operación", key: "operacion", sortable: false },
    { title: "Ramo", key: "ramo", sortable: false },
    { title: "Subramo", key: "subramo", sortable: false },
    { title: "Subsubramo", key: "subsubramo", sortable: false },
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
      name: "cveCobertura",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveCobertura",
      defaultValue: "",
    },
    {
      name: "cveExtCober",
      label: "Clave extra cobertura",
      type: "text",
      required: true,
      dataKey: "cveExtCober",
      defaultValue: "",
    },
    {
      name: "descOperacionRamos",
      label: "Descripción operación ramos",
      type: "text",
      required: true,
      dataKey: "descOperacionRamos",
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
    {
      name: "operacion",
      label: "Operación",
      type: "text",
      required: true,
      dataKey: "operacion",
      defaultValue: "",
    },
    {
      name: "ramo",
      label: "Ramo",
      type: "text",
      required: true,
      dataKey: "ramo",
      defaultValue: "",
    },
    {
      name: "subramo",
      label: "Subramo",
      type: "text",
      required: true,
      dataKey: "subramo",
      defaultValue: "",
    },
    {
      name: "subsubramo",
      label: "Subsubramo",
      type: "text",
      required: true,
      dataKey: "subsubramo",
      defaultValue: "",
    },
  ],

  validationSchema: {
    cveCobertura: (value: string) => value?.length > 0 || "La clave es requerida",
    cveExtCober: (value: string) => value?.length > 0 || "La clave extra cobertura es requerida",
    descOperacionRamos: (value: string) => value?.length > 0 || "La descripción es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
    operacion: (value: string) => value?.length > 0 || "La operación es requerida",
    ramo: (value: string) => value?.length > 0 || "El ramo es requerido",
    subramo: (value: string) => value?.length > 0 || "El subramo es requerido",
    subsubramo: (value: string) => value?.length > 0 || "El subsubramo es requerido",
  },

  apiActions: {
    fetch: actions.fetchOperacionesRamos,
    create: actions.createOperacionRamo,
    update: actions.updateOperacionRamo,
    delete: actions.deleteOperacionRamo,
  },
};
