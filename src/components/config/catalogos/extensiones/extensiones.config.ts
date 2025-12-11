import { ExtensionesActions } from '@/API/catalogos/extensiones/extensiones.actions'

const actions = ExtensionesActions()

export const ExtensionesConfig = {
  entity: 'extensiones',
  title: 'Extensiones',
  searchPlaceholder: 'extensión...',
  addButtonText: 'Agregar extensión',
  modalTitle: 'Agregar nueva extensión',
  tableTitle: 'Lista de Extensiones',

  headers: [
    { title: 'CLAVE', key: 'cveExtCober', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descExtCober', sortable: true,
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
      name: 'cveExtCober',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveExtCober',
      defaultValue: 0,
    },
    {
      name: 'descExtCober',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descExtCober',
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
    cveExtCober: (value: number) => !!value && value > 0 || 'La clave es requerida y mayor que 0',
    descExtCober: (value: string) => value?.length > 0 || 'La descripción es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchExtensiones,
    create: actions.createExtension,
    update: actions.updateExtension,
    delete: actions.deleteExtension,
  },
}
