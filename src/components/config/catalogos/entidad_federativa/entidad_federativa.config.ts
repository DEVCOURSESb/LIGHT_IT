import { EntidadFederativaActions } from "@/API/catalogos/entidad-federativa/entidad_federativa.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = EntidadFederativaActions();
const { minMax, minMaxString, validateBoolean, fillString, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

export const EntidadFederativaConfig = {
  entity: 'EntidadFederativa',
  title: 'Entidad Federativa',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nuevo Entidad Federativa',
  editModalTitle: "Editar Entidad Federativa",
  tableTitle: 'Lista de entidades federativas',

  headers: [
   /*  { title: 'CLAVE', key: 'cveEntidad', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
    headerProps: {
      style: 'font-weight: bold',
    },
  },
  */
    { title: 'CLAVE', key: 'cveEntidad', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'NOMBRE ENTIDAD FEDERATIVA', key: 'nombreEntidad', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    /**
    { title: 'LÍMITE INF.', key: 'limiteInfCp', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'LÍMITE SUP.', key: 'limiteSupCp', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
     */
    { title: 'ACTIVO', key: 'esActivo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: "ACCIONES", key: "actions", sortable: false,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
  ],

  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'text',
      hidden: true,
    },
    {
      name: 'cveEntidad',
      label: 'Clave',
      type: 'text',
      required: true,
      dataKey: 'cveEntidad',
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(fillString(value, 2, '0')),
    },
    {
      name: 'nombreEntidad',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'nombreEntidad',
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: 'limiteInfCp',
      label: 'Límite Inf.',
      type: 'number',
      required: true,
      dataKey: 'limiteInfCp',
      defaultValue: 0,
    },
    {
      name: 'limiteSupCp',
      label: 'Límite Sup.',
      type: 'number',
      required: true,
      dataKey: 'limiteSupCp',
      defaultValue: 0,
    },
    {
      name: 'esActivo',
      label: 'Activo',
      type: 'Checkbox',
      required: true,
      dataKey: 'esActivo',
      displayType: 'checkbox',
      defaultValue: true,
      transformFromAPI: (value: number) => transformNumberToBoolean(value),
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    // numerico, 3 digitos max,
    cveEntidad: (value: string) => minMaxString(value, 1, 2) || 'La clave es requerida, mayor a 0 y máximo 2 dígitos.',
    // alfanumerico, max 100 chars.
    nombreEntidad: (value: string) => minMaxString(value, 1, 100) || 'El nombre es requerido, mayor a 0 y máximo de 100 caracteres.',
    // numerico, mayor a 0 y maximo 5 digitos.
    limiteInfCp: (value: number) => minMax(value, 1, 99999) || 'El límite inferior es requerido y mayor a 0 y máximo 5 dígitos.',
    limiteSupCp: (value: number) => minMax(value, 1, 99999) || 'El límite superior es requerido y mayor a 0 y máximo 5 dígitos.',
    esActivo: (value: boolean) => validateBoolean(value) || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
