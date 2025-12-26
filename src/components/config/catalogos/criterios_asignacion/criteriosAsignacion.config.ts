import { CriteriosAsignacionActions } from "@/API/catalogos/criterios_asignacion/criterios_asignacion.actions"
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = CriteriosAsignacionActions()

const { minMax, minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const criteriosAsignacionConfig = {
  entity: "criteriosAsignacion",
  title: "Criterios de Asignación",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nuevo criterio asignacion",
  tableTitle: "Lista de criterios de asignacion",

  headers: [
    /* { title: "CLAVE CRITERIO ASIGNACION", key: "cveCriterioAsig", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true,
    headerProps: {
      style: "font-weight: bold",
    },
  },
  */
    { title: "CRITERIOS DE ASIGNACIÓN", key: "descCriterioAsig", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "ACTIVO", key: "esActivo", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
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
      name: "cveCriterioAsig",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveCriterioAsig",
      defaultValue: 0,
    }, */
    {
      name: "descCriterioAsig",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descCriterioAsig",
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
    // cveCriterioAsig: (value: number) => !!value && value <= 999 || "La clave es requerida, mayor a 0 y máximo 3 dígitos.",
    // alfanumerico, max 100 chars.0
    descCriterioAsig: (value: string) => minMaxString(value, 1, 1000) || "El nombre es requerido y máximo de 1000 caracteres.",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
