import { MonedaActions } from '@/API/catalogos/monedas/moneda.actions'

const actions = MonedaActions()

export const monedaConfig = {
  entity: 'moneda',
  title: 'Moneda',
  searchPlaceholder: '',
  addButtonText: 'Nueva moneda',
  modalTitle: 'Agregar moneda',
  editModalTitle: 'Editar moneda',
  tableTitle: 'Lista de Monedas',

  headers: [
    { title: 'CLAVE', key: 'cveMoneda', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descMoneda', sortable: true,
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
      name: 'cveMoneda',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveMoneda',
      defaultValue: 0,
    },
    {
      name: 'descMoneda',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descMoneda',
      defaultValue: '',
    },
    {
      name: 'esActivo',
      label: 'Activo',
      type: 'select',
      required: true,
      dataKey: 'esActivo',
      displayType: 'checkbox',
      defaultValue: true,
      transformFromAPI: (value: number) => (value === 1),
      transformToAPI: (value: boolean) => (value ? 1 : 2),
    },
  ],

  validationSchema: {
    cveMoneda: (value: number) => !!value && value > 0 || 'La clave es requerida y mayor que 0',
    descMoneda: (value: string) => value?.length > 0 || 'La descripción es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchMonedas,
    create: actions.createMoneda,
    update: actions.updateMoneda,
    delete: actions.deleteMoneda,
  },
}
