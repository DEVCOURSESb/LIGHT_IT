import { ref } from 'vue'

export function useContratosReaseguro () {
  const search = ref('')

  const headers = [
    { title: 'Usuario', key: 'idUsuario', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Fecha y hora', key: 'fechaH', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Tipo de acción', key: 'tipoAccion', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Contrato', key: 'contrato', sortable: true,
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

  const contrato = ref([
    {
      id: 1,
      idUsuario: 5,
      fechaH: '2024-01-01 12:00:00',
      tipoAccion: 'Agregar',
      contrato: 'CPDIV04052023',
    },
    {
      id: 2,
      idUsuario: 3,
      fechaH: '2024-02-15 09:30:00',
      tipoAccion: 'Agregar',
      contrato: 'CPIO0405B2023',
    },
    {
      id: 3,
      idUsuario: 7,
      fechaH: '2024-03-10 14:45:00',
      tipoAccion: 'Agregar',
      contrato: 'CPRC0405B2023',
    },
  ])

  return {
    search,
    headers,
    contrato,
  }
}
