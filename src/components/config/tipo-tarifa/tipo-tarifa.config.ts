import { TipoTarifaActions } from "@/API/catalogos/tipos-tarifa/tipos-tarifa.actions";

const actions = TipoTarifaActions();

export const tipoTarifaConfig = {
  entity: "tipo-tarifa",
  title: "Tipo tarifa",
  searchPlaceholder: "tipo tarifa",
  addButtonText: "Agregar tipo de tarifa",
  modalTitle: "Tipo de tarifa",
  tableTitle: "Lista de tipos de tarifas",

  headers: [
    { title: "Clave", key: "cveTarifa", sortable: true },
    { title: "Descripción", key: "descTarifa", sortable: true },
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
      name: "cveTarifa",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveTarifa",
    },
    {
      name: "descTarifa",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descTarifa",
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
    cveTarifa: (value: string) => value?.length >= 2 || "La clave es requerida",
    descTarifa: (value: string) =>
      value?.length > 0 || "La descripción es requerida",
    esActivo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchTipoTarifa,
    create: actions.createTipoTarifa,
    update: actions.updateTipoTarifa,
    delete: actions.deleteTipoTarifa,
  },
};
