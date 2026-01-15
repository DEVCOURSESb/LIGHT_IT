import { TipoAsignacionActions } from "@/API/catalogos/tipo-asignacion/tipo-asignacion.actions"
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = TipoAsignacionActions()

const { minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const tipoAsignacionConfig = {
  entity: "tipo-asignacion",
  title: "Asignación",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nuevo tipo asignación",
  editModalTitle: "Editar tipo asignación",
  tableTitle: "Lista de Tipo Asignación",

  headers: [
    { title: "CLAVE", key: "cveAsignacion", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "ASIGNACIÓN", key: "descAsignacion", sortable: true,
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
      name: "descAsignacion",
      label: "Formula PTU",
      type: "text",
      required: true,
      dataKey: "descAsignacion",
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
    // cveAsignacion: (value: number) => !!value && value > 0 || "La clave es requerida y mayor que 0",
    descAsignacion: (value: string) => minMaxString(value, 1, 20) || "La fórmula es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchTipoAsignacion,
    create: actions.createTipoAsignacion,
    update: actions.updateTipoAsignacion,
    delete: actions.deleteTipoAsignacion,
  },
}
