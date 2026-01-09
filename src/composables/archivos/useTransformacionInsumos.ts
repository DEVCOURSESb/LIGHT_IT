// composables/archivos/useTransformacionInsumos.ts
import { mesesAnio } from "@/utils/catalogos/mesesAnio";
import { ref, computed } from "vue";

interface TransformacionResponse {
  mensaje: string;
  detalleMensaje: string;
  dataExtra?: any;
}

interface UseTransformacionOptions {
  transformAction: (anio: number, mes: number) => Promise<TransformacionResponse>;
  nombreInsumo: string; // "emisión" o "siniestro"
}

export const useTransformacionInsumos = ({
  transformAction,
  nombreInsumo,
}: UseTransformacionOptions) => {
  // Form reference
  const formTransformacion = ref<any>(null);
  const validTransformacion = ref(false);

  // Selectores
  const anioTransformacion = ref<number | null>(null);
  const mesTransformacion = ref<number | null>(null);

  // Estados
  const loadingTransformacion = ref(false);

  // Snackbar
  const snackbarTransformacion = ref(false);
  const snackbarTextTransformacion = ref("");
  const snackbarColorTransformacion = ref<"success" | "error" | "info">("success");

  // Opciones de año y mes
  const anioActual = new Date().getFullYear();
  const aniosTransformacion = ref<number[]>(
    Array.from({ length: 10 }, (_, i) => anioActual - i)
  );

  const { mesesWithValue: mesess } = mesesAnio();
  const mesesTransformacion = ref(mesess);

  // Reglas de validación
  const anioTransformacionRules = [
    (value: number | null) => {
      if (!value) return "Debe seleccionar un año";
      return true;
    },
  ];

  const mesTransformacionRules = [
    (value: number | null) => {
      if (!value) return "Debe seleccionar un mes";
      return true;
    },
  ];

  // Computed para habilitar/deshabilitar el botón
  const puedeTransformar = computed(() => {
    return (
      anioTransformacion.value !== null &&
      mesTransformacion.value !== null &&
      !loadingTransformacion.value
    );
  });

  // Función para transformar
  const transformarInsumo = async () => {
    console.log("=== Iniciando transformación de insumo ===");
    console.log("Estado actual:", {
      anio: anioTransformacion.value,
      mes: mesTransformacion.value,
      nombreInsumo,
    });

    // Validar formulario
    if (formTransformacion.value) {
      const { valid: formValid } = await formTransformacion.value.validate();
      console.log("Validación del formulario:", formValid);

      if (!formValid) {
        console.error("Formulario no válido");
        mostrarMensajeTransformacion(
          "Por favor seleccione año y mes",
          "error"
        );
        return;
      }
    }

    // Verificar que todo esté listo
    if (!anioTransformacion.value || !mesTransformacion.value) {
      console.error("Faltan datos:", {
        anio: anioTransformacion.value,
        mes: mesTransformacion.value,
      });
      mostrarMensajeTransformacion("Debe seleccionar año y mes", "error");
      return;
    }

    loadingTransformacion.value = true;
    mostrarMensajeTransformacion(
      `Transformando insumo de ${nombreInsumo}, por favor espere...`,
      "info"
    );

    try {
      console.log("Enviando solicitud de transformación:", {
        anio: anioTransformacion.value,
        mes: mesTransformacion.value,
      });

      const response = await transformAction(
        anioTransformacion.value,
        mesTransformacion.value
      );

      console.log("Respuesta del servidor:", response);

      // Limpiar formulario si fue exitoso
      limpiarFormularioTransformacion();

      mostrarMensajeTransformacion(
        response.mensaje || `Insumo de ${nombreInsumo} transformado exitosamente`,
        "success"
      );
    } catch (error: any) {
      console.error("Error al transformar insumo:", error);

      let mensajeError = `Error al transformar insumo de ${nombreInsumo}`;
      if (error.response?.data?.detalleMensaje) {
        mensajeError = error.response.data.detalleMensaje;
      } else if (error.response?.data?.mensaje) {
        mensajeError = error.response.data.mensaje;
      } else if (error.message) {
        mensajeError = error.message;
      }

      mostrarMensajeTransformacion(mensajeError, "error");
    } finally {
      loadingTransformacion.value = false;
    }
  };

  // Función auxiliar para mostrar mensajes
  const mostrarMensajeTransformacion = (
    texto: string,
    color: "success" | "error" | "info"
  ) => {
    snackbarTextTransformacion.value = texto;
    snackbarColorTransformacion.value = color;
    snackbarTransformacion.value = true;
  };

  // Función para limpiar el formulario
  const limpiarFormularioTransformacion = () => {
    anioTransformacion.value = null;
    mesTransformacion.value = null;

    if (formTransformacion.value) {
      formTransformacion.value.reset();
      formTransformacion.value.resetValidation();
    }
  };

  return {
    // Form
    formTransformacion,
    validTransformacion,

    // Estados
    anioTransformacion,
    mesTransformacion,
    loadingTransformacion,

    // Snackbar
    snackbarTransformacion,
    snackbarTextTransformacion,
    snackbarColorTransformacion,

    // Validaciones
    anioTransformacionRules,
    mesTransformacionRules,

    // Opciones
    aniosTransformacion,
    mesesTransformacion,

    // Métodos
    transformarInsumo,
    puedeTransformar,
    limpiarFormularioTransformacion,
    mostrarMensajeTransformacion,
  };
};
