import { EntidadFederativaActions } from "@/API/catalogos/entidad-federativa/entidad_federativa.actions";

const actions = EntidadFederativaActions();

export const EntidadFederativaConfig = {
  entity: 'EntidadFederativa',
  title: 'Entidad Federativa',
  searchPlaceholder: '',
  addButtonText: 'Registro individual',
  modalTitle: 'Agregar nuevo Entidad Federativa',
  tableTitle: 'Lista de Entidad Federativas',

  headers: [
   /*  { title: 'CLAVE', key: 'cveEntidad', sortable: true,
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
    { title: 'NOMBRE ENTIDAD FEDERATIVA', key: 'nombreEntidad', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    /**
    { title: 'LÍMITE INF.', key: 'limiteInfCp', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'LÍMITE SUP.', key: 'limiteSupCp', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
     */
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
      name: 'cveEntidad',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveEntidad',
      defaultValue: 0,
    },
    {
      name: 'nombreEntidad',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'nombreEntidad',
      transformToAPI: (value: string) => (value.toUpperCase()),
    },
    {
      name: 'limiteInfCp',
      label: 'Límite Inf.',
      type: 'number',
      required: true,
      dataKey: 'limiteInfCp',
      defaultValue: 0,
    },
    {
      name: 'limiteSupCp',
      label: 'Límite Sup.',
      type: 'number',
      required: true,
      dataKey: 'limiteSupCp',
      defaultValue: 0,
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
    cveEntidad: (value: number) => !!value && value <= 999 || 'La clave es requerida, mayor a 0 y máximo 3 dígitos.',
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
