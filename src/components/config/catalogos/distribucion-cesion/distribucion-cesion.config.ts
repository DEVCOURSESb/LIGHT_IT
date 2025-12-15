import { DistribucionCesionActions } from '@/API/catalogos/distribucion-cesion/distribucion-cesion.actions'

const actions = DistribucionCesionActions()

export const DistribucionCesionConfig = {
  entity: 'distribucion-cesion',
  title: 'Distribución de Cesión',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nueva distribución',
  tableTitle: 'Lista de Distribuciones de Cesión',

  headers: [
    /* { title: 'CLAVE', key: 'cveDistrcesion', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    }, */
    { title: 'DISTRIBUCIÓN DE LA CESIÓN', key: 'descDistrcesion', sortable: true,
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
      name: 'cveDistrcesion',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveDistrcesion',
      defaultValue: 0,
    },
    {
      name: 'descDistrcesion',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descDistrcesion',
      defaultValue: '',
    },
    {
      name: 'esActivo',
      label: 'Activo',
      type: 'Checkbox',
      required: true,
      dataKey: 'esActivo',
      displayType: 'checkbox',
      defaultValue: true,
      transformFromAPI: (value: number) => !!value,
      transformToAPI: (value: boolean) => value ? 1 : 0,
    },
  ],

  validationSchema: {
    cveDistrcesion: (value: number) => value && value > 0 || 'La clave es requerida y mayor que 0',
    descDistrcesion: (value: string) => value?.length > 0 || 'La descripción es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchDistribucionesCesion,
    create: actions.createDistribucionCesion,
    update: actions.updateDistribucionCesion,
    delete: actions.deleteDistribucionCesion,
  },
}
