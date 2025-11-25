import { ref } from 'vue'

export function useReaseguradores () {
  const search = ref('')

  const headers = [
    { title: 'Clave', key: 'cveReasegurador', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Activo', key: 'esActivo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Extranjero', key: 'extranjero', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Fecha registro', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Nombre reasegurador', key: 'nombreReasegurador', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Registro CNSF', key: 'registroCnsf', sortable: true,
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

  const reaseguradores = ref([
    {
      id: 1,
      cveReasegurador: 1,
      esActivo: 1,
      extranjero: 0,
      fechaRegistro: '2002-12-01',
      nombreReasegurador: 'nombre de reasegurador',
      registroCnsf: 'IBJSODKC',
    },
  ])

  return {
    search,
    headers,
    reaseguradores,
  }
}
