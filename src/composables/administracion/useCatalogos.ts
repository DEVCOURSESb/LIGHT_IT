import { ref } from 'vue'

export function useCatalogos () {
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
    { title: 'Catálogo', key: 'catalogo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Acción', key: 'accion', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Dato capturado', key: 'datoCapt', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Dato original', key: 'datoOrig', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Dato actualizado', key: 'datoAct', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Dato activo / inactivo', key: 'esActivoInac', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
  ]

  const catalogos = ref([
    {
      id: 1,
      idUsuario: 5,
      fechaH: '2024-01-01 12:00:00',
      catalogo: 'Moneda',
      accion: 'Agregar',
      datoCapt: 'Dato capturado 1',
      datoOrig: 'S/D',
      datoAct: 'S/D',
      esActivoInac: 'S/D',
    },
    {
      id: 2,
      idUsuario: 2,
      fechaH: '2024-01-02 13:30:00',
      catalogo: 'Tipo de reaseguro',
      accion: 'Activar',
      datoCapt: 'S/D',
      datoOrig: 'S/D',
      datoAct: 'S/D',
      esActivoInac: 'Automatico',
    },
    {
      id: 3,
      idUsuario: 1,
      fechaH: '2024-01-03 15:45:00',
      catalogo: 'Tipo de contrato',
      accion: 'Modificar',
      datoCapt: 'S/D',
      datoOrig: 'Dato original 3',
      datoAct: 'Dato actualizado 3',
      esActivoInac: 'S/D',
    },
  ])

  return {
    search,
    headers,
    catalogos,
  }
}
