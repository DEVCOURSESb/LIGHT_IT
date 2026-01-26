import { NombreArchivoTarifaActions } from "@/API/reaseguro/configuracionTarifas/nombre-archivo-tarifa/nombreArchivo.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = NombreArchivoTarifaActions()

const { minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const NombreArchivoConfig = {
  entity: "nombreArchivo",
  title: "Archivos de tarifas",
  searchPlaceholder: "",
  addButtonText: "",
  modalTitle: "Agregar nueva cobertura",
  editModalTitle: "Editar clasificación de cobertura",
  tableTitle: "Lista de clasificación coberturas",

  headers: [
    { title: "NOMBRE ARCHIVO", key: "nombreArchivo", sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "ARCHIVO", key: "base64Content", sortable: true,
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
    {
      title: "VISUALIZAR", key: "actions", sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    { title: "EDITAR", key: "actions", sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
  ],

  validationSchema: {
    //cveClasifcober: (value: number) => !!value && value > 0 || "La clave es requerida y mayor que 0",
    descClasifcober: (value: string) => minMaxString(value, 1, 10) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchNombreArchivo,
    create: actions.createNombreArchivo,
    update: actions.updateNombreArchivo,
    delete: actions.deleteNombreArchivo,
  },
}
