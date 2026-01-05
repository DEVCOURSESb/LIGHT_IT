// composables/archivos/useCargaArchivos.ts
import { ref, computed, type Ref } from "vue";
import type {
  CargaArchivoResponse,
  RegistroTabla,
  ValidacionCSV,
} from "@/API/generic/carga-archivos";
import { validarCSV } from "@/utils/validateCSV";

interface UseCargaArchivosOptions<T> {
  fetchAction: () => Promise<T[]>;
  uploadAction: (formData: FormData) => Promise<CargaArchivoResponse>;
  columnasEsperadas?: string[];
  transformarDatos: (data: T[]) => RegistroTabla[];
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

  // Estado del archivo - IMPORTANTE: puede ser File o File[] dependiendo del modo de Vuetify
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

  const meses = ref([
    { nombre: "Enero", valor: 1 },
    { nombre: "Febrero", valor: 2 },
    { nombre: "Marzo", valor: 3 },
    { nombre: "Abril", valor: 4 },
    { nombre: "Mayo", valor: 5 },
    { nombre: "Junio", valor: 6 },
    { nombre: "Julio", valor: 7 },
    { nombre: "Agosto", valor: 8 },
    { nombre: "Septiembre", valor: 9 },
    { nombre: "Octubre", valor: 10 },
    { nombre: "Noviembre", valor: 11 },
    { nombre: "Diciembre", valor: 12 },
  ]);

  // Función auxiliar para establecer el archivo
  const setArchivoSeleccionado = (file: File | null) => {
    console.log("setArchivoSeleccionado llamado con:", file?.name || "null");
    archivoSeleccionado.value = file;
    validacionArchivo.value = null; // Reset validación previa
    validacionEnProgreso.value = false;
    
    if (file) {
      // Iniciar validación para archivos grandes
      if (file.size > 10 * 1024 * 1024) { // > 10MB
        validacionEnProgreso.value = true;
      }
      
      // Validar archivo inmediatamente (en background)
      validarArchivoCSV(file)
        .catch(error => {
          console.error("Error en validación asíncrona:", error);
          // No bloquear el archivo si falla la validación asíncrona
        })
        .finally(() => {
          validacionEnProgreso.value = false;
        });
    }
  };

  // Validación asíncrona del archivo
  const validarArchivoCSV = async (file: File): Promise<ValidacionCSV> => {
    try {
      console.log("Iniciando validación asíncrona del CSV...");
      const resultado = await validarCSV(file, columnasEsperadas);
      validacionArchivo.value = resultado;
      
      if (!resultado.valido) {
        console.error("Errores de validación CSV:", resultado.errores);
      } else {
        console.log("✓ Archivo CSV validado correctamente");
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
      console.log("Validando archivo, value:", value);
      
      // Normalizar a File único
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
      
      // Validar que sea un File válido
      if (!file || !(file instanceof File)) {
        return "Archivo inválido";
      }

      // Validar extensión
      if (!file.name.toLowerCase().endsWith(".csv")) {
        return "El archivo debe ser formato CSV";
      }

      // Validar tamaño (máximo 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB en bytes
      if (file.size > maxSize) {
        return "El archivo no debe superar 100MB";
      }

      // Validar que no esté vacío
      if (file.size === 0) {
        return "El archivo está vacío";
      }

      // Si hay errores de validación del CSV (y la validación ya terminó)
      // Solo validar si la validación ya se completó
      if (validacionArchivo.value !== null && !validacionArchivo.value.valido) {
        return validacionArchivo.value.errores[0] || "El archivo CSV no es válido";
      }

      // Si la validación está en progreso, considerarlo válido temporalmente
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

  // Computed para verificar si puede cargar
  const puedeCargar = computed(() => {
    const tieneArchivo = archivoSeleccionado.value !== null;
    const tieneAnio = anioSeleccionado.value !== null;
    const tieneMes = mesSeleccionado.value !== null;
    const archivoValido = validacionArchivo.value?.valido !== false;
    
    console.log("puedeCargar:", { 
      tieneArchivo, 
      tieneAnio, 
      tieneMes, 
      archivoValido,
      archivo: archivoSeleccionado.value?.name 
    });
    
    return tieneArchivo && tieneAnio && tieneMes && archivoValido && !loading.value;
  });

  // Función para cargar el archivo
  const cargarArchivo = async () => {
    console.log("=== Iniciando carga de archivo ===");
    console.log("Estado actual:", {
      archivo: archivo.value,
      archivoSeleccionado: archivoSeleccionado.value,
      anio: anioSeleccionado.value,
      mes: mesSeleccionado.value,
      validacionArchivo: validacionArchivo.value,
    });
    
    // Validar formulario
    if (form.value) {
      const { valid: formValid } = await form.value.validate();
      console.log("Validación del formulario:", formValid);
      
      if (!formValid) {
        console.error("Formulario no válido");
        mostrarMensaje("Por favor complete todos los campos correctamente", "error");
        return;
      }
    }

    // Verificar que todo esté listo
    if (!archivoSeleccionado.value || !anioSeleccionado.value || !mesSeleccionado.value) {
      console.error("Faltan datos:", {
        archivo: archivoSeleccionado.value?.name,
        anio: anioSeleccionado.value,
        mes: mesSeleccionado.value,
      });
      mostrarMensaje("Faltan datos por completar", "error");
      return;
    }

    // Validar archivo una vez más antes de subir
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
      // Crear FormData
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

      // Subir archivo
      const response = await uploadAction(formData);

      console.log("Respuesta del servidor:", response);

      // Recargar datos
      await cargarDatos();

      // Limpiar formulario
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

  // Función para cargar datos de registros previos
  const cargarDatos = async () => {
    loading.value = true;
    try {
      const data = await fetchAction();
      registros.value = transformarDatos(data);
      console.log("Datos cargados:", registros.value.length, "registros");
    } catch (error) {
      console.error("Error al cargar datos:", error);
      mostrarMensaje("Error al cargar los registros", "error");
    } finally {
      loading.value = false;
    }
  };

  // Función auxiliar para mostrar mensajes
  const mostrarMensaje = (
    texto: string,
    color: "success" | "error" | "info"
  ) => {
    snackbarText.value = texto;
    snackbarColor.value = color;
    snackbar.value = true;
  };

  // Función para limpiar el formulario
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
    // Form
    form,
    valid,

    // Estados
    archivo,
    archivoSeleccionado,
    anioSeleccionado,
    mesSeleccionado,
    loading,
    registros,
    validacionEnProgreso,

    // Snackbar
    snackbar,
    snackbarText,
    snackbarColor,

    // Validaciones
    archivoRules,
    anioRules,
    mesRules,

    // Opciones
    anios,
    meses,

    // Métodos
    cargarArchivo,
    cargarDatos,
    setArchivoSeleccionado,
    puedeCargar,
  };
};
