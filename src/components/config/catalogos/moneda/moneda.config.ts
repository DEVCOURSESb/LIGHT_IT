import { MonedaActions } from "@/API/catalogos/monedas/moneda.actions"
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = MonedaActions()
const { minMax, minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const monedaConfig = {
  entity: "moneda",
  title: "Moneda",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar moneda",
  editModalTitle: "Editar moneda",
  tableTitle: "Lista de Monedas",

  headers: [
    { title: "MONEDA", key: "cveMoneda", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "DESCRIPCIÓN", key: "descMoneda", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "ACTIVO", key: "esActivo", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
  /*   { title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    }, */
    { title: "EDITAR", key: "actions", sortable: false,
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
      name: "cveMoneda",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveMoneda",
      defaultValue: 0,
    },
    {
      name: "descMoneda",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descMoneda",
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
      transformFromAPI: (value: number) => transformNumberToBoolean(value),
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    cveMoneda: (value: number) => minMax(value, 0, 99) || "La clave es requerida y mayor que 0",
    descMoneda: (value: string) => minMaxString(value, 1, 100) || "La descripción es requerida, máximo 100 caracteres.",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchMonedas,
    create: actions.createMoneda,
    update: actions.updateMoneda,
    delete: actions.deleteMoneda,
  },
}
