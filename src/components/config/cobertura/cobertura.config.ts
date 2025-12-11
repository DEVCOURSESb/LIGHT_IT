import { CoberturasActions } from '@/API/catalogos/coberturas/coberturas.actions'

const actions = CoberturasActions()

export const coberturaConfig = {
  entity: 'cobertura',
  title: 'Coberturas',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar cobertura',
  tableTitle: 'Lista de Coberturas',

  headers: [
    /* { title: 'ID COBERTURA', key: 'idCob', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'CLAVE', key: 'cveCob', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    }, */
    { title: 'DESCRIPCIÓN', key: 'descCob', sortable: true,
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
    }, */
    { title: 'EDITAR', key: 'actions', sortable: false,
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
      name: 'cveCob',
      label: 'Clave',
      type: 'text',
      required: true,
      dataKey: 'cveCob',
    },
    {
      name: 'descCob',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descCob',
    },
    {
      name: 'activo',
      label: 'Activo',
      type: 'select',
      items: ['Sí', 'No'],
      required: true,
      dataKey: 'esActivo',
      transformFromAPI: (value: number) => (value === 1 ? 'Sí' : 'No'),
      transformToAPI: (value: string) => (value === 'Sí' ? 1 : 0),
    },
  ],

  validationSchema: {
    cveCob: (value: string) => value?.length >= 2 || 'La clave es requerida',
    descCob: (value: string) => value?.length > 0 || 'La descripción es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchCoberturas,
    create: actions.createCobertura,
    update: actions.updateCobertura,
    delete: actions.deleteCobertura,
  },
}
