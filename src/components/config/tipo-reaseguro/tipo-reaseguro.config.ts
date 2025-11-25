import { TipoReaseguroActions } from '@/API/catalogos/tipo-reaseguro/tipo-reaseguro.actions'

const actions = TipoReaseguroActions()

export const tipoReaseguroConfig = {
  entity: 'tipo-reaseguro',
  title: 'Tipo reaseguro',
  searchPlaceholder: 'tipo reaseguro',
  addButtonText: 'Agregar tipo de reaseguro',
  modalTitle: 'Tipo de reaseguro',
  tableTitle: 'Lista de tipos de Reaseguro',

  headers: [
    { title: 'CLAVE', key: 'cveTreaseg', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descTreaseg', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACTIVO', key: 'esActivo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
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
      name: 'cveTreaseg',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveTreaseg',
      defaultValue: 0,
    },
    {
      name: 'descTreaseg',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descTreaseg',
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
  ],

  validationSchema: {
    cveTreaseg: (value: number) => !!value && value > 0 || 'La clave es requerida y mayor a 0',
    descTreaseg: (value: string) => value?.length > 0 || 'La fórmula es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchTipoReaseguro,
    create: actions.createTipoReaseguro,
    update: actions.updateTipoReaseguro,
    delete: actions.deleteTipoReaseguro,
  },
}
