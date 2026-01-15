import { ClasificacionCoberturaActions } from "@/API/catalogos/clasificacion/clasificacion-cobertura.actions"
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = ClasificacionCoberturaActions()

const { minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const ClasificacionCoberturaConfig = {
  entity: "clasificacion-cobertura",
  title: "Clasificación cobertura",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nueva cobertura",
  editModalTitle: "Editar clasificación de cobertura",
  tableTitle: "Lista de Clasificación Coberturas",

  headers: [
    { title: "CLAVE", key: "cveClasifcober", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "CLASIFICACIÓN DE LA COBERTURA", key: "descClasifcober", sortable: true,
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
      name: "descClasifcober",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descClasifcober",
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
    //cveClasifcober: (value: number) => !!value && value > 0 || "La clave es requerida y mayor que 0",
    descClasifcober: (value: string) => minMaxString(value, 1, 10) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchClasificaciones,
    create: actions.createClasificacion,
    update: actions.updateClasificacion,
    delete: actions.deleteClasificacion,
  },
}
