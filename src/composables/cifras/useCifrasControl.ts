// composables/cifras/useCifrasControl.ts
import { ref } from "vue";
import type {
  CifrasControlEmisionDTO,
  CifrasControlSiniestroDTO,
} from "@/API/generic/cifras-control";
import { CifrasControlActions } from "@/API/cifras-control/cifras-control.actions";
import { useSnackbar } from "@/stores/useSnackbar";

export const useCifrasControl = () => {
  const cifrasControlAPI = CifrasControlActions();
  const { snackbar.mostrarMensajeSnackbar } = useSnackbar();

  // Estados
  const cifrasEmision = ref<CifrasControlEmisionDTO[]>([]);
  const cifrasSiniestros = ref<CifrasControlSiniestroDTO[]>([]);
  const loadingEmision = ref(false);
  const loadingSiniestros = ref(false);

  
  // Función para cargar cifras de emisión
  const cargarCifrasEmision = async () => {
    loadingEmision.value = true;
    try {
      const response = await cifrasControlAPI.fetchCifrasEmision();
      
      cifrasEmision.value = response.dataExtra || [];      
    } catch (error) {
        snackbar.mostrarMensajeSnackbar("Error al cargar cifras de emisión", "error");
    } finally {
      loadingEmision.value = false;
    }
  };

  // Función para cargar cifras de siniestros
  const cargarCifrasSiniestros = async () => {
    loadingSiniestros.value = true;
    try {
      const response = await cifrasControlAPI.fetchCifrasSiniestros();
      
      cifrasSiniestros.value = response.dataExtra || [];
      
    } catch (error) {
      snackbar.mostrarMensajeSnackbar("Error al cargar cifras de siniestros", "error");
    } finally {
      loadingSiniestros.value = false;
    }
  };

  // Función para cargar todas las cifras
  const cargarTodasLasCifras = async () => {
    await Promise.all([cargarCifrasEmision(), cargarCifrasSiniestros()]);
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