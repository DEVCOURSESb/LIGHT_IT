import { CoberturasActions } from "@/API/catalogos/coberturas/coberturas.actions"
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = CoberturasActions()
const { minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const coberturaConfig = {
  entity: "cobertura",
  title: "Coberturas",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar cobertura",
  editModalTitle: "Editar cobertura",
  tableTitle: "Lista de Coberturas",

  headers: [
    /* { title: "ID COBERTURA", key: "idCob", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },*/
    { title: "CLAVE", key: "cveCob", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "DESCRIPCIÓN", key: "descCob", sortable: true,
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
    {
      name: "idCob",
      label: "ID Cobertura",
      type: "text",
      required: true,
      dataKey: "idCob",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: "descCob",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descCob",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: "esActivo",
      label: "Activo",
      type: "Checkbox",
      required: true,
      defaultValue: true,
      dataKey: "esActivo",
      displayType: "checkbox",
      transformFromAPI: (value: number) => transformNumberToBoolean(value),
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    idCob: (value: string) => minMaxString(value, 1, 10) || "el id de cobertura es requerido",
    descCob: (value: string) => minMaxString(value, 1, 50) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchCoberturas,
    create: actions.createCobertura,
    update: actions.updateCobertura,
    delete: actions.deleteCobertura,
  },
}
