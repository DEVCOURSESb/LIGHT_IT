import { CriterioCoberturaActions } from "@/API/catalogos/criterio_cobertura/criterio_cobertura.actions";

const actions = CriterioCoberturaActions();

export const CriterioCoberturaConfig = {
  entity: 'CriterioCobertura',
  title: 'Criterio de Cobertura',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nuevo CriterioCobertura',
  tableTitle: 'Lista de CriterioCoberturaes',

  headers: [
    /* { title: 'CLAVE', key: 'cveCriterioCob', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    }, */
    { title: 'CRITERIO DE COBERTURA', key: 'descCriterioCob', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACTIVO', key: 'esActivo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
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
      name: 'cveCriterioCob',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveCriterioCob',
      defaultValue: 0,
    },
    {
      name: 'descCriterioCob',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descCriterioCob',
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
    cveCriterioCob: (value: number) => !!value && value <= 999 || 'La clave es requerida, mayor a 0 y máximo 3 dígitos.',
    // alfanumerico, max 100 chars.
    nombreEntidad: (value: string) => value?.length > 0 && value?.length <= 100  || 'El nombre es requerido y mínimo de 100 caracteres.',
    esActivo: (value: boolean) => value !== undefined || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
