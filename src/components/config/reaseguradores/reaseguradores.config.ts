import { ReaseguradoresActions } from "@/API/catalogos/reaseguradores/reaseguradores.actions";

const actions = ReaseguradoresActions();

export const reaseguradoresConfig = {
  entity: "reaseguradores",
  title: "Reaseguradores",
  searchPlaceholder: "reasegurador",
  addButtonText: "Agregar reasegurador",
  modalTitle: "Agregar nuevo reasegurador",
  tableTitle: "Lista de reaseguradores",

  headers: [
    { title: "Clave reasegurador", key: "cveReasegurador", sortable: true },
    { title: "Fecha de registro", key: "fechaRegistro", sortable: true },
    { title: "Nombre reasegurador", key: "nombreReasegurador", sortable: false, },
    { title: "Registro CNSF", key: "registroCnsf", sortable: false },
    { title: "Activo", key: "esActivo", sortable: true },
    { title: "Extranjero", key: "extranjero", sortable: true },
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
      name: "cveReasegurador",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveReasegurador",
      defaultValue: 0,
    },
    {
      name: "nombreReasegurador",
      label: "Nombre",
      type: "text",
      required: true,
      dataKey: "nombreReasegurador",
      defaultValue: "",
    },
    {
      name: "registroCnsf",
      label: "Registro CNSF",
      type: "text",
      required: true,
      dataKey: "registroCnsf",
      defaultValue: "",
    },
    {
      name: "extranjero",
      label: "Extranjero",
      type: "select",
      items: ["Sí", "No"],
      required: true,
      dataKey: "extranjero",
      defaultValue: "No",
      transformFromAPI: (value: number) => (value === 1 ? "Sí" : "No"),
      transformToAPI: (value: string) => (value === "Sí" ? 1 : 0),
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
    cveReasegurador: (value: number) => !!value && value > 0 || "La clave es requerida y mayor a 0",
    nombreReasegurador: (value: string) => value?.length > 0 || "El nombre es requerido",
    registroCnsf: (value: string) => value?.length > 0 || "El registro CNSF es requerido",
    extranjero: (value: string) => !!value || "El campo extranjero es requerido",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchReaseguradores,
    create: actions.createReasegurador,
    update: actions.updateReasegurador,
    delete: actions.deleteReasegurador,
  },
};
