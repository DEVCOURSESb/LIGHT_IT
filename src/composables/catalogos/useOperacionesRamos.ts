import { ref } from 'vue'

export function useOperacionesRamos () {
  const search = ref('')

  const headers = [
    { title: 'Clave cobertura', key: 'cveCobertura', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Clave extra cobertura', key: 'cveExtCober', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Descripción', key: 'descOperacionRamos', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Activo', key: 'esActivo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Fecha de registro', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Operación', key: 'operacion', sortable: false,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Ramo', key: 'ramo', sortable: false,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Subramo', key: 'subramo', sortable: false,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Subsubramo', key: 'subsubramo', sortable: false,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Acciones', key: 'actions', sortable: false,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
  ]

  const OperacionesRamos = ref([
    {
      id: 1,
      cveCobertura: '1931',
      cveExtCober: '3',
      descOperacionRamos: 'POR OBRA',
      esActivo: 1,
      fechaRegistro: '2025-11-04 08:56:21.05',
      operacion: '4000',
      ramo: '190',
      subramo: '193',
      subsubramo: '1931',
    },
  ])

  return {
    search,
    headers,
    OperacionesRamos,
  }
}
