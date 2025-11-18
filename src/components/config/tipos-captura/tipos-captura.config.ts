import { TipoCapturaActions } from "@/API/catalogos/tipos-captura/tipo-captura.actions";

const actions = TipoCapturaActions();

export const TiposCapturaConfig = {
  entity: "tipos-captura",
  title: "Tipos captura",
  searchPlaceholder: "tipo captura...",
  addButtonText: "Agregar tipo captura",
  modalTitle: "Agregar nuevo tipo captura",
  tableTitle: "Lista de Tipos captura",

  headers: [
    { title: "Clave", key: "cveTcaptura", sortable: true },
    { title: "Descripción", key: "descTcaptura", sortable: true },
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
      name: "cveTcaptura",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveTcaptura",
    },
    {
      name: "descTcaptura",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descTcaptura",
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
    cveTcaptura: (value: string) => value?.length >= 2 || "La clave es requerida",
    descTcaptura: (value: string) => value?.length > 0 || "La descripción es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchTipoCapturas,
    create: actions.createTipoCaptura,
    update: actions.updateTipoCaptura,
    delete: actions.deleteTipoCaptura,
  },
};
