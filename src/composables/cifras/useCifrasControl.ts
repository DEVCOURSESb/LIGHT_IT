import { useQuery } from '@tanstack/vue-query';
import type {
  CifrasControlEmisionDTO,
  CifrasControlSiniestroDTO,
} from "@/API/generic/cifras-control";
import { CifrasControlActions } from "@/API/cifras-control/cifras-control.actions";
import { useSnackbar } from "@/stores/useSnackbar";
import { computed, watch } from 'vue';

export const useCifrasControl = () => {
  const cifrasControlAPI = CifrasControlActions();
  const snackbar = useSnackbar();

  // cifras de emisión
  const {
    data: cifrasEmisionData,
    isLoading: loadingEmision,
    refetch: cargarCifrasEmision,
    error: errorEmision,
  } = useQuery({
    queryKey: ['cifras-control-emision'],
    queryFn: async () => {
      const response = await cifrasControlAPI.fetchCifrasEmision();
      return response.dataExtra || [];
    },
  });

  // cifras de siniestros
  const {
    data: cifrasSiniestrosData,
    isLoading: loadingSiniestros,
    refetch: cargarCifrasSiniestros,
    error: errorSiniestros,
  } = useQuery({
    queryKey: ['cifras-control-siniestros'],
    queryFn: async () => {
      const response = await cifrasControlAPI.fetchCifrasSiniestros();
      return response.dataExtra || [];
    },
  });

  // Computed para valores por defecto
  const cifrasEmision = computed<CifrasControlEmisionDTO[]>(
    () => cifrasEmisionData.value || []
  );

  const cifrasSiniestros = computed<CifrasControlSiniestroDTO[]>(
    () => cifrasSiniestrosData.value || []
  );

  // Manejar errores con watch en lugar de if directo
  watch(errorEmision, (error) => {
    if (error) {
      snackbar.mostrarMensajeSnackbar("Error al cargar cifras de emisión", "error");
    }
  });

  watch(errorSiniestros, (error) => {
    if (error) {
      snackbar.mostrarMensajeSnackbar("Error al cargar cifras de siniestros", "error");
    }
  });

  // Función para cargar todas las cifras
  const cargarTodasLasCifras = async () => {
    await Promise.all([
      cargarCifrasEmision(),
      cargarCifrasSiniestros(),
    ]);
  };

  return {
    // Estados
    cifrasEmision,
    cifrasSiniestros,
    loadingEmision,
    loadingSiniestros,

    // Métodos
    cargarCifrasEmision,
    cargarCifrasSiniestros,
    cargarTodasLasCifras,
  };
};