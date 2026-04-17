import { CoberturasAyeActions } from "@/API/catalogos/coberturas_aye/coberturas_aye.actions";
import { handleValidations } from "@/utils/validations/handleValidations";

const actions = CoberturasAyeActions();

const {
  minMaxString,
  minMax,
  validateBoolean,
  transformBooleanToNumber,
  transformNumberToBoolean,
  transformToUpperCase,
} = handleValidations();

export const coberturasAyeConfig = {
  entity: "coberturas_aye",
  title: "Coberturas Accidentes y Enfermedades",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nueva Cobertura AYE",
  editModalTitle: "Editar Cobertura AYE",
  tableTitle: "Lista de Coberturas AYE",

  headers: [
    {
      title: "CLAVE",
      key: "cveCobaye",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "COBERTURA AYE",
      key: "descCobaye",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "CLAVE COBERTURA LATINO",
      key: "tcob",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "OPERACIÓN / RAMO",
      key: "cveCobertura",
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
      name: "cveCobaye",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveCobaye",
      defaultValue: "",
      disabled: true
    },
    {
      name: "descCobaye",
      label: "Descripción Cobertura AYE",
      type: "text",
      required: true,
      dataKey: "descCobaye",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: "tcob",
      label: "Tipo Cobertura",
      type: "number",
      required: true,
      dataKey: "tcob",
      defaultValue: "",
    },
    //TODO: “REASEG_CAT_CNSFINT_OPER_Y_RAMOS_ANX38_1_7”
    //Visualización: se mostrará la columna DESC_OPERACION_RAMOS pero se almacenará la columna CVE_COBERTURA
    {
      name: "cveCobertura",
      label: "Clave Cobertura",
      type: "text",
      required: true,
      dataKey: "cveCobertura",
      defaultValue: "",
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
      transformFromAPI: (value: number) => transformNumberToBoolean(value),
    },
  ],

  validationSchema: {
    //cveCobaye: (value: number) => !!value || "La clave es requerida",
    descCobaye: (value: string) => minMaxString(value, 1, 1000) || "La descripción es requerida",
    tcob: (value: number) => minMax(value, 1, 99999),
    cveCobertura: (value: string) => minMaxString(value, 1, 1) || "clave de covertura es requerido",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deleteF,
  },
};
