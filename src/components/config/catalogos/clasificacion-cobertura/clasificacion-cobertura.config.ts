import { ClasificacionCoberturaActions } from '@/API/catalogos/clasificacion/clasificacion-cobertura.actions'

const actions = ClasificacionCoberturaActions()

export const ClasificacionCoberturaConfig = {
  entity: 'clasificacion-cobertura',
  title: 'Clasificación cobertura',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nueva cobertura',
  tableTitle: 'Lista de Clasificación Coberturas',

  headers: [
    /* { title: 'CLAVE', key: 'cveClasifcober', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    }, */
    { title: 'CLASIFICACIÓN DE LA COBERTURA', key: 'descClasifcober', sortable: true,
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
      name: 'cveClasifcober',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveClasifcober',
      defaultValue: 0,
    },
    {
      name: 'descClasifcober',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descClasifcober',
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
    // eslint-disable-next-line @stylistic/no-mixed-operators
    cveClasifcober: (value: number) => !!value && value > 0 || 'La clave es requerida y mayor que 0',
    descClasifcober: (value: string) => value?.length > 0 || 'La descripción es requerida',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchClasificaciones,
    create: actions.createClasificacion,
    update: actions.updateClasificacion,
    delete: actions.deleteClasificacion,
  },
}
