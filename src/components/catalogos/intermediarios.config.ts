// config/catalogos/intermediarios.config.ts
import { IntermediariosActions } from "@/API/catalogos/intermediarios/intermediariosActions";

const actions = IntermediariosActions();

export const intermediariosConfig = {
  entity: "intermediarios",
  title: "Intermediarios",
  searchPlaceholder: "intermediarios",
  addButtonText: "Agregar intermediario",
  modalTitle: "Agregar nuevo intermediario",
  tableTitle: "Lista de Intermediarios",

  headers: [
    { title: "Clave intermediario", key: "cveIntermediario", sortable: true },
    { title: "Activo", key: "esActivo", sortable: true },
    { title: "Fecha de registro", key: "fechaRegistro", sortable: true },
    { title: "Nombre intermediario", key: "nombreIntermediario", sortable: false },
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
      name: "clave",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveIntermediario",
    },
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true,
      dataKey: "nombreIntermediario",
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
    clave: (value: string) => value?.length > 3 || "La clave es requerida",
    nombre: (value: string) => value?.length > 0 || "El nombre es requerido",
    activo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchIntermediarios,
    create: actions.createIntermediario,
    update: actions.updateIntermediario,
    delete: actions.deleteIntermediario,
  },
};