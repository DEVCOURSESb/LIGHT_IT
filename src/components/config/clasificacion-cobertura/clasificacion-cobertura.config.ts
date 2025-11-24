import { ClasificacionCoberturaActions } from "@/API/catalogos/clasificacion/clasificacion-cobertura.actions";

const actions = ClasificacionCoberturaActions();

export const ClasificacionCoberturaConfig = {
  entity: "clasificacion-cobertura",
  title: "Clasificación cobertura",
  searchPlaceholder: "cobertura...",
  addButtonText: "Agregar cobertura",
  modalTitle: "Agregar nueva cobertura",
  tableTitle: "Lista de Clasificación Coberturas",

  headers: [
    { title: "Clave", key: "cveClasifcober", sortable: true },
    { title: "Descripción", key: "descClasifcober", sortable: true },
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
      name: "cveClasifcober",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveClasifcober",
      defaultValue: 0,
    },
    {
      name: "descClasifcober",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descClasifcober",
      defaultValue: "",
    },
    {
      name: "activo",
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
    cveClasifcober: (value: number) => !!value && value > 0 || "La clave es requerida y mayor que 0",
    descClasifcober: (value: string) => value?.length > 0 || "La descripción es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchClasificaciones,
    create: actions.createClasificacion,
    update: actions.updateClasificacion,
    delete: actions.deleteClasificacion,
  },
};
