import { TiposContratoActions } from "@/API/catalogos/tipos-contrato/tipos-contrato.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = TiposContratoActions();
const { minMax, minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const tiposContratoConfig = {
  entity: "tipos-contrato",
  title: "Tipos de Contrato",
  searchPlaceholder: "",
  addButtonText: "Agregar tipo de contrato",
  modalTitle: "Agregar nuevo tipo de contrato",
  editModalTitle: "Editar tipo de contrato",
  tableTitle: "Lista de Tipos de Contrato",

  headers: [
    { title: "CLAVE", key: "cveTcontrato", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "DESCRIPCIÓN TIPO DE CONTRATO", key: "descTcontrato", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "TIPO REASEGURO", key: "cveTreaseg", sortable: true,
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
    },
    { title: "TIPO DE CONTRATO", key: "idTcontrato", sortable: true,
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
      name: "cveTcontrato",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveTcontrato",
      defaultValue: 0,
    },
    {
      name: "cveTreaseg",
      label: "Clave tipo reaseguro",
      type: "number",
      required: true,
      dataKey: "cveTreaseg",
      defaultValue: 0,
    },
    {
      name: "descTcontrato",
      label: "Descripción tipo contrato",
      type: "text",
      required: true,
      dataKey: "descTcontrato",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: "esActivo",
      label: "Activo",
      type: "Checkbox",
      required: true,
      dataKey: "esActivo",
      defaultValue: true,
      displayType: "checkbox",
      transformFromAPI: (value: number) => transformNumberToBoolean(value),
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    cveTcontrato: (value: number) => minMax(value, 1, 99) || "La clave es requerida, mínimo 1 y máximo 2 dígitos.",
    cveTreaseg: (value: number) =>  minMax(value, 1, 99) || "La clave tipo reaseguro es requerida y mayor que 0",
    descTcontrato: (value: string) => minMaxString(value, 1, 100) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
    // TODO: el tipo contrato debe ser un selector sobre el catalogo de tipos de reaseguro
    idTcontrato: (value: number) => minMax(value, 1, 2) || "El ID tipo contrato es requerido y mayor que 0",
  },

  apiActions: {
    fetch: actions.fetchTipoContratos,
    create: actions.createTipoContrato,
    update: actions.updateTipoContrato,
    delete: actions.deleteTipoContrato,
  },
};
