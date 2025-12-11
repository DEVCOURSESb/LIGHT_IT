import { IntermediariosActions } from '@/API/catalogos/intermediarios/intermediarios.actions'

const actions = IntermediariosActions()

export const intermediariosConfig = {
  entity: 'intermediarios',
  title: 'Intermediarios',
  searchPlaceholder: 'intermediarios',
  addButtonText: 'Agregar intermediario',
  modalTitle: 'Agregar nuevo intermediario',
  tableTitle: 'Lista de Intermediarios',

  headers: [
    { title: 'CLAVE INTERMEDIARIO', key: 'cveIntermediario', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'NOMBRE INTERMEDIARIO', key: 'nombreIntermediario', sortable: false,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACTIVO', key: 'esActivo', sortable: true,
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
      name: 'cveIntermediario',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveIntermediario',
      defaultValue: 0,
    },
    {
      name: 'nombreIntermediario',
      label: 'Nombre',
      type: 'text',
      required: true,
      dataKey: 'nombreIntermediario',
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
    // eslint-disable-next-line @stylistic/no-mixed-operators
    cveIntermediario: (value: number) => !!value && value > 0 || 'La clave es requerida y mayor a 0',
    nombreIntermediario: (value: string) => value?.length > 0 || 'El nombre es requerido',
    esActivo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchIntermediarios,
    create: actions.createIntermediario,
    update: actions.updateIntermediario,
    delete: actions.deleteIntermediario,
  },
}
