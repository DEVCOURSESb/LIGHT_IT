import { TipoCambioActions } from "@/API/catalogos/tipo_cambio/tipo_cambio.actions";

const actions = TipoCambioActions();

export const tipoCambioConfig = {
  entity: "tipoCambio",
  title: "Tipo Cambio",
  searchPlaceholder: "Tipo Cambio",
  addButtonText: "Registro individual",
  modalTitle: "Agregar nuevo tipo cambio",
  tableTitle: "Lista de Tipo Cambio",

  headers: [
    {
      title: "CLAVE",
      key: "cveMonedaOrigen",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "FECHA DE REGISTRO",
      key: "fechaRegistro",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "FECHA",
      key: "fecha",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "TIPO DE CAMBIO",
      key: "tipoCambio",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "ACTIVO",
      key: "esActivo",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "ACCIONES",
      key: "actions",
      sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
  ],

  fields: [
    {
      name: "id",
      label: "ID",
      type: "text",
      hidden: true,
    },
    {
      name: "cveMonedaOrigen",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveMonedaOrigen",
      defaultValue: 0,
    },
    {
      name: "tipoCambio",
      label: "Tipo de Cambio",
      type: "decimal",
      required: true,
      dataKey: "tipoCambio",
      transformToAPI: (value: string) => value.toUpperCase(),
    },
    {
      name: "esActivo",
      label: "Activo",
      type: "Checkbox",
      required: true,
      dataKey: "esActivo",
      defaultValue: true,
      transformFromAPI: (value: number) => value === 1,
      transformToAPI: (value: boolean) => (value ? 1 : 2),
    },
  ],

  validationSchema: {
    // numerico, 3 digitos max,
    cveMonedaOrigen: (value: number) => (!!value && value <= 999) || "La clave es requerida, mayor a 0 y máximo 3 dígitos.",
    // alfanumerico, max 100 chars.
    tipoCambio: (value: string) => (value?.length > 0 && value?.length <= 100) || "El nombre es requerido y mínimo de 100 caracteres.",
    esActivo: (value: boolean) => value !== undefined || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
};
