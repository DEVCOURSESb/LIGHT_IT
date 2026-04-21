import { CriterioCoberturaActions } from "@/API/catalogos/criterio_cobertura/criterio_cobertura.actions";
import { handleValidations } from "@/utils/validations/handleValidations";

const actions = CriterioCoberturaActions();
const { minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = handleValidations();

export const CriterioCoberturaConfig = {
  entity: "CriterioCobertura",
  title: "Criterio de Cobertura",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nuevo Criterio Cobertura",
  tableTitle: "Lista de criterio coberturas",

  headers: [
    { title: "CLAVE", key: "cveCriterioCob", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    /*{ title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    }, */
    { title: "CRITERIO DE COBERTURA", key: "descCriterioCob", sortable: true,
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
      name: "cveCriterioCob",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveCriterioCob",
      defaultValue: 0,
    }, */
    {
      name: "descCriterioCob",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descCriterioCob",
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
    // TODO: max en db +1
    // cveCriterioCob: (value: number) => minMax(value, 0, 9) || "La clave es requerida, mayor a 0 y máximo 3 dígitos.",
    // alfanumerico, max 1000 chars.
    descCriterioCob: (value: string) => minMaxString(value, 1, 1000) || "El nombre es requerido y máximo de 1000 caracteres.",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
