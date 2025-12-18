import { CriteriosAsignacionActions } from '@/API/catalogos/criterios_asignacion/criterios_asignacion.actions'

const actions = CriteriosAsignacionActions()

export const criteriosAsignacionConfig = {
  entity: 'criteriosAsignacion',
  title: 'Criterios de Asignación',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nuevo criterio asignacion',
  tableTitle: 'Lista de criterios de asignacion',

  headers: [
    /* { title: 'CLAVE CRITERIO ASIGNACION', key: 'cveCriterioAsig', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
    headerProps: {
      style: 'font-weight: bold',
    },
  },
  */
    { title: 'CRITERIOS DE ASIGNACIÓN', key: 'descCriterioAsig', sortable: true,
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
      name: 'cveCriterioAsig',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveCriterioAsig',
      defaultValue: 0,
    },
    {
      name: 'descCriterioAsig',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descCriterioAsig',
      transformToAPI: (value: string) => (value.toUpperCase()),
    },
    {
      name: 'esActivo',
      label: 'Activo',
      type: 'Checkbox',
      required: true,
      dataKey: 'esActivo',
      displayType: 'checkbox',
      defaultValue: true,
      transformFromAPI: (value: number) => (value === 1),
      transformToAPI: (value: boolean) => (value ? 1 : 2),
    },
  ],

  validationSchema: {
    // numerico, 3 digitos max,
    cveCriterioAsig: (value: number) => !!value && value <= 999 || 'La clave es requerida, mayor a 0 y máximo 3 dígitos.',
    // alfanumerico, max 100 chars.
    descCriterioAsig: (value: string) => value?.length > 0 && value?.length <= 100  || 'El nombre es requerido y mínimo de 100 caracteres.',
    esActivo: (value: boolean) => value !== undefined || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
