import { ExtensionesActions } from "@/API/catalogos/extensiones/extensiones.actions"
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = ExtensionesActions()
const { minMax, minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const ExtensionesConfig = {
  entity: "extensiones",
  title: "Extensión de coberturas",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nueva extensión",
  editModalTitle: "Editar extensión",
  tableTitle: "Lista de extensiones",

  headers: [
    { title: "CLAVE", key: "cveExtCober", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "EXTENSIÓN DE LA COBERTURA", key: "descExtCober", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "ACTIVO", key: "esActivo", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
   /*  { title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true,
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
      name: "cveExtCober",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveExtCober",
      defaultValue: 0,
    },
    {
      name: "descExtCober",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descExtCober",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: "esActivo",
      label: "Activo",
      type: "Checkbox",
      items: ["Sí", "No"],
      required: true,
      dataKey: "esActivo",
      displayType: "checkbox",
      defaultValue: true,
      transformFromAPI: (value: number) => transformNumberToBoolean(value),
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    //TODO: la clave es automatica, el mayor en db +1
    cveExtCober: (value: number) => minMax(value, 1, 9) || "La clave es requerida y mayor que 0",
    descExtCober: (value: string) => minMaxString(value, 1, 20) || "La descripción es requerida, mínimo 1 y máximo 20 caracteres.",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchExtensiones,
    create: actions.createExtension,
    update: actions.updateExtension,
    delete: actions.deleteExtension,
  },
}
