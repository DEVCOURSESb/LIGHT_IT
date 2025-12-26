import { IntermediariosActions } from "@/API/catalogos/intermediarios/intermediarios.actions"
import { validationsHandler } from "@/utilities/validations/validationsHandler"

const actions = IntermediariosActions()
const { minMax, minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const intermediariosConfig = {
  entity: "intermediarios",
  title: "Intermediarios",
  searchPlaceholder: "",
  addButtonText: "Registro individual",
  modalTitle: "Agregar nuevo intermediario",
  editModalTitle: "Editar intermediario",
  tableTitle: "Lista de Intermediarios",

  headers: [
    { title: "CLAVE INTERMEDIARIO", key: "cveIntermediario", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "INTERMEDIARIO", key: "nombreIntermediario", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "ACTIVO", key: "esActivo", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
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
      name: "cveIntermediario",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveIntermediario",
      defaultValue: 0,
    },
    {
      name: "nombreIntermediario",
      label: "Nombre",
      type: "text",
      required: true,
      dataKey: "nombreIntermediario",
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
    // numerico, 3 digitos max,
    cveIntermediario: (value: number) => minMax(value, 1, 999) || "La clave es requerida, mayor a 0 y máximo 3 dígitos.",
    // alfanumerico, max 100 chars.
    nombreIntermediario: (value: string) => minMaxString(value, 1, 100) || "El nombre es requerido y mínimo de 100 caracteres.",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchIntermediarios,
    create: actions.createIntermediario,
    update: actions.updateIntermediario,
    delete: actions.deleteIntermediario,
  },
}
