import { TipoEndosoActions } from '@/API/catalogos/tipo_endoso/tipo_endoso.actions'

const actions = TipoEndosoActions()

export const TipoEndosoConfig = {
  entity: 'tipoEndoso',
  title: 'Tipo endoso',
  searchPlaceholder: 'Tipo Endoso',
  addButtonText: 'Registro individual',
  modalTitle: 'Agregar nuevo tipo endoso',
  tableTitle: 'Lista de tipos de endoso',

  headers: [
    { title: 'CLAVE', key: 'cveTipoEndoso', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descTipoEndoso', sortable: true,
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
      name: 'cveTipoEndoso',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveTipoEndoso',
      defaultValue: 0,
    },
    {
      name: 'descTipoEndoso',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descTipoEndoso',
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
    cveTipoEndoso: (value: number) => !!value && value <= 999 || 'La clave es requerida, mayor a 0 y máximo 3 dígitos.',
    // alfanumerico, max 100 chars.
    descTipoEndoso: (value: string) => value?.length > 0 && value?.length <= 100  || 'El nombre es requerido y mínimo de 100 caracteres.',
    esActivo: (value: boolean) => value !== undefined || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
