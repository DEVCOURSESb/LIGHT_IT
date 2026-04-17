import { EstatusReciboActions } from "@/API/catalogos/estatus_recibo/estatus_recibo.actions"
import { handleValidations } from "@/utils/validations/handleValidations";

const actions = EstatusReciboActions()
const { minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = handleValidations();

export const estatusReciboConfig = {
  entity: "estatusRecibo",
  title: "Estatus Recibo",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nuevo estatus recibo",
  editModalTitle: "Editar estatus recibo",
  tableTitle: "Lista de estatus recibo",
  headers: [
   { title: "CLAVE", key: "cveEstatusRec", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },/*
    { title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    }, */
    { title: "DESCRIPCIÓN", key: "descEstatusRec", sortable: true,
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
    {
      name: "descEstatusRec",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descEstatusRec",
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
    //cveEstatusRec: (value: number) => !!value && value <= 999 || "La clave es requerida, mayor a 0 y máximo 3 dígitos.",
    // alfanumerico, max 100 chars.
    descEstatusRec: (value: string) => minMaxString(value, 1, 1000) || "El nombre es requerido, mínimo 1 y máximo de 1000 caracteres.",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
