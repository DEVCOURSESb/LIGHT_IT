import { TipoReaseguroActions } from "@/API/catalogos/tipo-reaseguro/tipo-reaseguro.actions"
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = TipoReaseguroActions()
const { minMax, minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const tipoReaseguroConfig = {
  entity: "tipo-reaseguro",
  title: "Tipo reaseguro",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Tipo de reaseguro",
  editModalTitle: "Editar tipo de reaseguro",
  tableTitle: "Lista de tipos de Reaseguro",

  headers: [
    /* { title: "CLAVE", key: "cveTreaseg", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    }, */
    { title: "TIPO REASEGURO", key: "descTreaseg", sortable: true,
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
    { title: "ACCIONES", key: "actions", sortable: false,
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
    /* {
      name: "cveTreaseg",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveTreaseg",
      defaultValue: 0,
    }, */
    {
      name: "descTreaseg",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descTreaseg",
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
    // TODO: la clave es automatica, el mayor en db +1
    /* cveTreaseg: (value: number) => minMax(value, 1, 9) || "La clave es requerida y mayor a 0", */
    descTreaseg: (value: string) => minMaxString(value, 1, 20) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchTipoReaseguro,
    create: actions.createTipoReaseguro,
    update: actions.updateTipoReaseguro,
    delete: actions.deleteTipoReaseguro,
  },
}
