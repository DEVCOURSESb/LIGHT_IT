import { FormaPagoActions } from '@/API/catalogos/forma_pago/forma_pago.actions'

const actions = FormaPagoActions()

export const FormaPagoConfig = {
  entity: 'formaPago',
  title: 'Forma pago',
  searchPlaceholder: 'Forma pago',
  addButtonText: 'Registro individual',
  modalTitle: 'Agregar nueva Forma pago',
  tableTitle: 'Lista de formas de pago',

  headers: [
    { title: 'CLAVE', key: 'cveFormaPago', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descFormaPago', sortable: true,
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
      name: 'cveFormaPago',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveFormaPago',
      defaultValue: 0,
    },
    {
      name: 'descFormaPago',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descFormaPago',
      transformToAPI: (value: string) => (value.toUpperCase()),
    },
    {
      name: 'esActivo',
      label: 'Activo',
      type: 'Checkbox',
      required: true,
      dataKey: 'esActivo',
      defaultValue: true,
      transformFromAPI: (value: number) => (value === 1),
      transformToAPI: (value: boolean) => (value ? 1 : 2),
    },
  ],

  validationSchema: {
    // numerico, 3 digitos max,
    cveFormaPago: (value: number) => !!value && value <= 999 || 'La clave es requerida, mayor a 0 y máximo 3 dígitos.',
    // alfanumerico, max 100 chars.
    descFormaPago: (value: string) => value?.length > 0 && value?.length <= 100  || 'El nombre es requerido y mínimo de 100 caracteres.',
    esActivo: (value: boolean) => value !== undefined || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
