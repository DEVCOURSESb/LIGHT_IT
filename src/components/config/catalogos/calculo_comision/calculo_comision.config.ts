import { CalculoComisionActions } from "@/API/catalogos/calculo_comision/calculo_comision.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = CalculoComisionActions();

const {
  minMaxString,
  validateBoolean,
  transformBooleanToNumber,
  transformToUpperCase,
} = validationsHandler();

export const calculoComisionConfig = {
  entity: "calculo_comision",
  title: "Método Cálculo Comisión",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nueva Calculo Comision",
  editModalTitle: "Editar Calculo Comision",
  tableTitle: "Lista de Calculo Comision",

  headers: [
    {
      title: "CLAVE",
      key: "cveCalcomis",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "FÓRMULA COMISIÓN",
      key: "formulaComision",
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
      name: "cveCalcomis",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveCalcomis",
      defaultValue: "",
      disabled: true,
    },
    {
      name: "formulaComision",
      label: "Fórmula comisión",
      type: "text",
      required: true,
      dataKey: "formulaComision",
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
    //cveCalcomis: (value: number) => !!value || "La clave es requerida",
    formulaComision: (value: string) =>
      minMaxString(value, 1, 1000) || "La fórmula de comisión es requerida",
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
