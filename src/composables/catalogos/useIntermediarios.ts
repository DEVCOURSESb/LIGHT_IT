import { ref } from 'vue'
import { IntermediariosActions } from '@/API/catalogos/intermediarios/intermediariosActions'

export function useIntermediarios () {
  const search = ref('')
  const { fetchIntermediarios } = IntermediariosActions()

  const getIntermediarios = async () => fetchIntermediarios()

  const headers = [
    { title: 'ID', key: 'id', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'Clave intermediario', key: 'cveIntermediario', sortable: true,
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
    { title: 'Nombre intermediario', key: 'nombreIntermediario', sortable: false,
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

  const intermediarios = ref([
    {
      id: 1,
      cveIntermediario: 'cve-1',
      esActivo: 1,
      fechaRegistro: '2025-11-04',
      nombreIntermediario: 'nombre kmk',
    },
    {
      id: 2,
      cveIntermediario: 'cvea-2',
      esActivo: 1,
      fechaRegistro: '2025-11-04',
      nombreIntermediario: 'nombre kmk',
    },
    {
      id: 3,
      cveIntermediario: 'cvez-3',
      esActivo: 1,
      fechaRegistro: '2025-11-04',
      nombreIntermediario: 'nombre kmk',
    },
  ])

  return {
    search,
    getIntermediarios,
    headers,
    intermediarios,
  }
}
