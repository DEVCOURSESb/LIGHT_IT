import { ReaseguradoresActions } from "@/API/catalogos/reaseguradores/reaseguradores.actions"
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = ReaseguradoresActions()
const { minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const reaseguradoresConfig = {
  entity: "reaseguradores",
  title: "Reaseguradores",
  searchPlaceholder: "",
  addButtonText: "Agregar reasegurador",
  modalTitle: "Agregar nuevo reasegurador",
  editModalTitle: "Editar reasegurador",
  tableTitle: "Lista de reaseguradores",

  headers: [
    { title: "REGISTRO CNSF", key: "registroCnsf", sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    /* { title: "CLAVE REASEGURADOR", key: "cveReasegurador", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    }, */
    { title: "REASEGURADORA", key: "nombreReasegurador", sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "ACTIVO", key: "esActivo", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    /* { title: "EXTRANJERO", key: "extranjero", sortable: true,
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
   /*  {
      name: "cveReasegurador",
      label: "Clave",
      type: "number",
      required: true,
      hidden: true,
      dataKey: "cveReasegurador",
      // TODO: indica obtener el ultimo + 1
      defaultValue: 0,
    }, */
    {
      name: "nombreReasegurador",
      label: "Nombre",
      type: "text",
      required: true,
      dataKey: "nombreReasegurador",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: "registroCnsf",
      label: "Registro CNSF",
      type: "text",
      required: true,
      dataKey: "registroCnsf",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    //TODO: si inicia con RGRE es extranjero
    /* {
      name: "extranjero",
      label: "Extranjero",
      type: "Checkbox",
      required: true,
      hidden: true,
      dataKey: "extranjero",
      defaultValue: true,
      transformFromAPI: (value: number) => (value === 1),
      transformToAPI: () => {
        const registroCNSF = "";
        return registroCNSF.trim().startsWith("RGRE") ? 1 : 0
      },
    }, */
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
    //cveReasegurador: (value: number) => !!value && value > 0 || "La clave es requerida y mayor a 0",
    nombreReasegurador: (value: string) => minMaxString(value, 1, 150) || "El nombre es requerido, máximo 150 caracteres",
    registroCnsf: (value: string) => minMaxString(value, 5, 19) || "El registro CNSF es requerido, mínimo 5 y máximo 19 caracteres",
    //extranjero: (value: string) => value !== undefined || "El campo extranjero es requerido",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchReaseguradores,
    create: actions.createReasegurador,
    update: actions.updateReasegurador,
    delete: actions.deleteReasegurador,
  },
}
