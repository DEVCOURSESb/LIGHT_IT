import { TipoTarifaActions } from '@/API/catalogos/tipos-tarifa/tipos-tarifa.actions'

const actions = TipoTarifaActions()

export const tipoTarifaConfig = {
  entity: 'tipo-tarifa',
  title: 'Tipo tarifa',
  searchPlaceholder: 'tipo tarifa',
  addButtonText: 'Agregar tipo de tarifa',
  modalTitle: 'Tipo de tarifa',
  tableTitle: 'Lista de tipos de tarifas',

  headers: [
    { title: 'CLAVE', key: 'cveTarifa', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descTarifa', sortable: true,
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
      name: 'cveTarifa',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveTarifa',
      defaultValue: 0,
    },
    {
      name: 'descTarifa',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descTarifa',
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
      transformFromAPI: (value: boolean) => (value ? 'Sí' : 'No'),
      transformToAPI: (value: string) => (value === 'Sí'),
    },
  ],

  validationSchema: {
    cveTarifa: (value: number) => !!value && value > 0 || 'La clave es requerida y mayor que 0',
    descTarifa: (value: string) => value?.length > 0 || 'La descripción es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchTipoTarifa,
    create: actions.createTipoTarifa,
    update: actions.updateTipoTarifa,
    delete: actions.deleteTipoTarifa,
  },
}
