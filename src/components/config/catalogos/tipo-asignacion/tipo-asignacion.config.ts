import { TipoAsignacionActions } from '@/API/catalogos/tipo-asignacion/tipo-asignacion.actions'

const actions = TipoAsignacionActions()

export const tipoAsignacionConfig = {
  entity: 'tipo-asignacion',
  title: 'Asignación',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nuevo tipo asignación',
  tableTitle: 'Lista de Tipo Asignación',

  headers: [
    /* { title: 'CLAVE', key: 'cveAsignacion', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    }, */
    { title: 'ASIGNACIÓN', key: 'descAsignacion', sortable: true,
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
      name: 'cveAsignacion',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveAsignacion',
      defaultValue: 0,
    },
    {
      name: 'descAsignacion',
      label: 'Fórmula PTU',
      type: 'text',
      required: true,
      dataKey: 'descAsignacion',
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
    cveAsignacion: (value: number) => !!value && value > 0 || 'La clave es requerida y mayor que 0',
    descAsignacion: (value: string) => value?.length > 0 || 'La fórmula es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchTipoAsignacion,
    create: actions.createTipoAsignacion,
    update: actions.updateTipoAsignacion,
    delete: actions.deleteTipoAsignacion,
  },
}
