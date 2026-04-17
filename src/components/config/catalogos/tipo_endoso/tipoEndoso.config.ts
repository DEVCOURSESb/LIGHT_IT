import { TipoEndosoActions } from "@/API/catalogos/tipo_endoso/tipo_endoso.actions"
import { handleValidations } from "@/utils/validations/handleValidations";

const actions = TipoEndosoActions()
const { minMaxString, validateBoolean, transformToUpperCase } = handleValidations();

export const TipoEndosoConfig = {
  entity: "tipoEndoso",
  title: "Tipo de endoso",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nuevo tipo endoso",
  editModalTitle: "Editar tipo endoso",
  tableTitle: "Lista de tipos de endoso",

  headers: [
    { title: "CLAVE", key: "cveTipoEndoso", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    /* { title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    }, */
    { title: "DESCRIPCIÓN TIPO ENDOSO", key: "descTipoEndoso", sortable: true,
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
      name: "cveTipoEndoso",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveTipoEndoso",
      defaultValue: 0,
    },
    {
      name: "descTipoEndoso",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descTipoEndoso",
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
      transformFromAPI: (value: boolean) => !!value,
      transformToAPI: (value: boolean) => value ? 1 : 2,
    },
  ],

  validationSchema: {
    // numerico, 3 digitos max,
    cveTipoEndoso: (value: string) => minMaxString(value, 1, 1) || "La clave es requerida, mínimo 1 y máximo 1 caracteres.",
    // alfanumerico, max 100 chars.
    descTipoEndoso: (value: string) => minMaxString(value, 1, 1000) || "El nombre es requerido y mínimo de 1000 caracteres.",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
