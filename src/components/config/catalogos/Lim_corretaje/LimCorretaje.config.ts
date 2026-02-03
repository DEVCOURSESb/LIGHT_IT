import { LimCorretajeActions } from "@/API/catalogos/lim_corretaje/lim_corretaje.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = LimCorretajeActions();

const {
  minMaxString,
  validateBoolean,
  transformBooleanToNumber,
  transformToUpperCase,
} = validationsHandler();

export const limCorretajeConfig = {
  entity: "lim_corretaje",
  title: "Límite Corretaje",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nuevo Límite Corretaje",
  editModalTitle: "Editar Límite Corretaje",
  tableTitle: "Lista de Límite Corretaje",

  headers: [
    {
      title: "CLAVE",
      key: "cveLimcorretaje",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "LÍMITE CORRETAJE",
      key: "limiteCorretaje",
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
    /* { title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    }, */
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
      name: "cveLimcorretaje",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveLimcorretaje",
      defaultValue: "",
      disabled:true
    },
    {
      name: "limiteCorretaje",
      label: "Descripción Límite Corretaje",
      type: "text",
      required: true,
      dataKey: "limiteCorretaje",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: "esActivo",
      label: "Activo",
      type: "Checkbox",
      required: true,
      dataKey: "esActivo",
      displayType: "checkbox",
      defaultValue: true,
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    //cveLimcorretaje: (value: number) => minMax(value, 1, 9) || "La clave es requerida",
    limiteCorretaje: (value: string) =>
      minMaxString(value, 1, 1000) || "La descripción es requerida",
    esActivo: (value: boolean) =>
      validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deleteF,
  },
};
