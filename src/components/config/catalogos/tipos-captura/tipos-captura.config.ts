import { TipoCapturaActions } from '@/API/catalogos/tipos-captura/tipo-captura.actions'

const actions = TipoCapturaActions()

export const TiposCapturaConfig = {
  entity: 'tipos-captura',
  title: 'Tipos captura',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nuevo tipo captura',
  tableTitle: 'Lista de tipos captura',

  headers: [
    { title: 'CLAVE', key: 'cveTcaptura', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descTcaptura', sortable: true,
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
      name: 'cveTcaptura',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveTcaptura',
      defaultValue: 0,
    },
    {
      name: 'descTcaptura',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descTcaptura',
    },
    {
      name: 'esActivo',
      label: 'Activo',
      type: 'Checkbox',
      required: true,
      dataKey: 'esActivo',
      defaultValue: true,
      displayType: 'checkbox',
      transformFromAPI: (value: boolean) => !!value,
      transformToAPI: (value: boolean) => value,
    },
  ],

  validationSchema: {
    cveTcaptura: (value: number) => !!value && value > 0 || 'La clave es requerida y mayor que 0',
    descTcaptura: (value: string) => value?.length > 0 || 'La descripción es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchTipoCapturas,
    create: actions.createTipoCaptura,
    update: actions.updateTipoCaptura,
    delete: actions.deleteTipoCaptura,
  },
}
