// composables/archivos/useCargaArchivos.ts
import { ref, computed } from "vue";
import type {
  CargaArchivoResponse,
  RegistroTabla,
  ValidacionCSV,
} from "@/API/generic/carga-archivos";
import { validarCSV } from "@/utils/validateCSV";
import { mesesAnio } from "@/utils/catalogos/mesesAnio";


interface UseCargaArchivosOptions<T> {
  fetchAction: () => Promise<T>;
  uploadAction: (formData: FormData) => Promise<CargaArchivoResponse>;
  columnasEsperadas?: string[];
  transformarDatos: (data: T) => RegistroTabla[];
}

export const useCargaArchivos = <T>({
  fetchAction,
  uploadAction,
  columnasEsperadas,
  transformarDatos,
}: UseCargaArchivosOptions<T>) => {
  // Referencias del formulario
  const form = ref<any>(null);
  const valid = ref(false);

  // Estado del archivo
  const archivo = ref<File | File[] | null>(null);
  const archivoSeleccionado = ref<File | null>(null);
  const validacionArchivo = ref<ValidacionCSV | null>(null);
  const validacionEnProgreso = ref(false);

  // Selectores
  const anioSeleccionado = ref<number | null>(null);
  const mesSeleccionado = ref<number | null>(null);

  // Estados
  const loading = ref(false);
  const registros = ref<RegistroTabla[]>([]);

  // Snackbar
  const snackbar = ref(false);
  const snackbarText = ref("");
  const snackbarColor = ref<"success" | "error" | "info">("success");

  // Opciones de año y mes
  const anioActual = new Date().getFullYear();
  const anios = ref<number[]>(
    Array.from({ length: 10 }, (_, i) => anioActual - i)
  );

  const { mesesWithValue: mesess} = mesesAnio();


  const meses = ref(mesess);

  // Función auxiliar para establecer el archivo
  const setArchivoSeleccionado = (file: File | null) => {
    archivoSeleccionado.value = file;
    validacionArchivo.value = null;
    validacionEnProgreso.value = false;
    
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        validacionEnProgreso.value = true;
      }
      
      validarArchivoCSV(file)
        .catch(error => {
          console.error("Error en validación asíncrona:", error);
        })
        .finally(() => {
          validacionEnProgreso.value = false;
        });
    }
  };

  // Validación asíncrona del archivo
  const validarArchivoCSV = async (file: File): Promise<ValidacionCSV> => {
    try {
      const resultado = await validarCSV(file, columnasEsperadas);
      validacionArchivo.value = resultado;
      
      if (!resultado.valido) {
        console.error("Errores de validación CSV:", resultado.errores);
      } else {
        console.log("CSV validado");
      }
      
      return resultado;
    } catch (error) {
      console.error("Error validando CSV:", error);
      const errorResult: ValidacionCSV = {
        valido: false,
        errores: ["Error al validar el archivo: " + (error instanceof Error ? error.message : String(error))],
      };
      validacionArchivo.value = errorResult;
      return errorResult;
    }
  };

  // Reglas de validación
  const archivoRules = [
    (value: File | File[] | null) => {
      let file: File | null = null;
      
      if (!value) {
        return "Debe seleccionar un archivo";
      }
      
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return "Debe seleccionar un archivo";
        }
        file = value[0] || null;
      } else {
        file = value;
      }
      
      if (!file || !(file instanceof File)) {
        return "Archivo inválido";
      }

      if (!file.name.toLowerCase().endsWith(".csv")) {
        return "El archivo debe ser formato CSV";
      }

      if (file.size === 0) {
        return "El archivo está vacío";
      }

      if (validacionArchivo.value !== null && !validacionArchivo.value.valido) {
        return validacionArchivo.value.errores[0] || "El archivo CSV no es válido";
      }

      return true;
    },
  ];

  const anioRules = [
    (value: number | null) => {
      if (!value) return "Debe seleccionar un año";
      return true;
    },
  ];

  const mesRules = [
    (value: number | null) => {
      if (!value) return "Debe seleccionar un mes";
      return true;
    },
  ];

  const puedeCargar = computed(() => {
    const tieneArchivo = archivoSeleccionado.value !== null;
    const tieneAnio = anioSeleccionado.value !== null;
    const tieneMes = mesSeleccionado.value !== null;
    const archivoValido = validacionArchivo.value?.valido !== false;
    
    return tieneArchivo && tieneAnio && tieneMes && archivoValido && !loading.value;
  });

  // Función para cargar el archivo
  const cargarArchivo = async () => {
    if (form.value) {
      const { valid: formValid } = await form.value.validate();
      
      if (!formValid) {
        console.error("Formulario no válido");
        mostrarMensaje("Por favor complete todos los campos correctamente", "error");
        return;
      }
    }

    if (!archivoSeleccionado.value || !anioSeleccionado.value || !mesSeleccionado.value) {
      mostrarMensaje("Faltan datos por completar", "error");
      return;
    }

    if (validacionArchivo.value && !validacionArchivo.value.valido) {
      console.error("Archivo no válido:", validacionArchivo.value.errores);
      mostrarMensaje(
        `Error en el archivo: ${validacionArchivo.value.errores.join(", ")}`,
        "error"
      );
      return;
    }

    loading.value = true;
    mostrarMensaje("Procesando archivo, por favor espere...", "info");

    try {
      const formData = new FormData();
      formData.append("file", archivoSeleccionado.value);
      formData.append("anio", anioSeleccionado.value.toString());
      formData.append("mes", mesSeleccionado.value.toString().padStart(2, "0"));

      console.log("Enviando archivo:", {
        nombre: archivoSeleccionado.value.name,
        tamaño: archivoSeleccionado.value.size,
        anio: anioSeleccionado.value,
        mes: mesSeleccionado.value,
      });

      const response = await uploadAction(formData);

      await cargarDatos();
      limpiarFormulario();

      mostrarMensaje(
        response.mensaje || "Archivo cargado exitosamente",
        "success"
      );
    } catch (error: any) {
      console.error("Error al cargar archivo:", error);
      
      let mensajeError = "Error al cargar el archivo";
      if (error.response?.data?.detalleMensaje) {
        mensajeError = error.response.data.detalleMensaje;
      } else if (error.message) {
        mensajeError = error.message;
      }
      
      mostrarMensaje(mensajeError, "error");
    } finally {
      loading.value = false;
    }
  };

  // CORRECCIÓN: Función para cargar datos - ya no asume que es array
  const cargarDatos = async () => {
    loading.value = true;
    try {
      const data = await fetchAction();
      console.log("Datos recibidos:", data);
      // transformarDatos ahora recibe T directamente (puede ser objeto o array)
      registros.value = transformarDatos(data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      mostrarMensaje("Error al cargar los registros", "error");
    } finally {
      loading.value = false;
    }
  };

  const mostrarMensaje = (
    texto: string,
    color: "success" | "error" | "info"
  ) => {
    snackbarText.value = texto;
    snackbarColor.value = color;
    snackbar.value = true;
  };

  const limpiarFormulario = () => {
    archivo.value = null;
    archivoSeleccionado.value = null;
    validacionArchivo.value = null;
    anioSeleccionado.value = null;
    mesSeleccionado.value = null;
    
    if (form.value) {
      form.value.reset();
      form.value.resetValidation();
    }
  };

  return {
    form,
    valid,
    archivo,
    archivoSeleccionado,
    anioSeleccionado,
    mesSeleccionado,
    loading,
    registros,
    validacionEnProgreso,
    snackbar,
    snackbarText,
    snackbarColor,
    archivoRules,
    anioRules,
    mesRules,
    anios,
    meses,
    cargarArchivo,
    cargarDatos,
    setArchivoSeleccionado,
    puedeCargar,
  };
};
