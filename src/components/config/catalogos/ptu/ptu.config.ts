import { PtuActions } from "@/API/catalogos/ptu/ptu.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = PtuActions();

const { minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const ptuConfig = {
  entity: "ptu",
  title: "Método cálculo PTU",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nuevo PTU",
  editModalTitle: "Editar PTU",
  tableTitle: "Lista de métodos cálculo PTU",

  headers: [
    { title: "CLAVE", key: "cvePtu", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "FÓRMULA PTU", key: "formulaPtu", sortable: true,
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
   /*  {
      name: "cvePtu",
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cvePtu",
      defaultValue: 0,
    }, */
    {
      name: "formulaPtu",
      label: "Formula PTU",
      type: "text",
      required: true,
      dataKey: "formulaPtu",
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
    //cvePtu: (value: number) => !!value && value > 0 || "La clave es requerida y mayor que 0",
    formulaPtu: (value: string) => minMaxString(value, 1, 1000) || "La fórmula es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchPtus,
    create: actions.createPtu,
    update: actions.updatePtu,
    delete: actions.deletePtu,
  },
};
