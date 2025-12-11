import { PerfilActions } from '@/API/catalogos/perfiles/perfiles.actions'

const actions = PerfilActions()

export const perfilConfig = {
  entity: 'perfil',
  title: 'Perfiles',
  searchPlaceholder: 'perfil',
  addButtonText: 'Agregar perfil',
  modalTitle: 'Agregar nuevo perfil',
  tableTitle: 'Lista de Perfiles',

  headers: [
    { title: 'NOMBRE PERFIL', key: 'nombrePerfil', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACCESOS', key: 'accesos', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA ALTA', key: 'fechaAlta', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'USUARIO ALTA', key: 'usuarioAlta', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA MODIFICADO', key: 'fechaModifica', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'USUARIO MODIFICADO', key: 'usuarioModifica', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACTIVO', key: 'activo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
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
      name: 'nombrePerfil',
      label: 'Nombre perfil',
      type: 'text',
      required: true,
      dataKey: 'nombrePerfil',
    },
    {
      name: 'activo',
      label: 'Activo',
      type: 'select',
      items: ['Sí', 'No'],
      required: true,
      dataKey: 'activo',
      transformFromAPI: (value: number) => (value === 1 ? 'Sí' : 'No'),
      transformToAPI: (value: string) => (value === 'Sí' ? 1 : 0),
    },
  ],

  validationSchema: {
    nombrePerfil: (value: string) => value?.length >= 2 || 'El nombre es requerido',
    activo: (value: string) => !!value || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetchPerfiles,
    create: actions.createPerfil,
    update: actions.updatePerfil,
    delete: actions.deletePerfil,
  },
}
