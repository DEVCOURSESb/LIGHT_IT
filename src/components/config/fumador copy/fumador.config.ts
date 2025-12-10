import { FumadorActions } from "@/API/catalogos/fumador/fumador.actions"


const actions = FumadorActions();

export const FumadorConfig = {
  entity: 'Fumador',
  title: 'Fumador',
  searchPlaceholder: 'Fumador',
  addButtonText: 'Registro individual',
  modalTitle: 'Agregar nuevo Fumador',
  tableTitle: 'Lista de Fumadores',

  headers: [
    { title: 'CLAVE', key: 'cveFumador', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descFumador', sortable: true,
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
      name: 'cveFumador',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveFumador',
      defaultValue: 0,
    },
    {
      name: 'descFumador',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descFumador',
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
    cveFumador: (value: number) => !!value && value <= 999 || 'La clave es requerida, mayor a 0 y máximo 3 dígitos.',
    // alfanumerico, max 100 chars.
    descFumador: (value: string) => value?.length > 0 && value?.length <= 100  || 'El nombre es requerido y mínimo de 100 caracteres.',
    esActivo: (value: boolean) => value !== undefined || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
