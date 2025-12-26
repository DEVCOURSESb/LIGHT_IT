import { OperacionesRamosActions } from "@/API/catalogos/operaciones-ramos/operaciones-ramos.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = OperacionesRamosActions();
const { minMaxString, validateBoolean, fillString, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const operacionesRamosConfig = {
  entity: "operaciones-ramos",
  title: "Operaciones y Ramos",
  searchPlaceholder: "",
  addButtonText: "Agregar operación ramo",
  modalTitle: "Agregar nuevo operación ramo",
  editModalTitle: "Editar operación ramo",
  tableTitle: "Lista de Operaciones Ramos",

  headers: [
    {
      title: "CLAVE COBERTURA",
      key: "cveCobertura",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "DESCRIPCIÓN DE LA COBERTURA",
      key: "descOperacionRamos",
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
    /**
    {
      title: "FECHA DE REGISTRO",
      key: "fechaRegistro",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "OPERACIÓN",
      key: "operacion",
      sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "RAMO",
      key: "ramo",
      sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "SUBRAMO",
      key: "subramo",
      sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "SUB-SUBRAMO",
      key: "subsubramo",
      sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
     */
    {
      title: "EDITAR",
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
    // TODO: hoja 20, pide validar con tablas en db cobertura y extracobertura son calculados
/*     {
      name: "cveCobertura",
      label: "Clave",
      type: "text",
      required: true,
      hidden: true,
      dataKey: "cveCobertura",
      defaultValue: "",
    }, */
    /* {
      name: "cveExtCober",
      label: "Clave extra cobertura",
      type: "text",
      required: true,
      hidden: true,
      dataKey: "cveExtCober",
      defaultValue: "",
    }, */
    {
      name: "operacion",
      label: "Operación",
      type: "text",
      required: true,
      dataKey: "operacion",
      defaultValue: "0000",
      transformToAPI: (value: string) => transformToUpperCase(fillString(value, 4, "0")),
    },
    {
      name: "ramo",
      label: "Ramo",
      type: "text",
      required: true,
      dataKey: "ramo",
      defaultValue: "000",
      transformToAPI: (value: string) => transformToUpperCase(fillString(value, 3, "0")),
    },
    {
      name: "subramo",
      label: "Subramo",
      type: "text",
      required: true,
      dataKey: "subramo",
      defaultValue: "000",
      transformToAPI: (value: string) => transformToUpperCase(fillString(value, 3, "0")),
    },
    {
      name: "subsubramo",
      label: "Subsubramo",
      type: "text",
      required: true,
      dataKey: "subsubramo",
      defaultValue: "0000",
      transformToAPI: (value: string) => transformToUpperCase(fillString(value, 4, "0")),
    },
    {
      name: "descOperacionRamos",
      label: "Descripción operación ramos",
      type: "text",
      required: true,
      dataKey: "descOperacionRamos",
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
    // cveCobertura: (value: string) => value?.length > 0 || "La clave es requerida",
    //cveExtCober: (value: string) => value?.length > 0 || "La clave extra cobertura es requerida",
    descOperacionRamos: (value: string) => minMaxString(value, 1, 100) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
    operacion: (value: string) => minMaxString(value, 1, 4) || "La operación es requerida, mínimo 1 y máximo 4 caracteres.",
    ramo: (value: string) => minMaxString(value, 1, 3) || "El ramo es requerido, mínimo 1 y máximo 3 caracteres.",
    subramo: (value: string) => minMaxString(value, 1, 3) || "El subramo es requerido, mínimo 1 y máximo 3 caracteres.",
    subsubramo: (value: string) => minMaxString(value, 1, 4) || "El subsubramo es requerido, mínimo 1 y máximo 4 caracteres.",
  },

  apiActions: {
    fetch: actions.fetchOperacionesRamos,
    create: actions.createOperacionRamo,
    update: actions.updateOperacionRamo,
    delete: actions.deleteOperacionRamo,
  },
};
