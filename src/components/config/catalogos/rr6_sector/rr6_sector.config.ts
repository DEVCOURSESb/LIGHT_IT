import { Rr6SectorActions } from "@/API/catalogos/rr6_sector/rr6_sector.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = Rr6SectorActions();

const { minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const rr6SectorConfig = {
  entity: "rr6_sector",
  title: "Tipo de sector Sector",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nuevo RR6 Sector",
  editModalTitle: "Editar RR6 Sector",
  tableTitle: "Lista de RR6 Sector",

  headers: [
    { title: "CLAVE", key: "cveSector", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "DESCRIPCIÓN SECTOR", key: "descSector", sortable: true,
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
      name: "cveSector",
      label: "Clave",
      type: "text",
      required: true,
      dataKey: "cveSector",
      defaultValue: "",
    },
    {
      name: "descSector",
      label: "Descripción Sector",
      type: "text",
      required: true,
      dataKey: "descSector",
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
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    cveSector: (value: string) => minMaxString(value, 1, 2) || "La clave es requerida",
    descSector: (value: string) => minMaxString(value, 1, 100) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deleteF,
  },
};
