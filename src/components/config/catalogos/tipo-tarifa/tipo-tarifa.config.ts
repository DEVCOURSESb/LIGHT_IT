import { TipoTarifaActions } from "@/API/catalogos/tipos-tarifa/tipos-tarifa.actions"
import { handleValidations } from "@/utils/validations/handleValidations";

const actions = TipoTarifaActions()
const { minMaxString, validateBoolean, transformToUpperCase, transformBooleanToNumber } = handleValidations();

export const tipoTarifaConfig = {
  entity: "tipo-tarifa",
  title: "Tipo de Tarifa",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Tipo de tarifa",
  editModalTitle: "Editar tipo de tarifa",
  tableTitle: "Lista de tipos de tarifas",

  headers: [
    { title: "CLAVE", key: "cveTarifa", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "DESCRIPCIÓN", key: "descTarifa", sortable: true,
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
      name: "cveTarifa",
      label: "Clave",
      type: "number",
      required: true,
      disabled: true,
      dataKey: "cveTarifa",
      defaultValue: 0,
      transformToAPI: (value: string) => Number(value),
    },
    {
      name: "descTarifa",
      label: "Descripción",
      type: "text",
      required: true,
      dataKey: "descTarifa",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
     {
      name: "fechaRegistro",
      label: "Fecha de Registro",
      type: "text",
      hidden: true,
      dataKey: "fechaRegistro",
      defaultValue: "",
      displayType: "date",
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
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    //cveTarifa: (value: number) => minMaxString(value.toString(), 1, 10) || "La clave es requerida",
    descTarifa: (value: string) => minMaxString(value, 1, 50) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchTipoTarifa,
    create: actions.createTipoTarifa,
    update: actions.updateTipoTarifa,
    delete: actions.deleteTipoTarifa,
  },
}
  