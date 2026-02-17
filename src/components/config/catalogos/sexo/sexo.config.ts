
import { SexoActions } from "@/API/catalogos/sexo/sexo.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";

const actions = SexoActions();
const { minMaxString, validateBoolean, transformToUpperCase, transformBooleanToNumber, transformNumberToBoolean } = validationsHandler();

export const SexoConfig = {
  entity: 'Sexo',
  title: 'Sexo',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nuevo sexo',
  editModalTitle: "Editar sexo",
  tableTitle: 'Lista de sexos',

  headers: [
    { title: 'CLAVE', key: 'cveSexo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },/*
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    }, */
    /* { title: 'CLAVE', key: 'cveSexo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    }, */
    { title: 'DESCRIPCIÓN DE SEXO', key: 'descSexo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
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
      name: 'cveSexo',
      label: 'Clave',
      type: 'text',
      required: true,
      dataKey: 'cveSexo',
      defaultValue: 0,
    },
    {
      name: 'descSexo',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descSexo',
      transformToAPI: (value: string) => transformToUpperCase(value),
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
    cveSexo: (value: string) => minMaxString(value, 1, 1) || 'La clave es requerida, mayor a 0 y máximo 1 dígitos.',
    // alfanumerico, max 100 chars.
    descSexo: (value: string) => minMaxString(value, 1, 1000) || 'El nombre es requerido y mínimo de 1 y máximo de 1000 caracteres.',
    esActivo: (value: boolean) => validateBoolean(value) || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
