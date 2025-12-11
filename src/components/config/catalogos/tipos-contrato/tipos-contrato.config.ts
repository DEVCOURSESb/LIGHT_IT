import { TiposContratoActions } from '@/API/catalogos/tipos-contrato/tipos-contrato.actions';

const actions = TiposContratoActions();

export const tiposContratoConfig = {
  entity: 'tipos-contrato',
  title: 'Tipos de Contrato',
  searchPlaceholder: '',
  addButtonText: 'Agregar tipo de contrato',
  modalTitle: 'Agregar nuevo tipo de contrato',
  tableTitle: 'Lista de Tipos de Contrato',

  headers: [
    { title: 'CLAVE', key: 'cveTcontrato', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN TIPO DE CONTRATO', key: 'descTcontrato', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'CLAVE TIPO REASEGURO', key: 'cveTreaseg', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACTIVO', key: 'esActivo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    /* { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'TIPO DE CONTRATO', key: 'idTcontrato', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    }, */
    { title: 'ACCIONES', key: 'actions', sortable: false,
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
      name: 'cveTcontrato',
      label: 'Clave',
      type: 'text',
      required: true,
      dataKey: 'cveTcontrato',
      defaultValue: '',
    },
    {
      name: 'cveTreaseg',
      label: 'Clave tipo reaseguro',
      type: 'number',
      required: true,
      dataKey: 'cveTreaseg',
      defaultValue: 0,
    },
    {
      name: 'descTcontrato',
      label: 'Descripción tipo contrato',
      type: 'text',
      required: true,
      dataKey: 'descTcontrato',
      defaultValue: '',
    },
    {
      name: 'esActivo',
      label: 'Activo',
      type: 'select',
      items: ['Sí', 'No'],
      required: true,
      dataKey: 'esActivo',
      defaultValue: 'Sí',
      transformFromAPI: (value: number) => (value === 1 ? 'Sí' : 'No'),
      transformToAPI: (value: string) => (value === 'Sí' ? 1 : 0),
    },
    {
      name: 'idTcontrato',
      label: 'ID tipo contrato',
      type: 'number',
      required: true,
      dataKey: 'idTcontrato',
      defaultValue: 0,
    },
  ],

  validationSchema: {
    cveTcontrato: (value: string) => value?.length > 0 || 'La clave es requerida',
    cveTreaseg: (value: number) => value >= 0 || 'La clave tipo reaseguro es requerida y mayor que 0',
    descTcontrato: (value: string) => value?.length > 0 || 'La descripción es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
    idTcontrato: (value: number) => !!value && value > 0 || 'El ID tipo contrato es requerido y mayor que 0',
  },

  apiActions: {
    fetch: actions.fetchTipoContratos,
    create: actions.createTipoContrato,
    update: actions.updateTipoContrato,
    delete: actions.deleteTipoContrato,
  },
};
