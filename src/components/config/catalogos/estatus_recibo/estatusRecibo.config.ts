import { CriteriosAsignacionActions } from '@/API/catalogos/criterios_asignacion/criterios_asignacion.actions'
import { EstatusReciboActions } from '@/API/catalogos/estatus_recibo/estatus_recibo.actions'

const actions = EstatusReciboActions()

export const estatusReciboConfig = {
  entity: 'estatusRecibo',
  title: 'Estatus Recibo',
  searchPlaceholder: '',
  addButtonText: 'Registro individual',
  modalTitle: 'Agregar nuevo estatus recibo',
  tableTitle: 'Lista de estatus recibo',
  headers: [
    { title: 'CLAVE', key: 'cveEstatusRec', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descEstatusRec', sortable: true,
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
      name: 'cveEstatusRec',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveEstatusRec',
      defaultValue: 0,
    },
    {
      name: 'descEstatusRec',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descEstatusRec',
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
    cveEstatusRec: (value: number) => !!value && value <= 999 || 'La clave es requerida, mayor a 0 y máximo 3 dígitos.',
    // alfanumerico, max 100 chars.
    descEstatusRec: (value: string) => value?.length > 0 && value?.length <= 100  || 'El nombre es requerido y mínimo de 100 caracteres.',
    esActivo: (value: boolean) => value !== undefined || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
