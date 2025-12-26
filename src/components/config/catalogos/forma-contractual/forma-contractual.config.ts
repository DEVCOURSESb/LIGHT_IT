import { FormaContractualActions } from "@/API/catalogos/forma-contractual/forma-contractual.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = FormaContractualActions();
const { minMax, minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const FormaContractualConfig = {
  entity: "forma-contractual",
  title: "Forma contractual",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nueva forma",
  tableTitle: "Lista de forma contractual",

  headers: [
    /* { title: "CLAVE", key: "cveFcontrac", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    }, */
    { title: "FORMA CONTRACTUAL", key: "descFcontrac", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "ACTIVO", key: "esActivo", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    /* { title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true,
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
      name: "cveFcontrac",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveFcontrac",
      defaultValue: 0,
    },
    {
      name: "descFcontrac",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descFcontrac",
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
    cveFcontrac: (value: number) => minMax(value, 0, 9) || "La clave es requerida y mayor que 0",
    descFcontrac: (value: string) => minMaxString(value, 1, 20) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchFormaContractual,
    create: actions.createFormaContractual,
    update: actions.updateFormaContractual,
    delete: actions.deleteFormaContractual,
  },
};
