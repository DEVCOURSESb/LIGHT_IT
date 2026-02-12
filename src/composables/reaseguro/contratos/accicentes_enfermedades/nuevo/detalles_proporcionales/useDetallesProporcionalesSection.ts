import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { useDetallesProporcionalesValidations } from "./useDetallesProporcionalesValidations";
import { ref, watch, computed } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import type { Extension } from "@/API/catalogos/extensiones/extensiones.interfaces";
import { DialogType, useDialog } from "@/stores/dialogStore";

interface DetallesProporcionalesFormTable {
  capacidadContrato: number;
  cumulos: string;
  cveCriterioAsigCapacidad: number;
  cveDistrCesion: number;
  cveExtCoberDetalles: number;
  cveMonedaDetalles: number;
  cveOperRamoDetalles: string;
  detallesOperRamo: string;
  montoCesion: number;
  montoRetencion: number;
  montoRetencionContrato: number;
  porcentajeRetencion: number | null;
  porcentajeCesion: number | null;
  detalleActivo: boolean;
}

interface DetallesProporcionalesTableDisplay extends DetallesProporcionalesFormTable {
  descExtCoberDetalles: string;
  descOperRamoDetalles: string;
  descCriterioAsigCapacidad: string;
  descDistrCesion: string;
  descMonedaDetalles: string;
  montoRetencionFormatted: string;
  montoRetencionContratoFormatted: string;
  montoCesionFormatted: string;
  capacidadContratoFormatted: string;
}

export const useDetallesProporcionalesSection = () => {
  const { obtenerGenerales, guardarDetallesProporcionales, obtenerDetallesProporcionales } = useContratoAEStore();
  const generales = obtenerGenerales();
  const dialog = useDialog();

  const {
    queryExtensionesCobertura,
    queryOperacionesRamos,
    queryCriterioAsignacion,
    queryDistribucionCesion,
    queryMoneda,
  } = useAccidentesEnfermedades();

  const extensionesCoberturaToShow = ref<Extension[]>([]);

  const porcentajeRetencion = ref();
  const porcentajeCesion = ref();
  const montoRetencion = ref("");
  const montoRetencionContrato = ref("");
  const montoCesion = ref("");
  const capacidadContrato = ref("");

  const detallesProporcionalesTable = ref<DetallesProporcionalesFormTable[]>(obtenerDetallesProporcionales() || []);

  // Función para calcular las extensiones de cobertura a mostrar a traves de la consulta de extensiones de cobertura y operación ramo
  const calcularExtensiones = () => {
    const operaciones = generales?.dataTableOperacionRamo ?? [];

    const minExtCober =
      operaciones.length > 0
        ? Math.min(...operaciones.map((op: any) => op.cveExtCober))
        : null;

    extensionesCoberturaToShow.value =
      queryExtensionesCobertura.data.value
        ?.filter((ext: Extension) =>
          minExtCober !== null ? ext.cveExtCober >= minExtCober : true,
        )
        .sort((a, b) => a.cveExtCober - b.cveExtCober) ?? [];
  };

  // cuando cambie la consulta de extensiones de cobertura, recalcula las extensiones a mostrar
  watch(
    () => queryExtensionesCobertura.data.value,
    (newData) => {
      if (newData) {
        calcularExtensiones();
      }
    },
    { immediate: true },
  );

  const showErrors = ref<boolean>(false);

  const {
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
    resetForm,
  } = useForm({
    validationSchema: useDetallesProporcionalesValidations(),
    validateOnMount: false,
  });

  watch(
    () => formData.detallesOperRamo,
    (newVal) => {
      if (newVal === "NO") {
        setFieldValue("cveExtCoberDetalles", null);
        setFieldValue("cveOperRamoDetalles", null);
      }
    },
  );

  // Resetea el campo de operación ramo cuando cambie la extensión de cobertura
  watch(
    () => formData.cveExtCoberDetalles,
    (newVal) => {
      if (newVal) {
        setFieldValue("cveOperRamoDetalles", null);
      }
    },
  );

  // cuando cambie el estado de porcentaje de retencion, actualiza el campo en el formulario
  // el porcentaje de cesion se calcula automaticamente
  watch(
    () => porcentajeRetencion.value,
    (newVal) => {
      if(!!newVal){
        setFieldValue("porcentajeRetencion", newVal);
        porcentajeCesion.value = 100 - newVal;
        if (newVal < 0) {
          porcentajeRetencion.value = 0;
        } else if (newVal > 100) {
          porcentajeRetencion.value = 100;
        }
      }
    },
  );

  // cuando cambie el estado de porcentaje de cesion, actualiza el campo en el formulario
  // el porcentaje de retencion se calcula automaticamente
  watch(
    () => porcentajeCesion.value,
    (newVal) => {
      setFieldValue("porcentajeCesion", newVal);
      if (newVal < 0) {
        porcentajeCesion.value = 0;
      } else if (newVal > 100) {
        porcentajeCesion.value = 100;
      }
    },
  );

  // Función para formatear números durante la escritura
  const formattNumber = (value: string) => {
    // Elimina todo lo que no sea número o punto
    let clean = value.replace(/[^\d.]/g, "");

    // Permite solo un punto decimal
    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = parts[0] + "." + parts.slice(1).join("");
    }

    // Si hay decimales, limita a 2
    if (clean.includes(".")) {
      const [enteros, decimales] = clean.split(".");
      if (decimales && decimales.length > 2) {
        clean = enteros + "." + decimales.slice(0, 2);
      }
    }

    return clean;
  };

  // Función para formatear números con comas y 2 decimales
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  //MONTO RETENCION
  const onInput = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    montoRetencion.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("montoRetencion", numericValue);
  };

  const onBlur = () => {
    if (!montoRetencion.value || montoRetencion.value === "") {
      setFieldValue("montoRetencion", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(montoRetencion.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      montoRetencion.value = "";
      setFieldValue("montoRetencion", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("montoRetencion", numericValue);

    // Formatear para visualización con comas y dos decimales
    montoRetencion.value = formatCurrency(numericValue);
  };

  // MONTO RETENCION CONTRATO
  const onInputRC = (value: string) => {
    // limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    montoRetencionContrato.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("montoRetencionContrato", numericValue);
  };

  const onBlurRC = () => {
    if (!montoRetencionContrato.value || montoRetencionContrato.value === "") {
      setFieldValue("montoRetencionContrato", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(montoRetencionContrato.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      montoRetencionContrato.value = "";
      setFieldValue("montoRetencionContrato", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("montoRetencionContrato", numericValue);

    // Formatear para visualización con comas y dos decimales
    montoRetencionContrato.value = formatCurrency(numericValue);
  };

  // MONTO CESION
  const onInputMC = (value: string) => {
    // limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    montoCesion.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("montoCesion", numericValue);
  };

  const onBlurMC = () => {
    if (!montoCesion.value || montoCesion.value === "") {
      setFieldValue("montoCesion", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(montoCesion.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      montoCesion.value = "";
      setFieldValue("montoCesion", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("montoCesion", numericValue);

    // Formatear para visualización con comas y dos decimales
    montoCesion.value = formatCurrency(numericValue);
  };

  // CAPACIDAD CONTRATO
  const onInputCC = (value: string) => {
    // limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    capacidadContrato.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("capacidadContrato", numericValue);
  };

  const onBlurCC = () => {
    if (!capacidadContrato.value || capacidadContrato.value === "") {
      setFieldValue("capacidadContrato", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(capacidadContrato.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      capacidadContrato.value = "";
      setFieldValue("capacidadContrato", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("capacidadContrato", numericValue);

    // Formatear para visualización con comas y dos decimales
    capacidadContrato.value = formatCurrency(numericValue);
  };

  const compareRows = (row1: DetallesProporcionalesFormTable, row2: DetallesProporcionalesFormTable) => {
    return row1.capacidadContrato === row2.capacidadContrato &&
        row1.cumulos === row2.cumulos &&
        row1.cveCriterioAsigCapacidad === row2.cveCriterioAsigCapacidad &&
        row1.cveDistrCesion === row2.cveDistrCesion &&
        row1.cveExtCoberDetalles === row2.cveExtCoberDetalles &&
        row1.cveMonedaDetalles === row2.cveMonedaDetalles &&
        row1.cveOperRamoDetalles === row2.cveOperRamoDetalles &&
        row1.detallesOperRamo === row2.detallesOperRamo &&
        row1.montoCesion === row2.montoCesion &&
        row1.montoRetencion === row2.montoRetencion &&
        row1.montoRetencionContrato === row2.montoRetencionContrato &&
        row1.detalleActivo === row2.detalleActivo;
  };

  // Función helper para obtener descripciones por clave
  const getDescripcionByClave = (items: any[], claveField: string, descField: string, claveValue: any): string => {
    const item = items?.find((i) => i[claveField] === claveValue);
    return item ? item[descField] : claveValue?.toString() || "";
  };

  // Computed property para transformar los datos de la tabla con las descripciones
  const detallesProporcionalesTableDisplay = computed<DetallesProporcionalesTableDisplay[]>(() => {
    return detallesProporcionalesTable.value.map((row) => {
      return {
        ...row,
        // Agregar las descripciones correspondientes
        descExtCoberDetalles: getDescripcionByClave(
          queryExtensionesCobertura.data.value ?? [],
          "cveExtCober",
          "descExtCober",
          row.cveExtCoberDetalles
        ),
        descOperRamoDetalles: getDescripcionByClave(
          queryOperacionesRamos.data.value ?? [],
          "cveCobertura",
          "descOperacionRamos",
          row.cveOperRamoDetalles
        ),
        descCriterioAsigCapacidad: getDescripcionByClave(
          queryCriterioAsignacion.data.value ?? [],
          "cveCriterioAsig",
          "descCriterioAsig",
          row.cveCriterioAsigCapacidad
        ),
        descDistrCesion: getDescripcionByClave(
          queryDistribucionCesion.data.value ?? [],
          "cveDistrcesion",
          "descDistrcesion",
          row.cveDistrCesion
        ),
        descMonedaDetalles: getDescripcionByClave(
          queryMoneda.data.value ?? [],
          "cveMoneda",
          "descMoneda",
          row.cveMonedaDetalles
        ),
        // Formatear los montos
        montoRetencionFormatted: formatCurrency(row.montoRetencion),
        montoRetencionContratoFormatted: formatCurrency(row.montoRetencionContrato),
        montoCesionFormatted: formatCurrency(row.montoCesion),
        capacidadContratoFormatted: formatCurrency(row.capacidadContrato),
      };
    });
  });

  const sendDataToTable = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Estás seguro de agregar este detalle proporcional a la tabla?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Sí, agregar",
        color: "primary",
        handler: confirmSendDataToTable
      }
    });
  }

  const confirmSendDataToTable = async () => {
    if (!formData.porcentajeRetencion) {
      setFieldValue("porcentajeRetencion", null);
    }
    if (!formData.porcentajeCesion) {
      setFieldValue("porcentajeCesion", null);
    }
  
    showErrors.value = true;
    const { valid } = await validate();
    if (valid) {
      console.log(formData);

      const newRow = {...formData, detalleActivo: true} as DetallesProporcionalesFormTable;

      // verificar que no exista una fila con la misma informacion
      const exists = detallesProporcionalesTable.value.some((row) => 
        compareRows(row, newRow)
      );

      if(!exists) {
        detallesProporcionalesTable.value.push(newRow);
        // limpiar formulario
        resetForm();
        showErrors.value = false;
        porcentajeRetencion.value = null;
        porcentajeCesion.value = null;
        montoRetencion.value = "";
        montoRetencionContrato.value = "";
        montoCesion.value = "";
        capacidadContrato.value = "";
      } else {
        dialog.show({
          title: "Error",
          message: "Ya existe una fila con la misma información. Por favor, modifica los datos para agregar una nueva fila.",
          type: DialogType.ERROR,
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (detallesProporcionalesTable.value.length === 0) {
      dialog.show({
        title: "Error",
        message: "Debe agregar al menos un detalle proporcional antes de continuar.",
        type: DialogType.ERROR,
      });
      return;
    }

    guardarDetallesProporcionales(detallesProporcionalesTable.value);

    dialog.show({
      title: "Datos guardados",
      message: "Los detalles proporcionales han sido guardados exitosamente.",
      type: DialogType.SUCCESS,
    });
  };

  const editRow = (displayItem: DetallesProporcionalesTableDisplay) => {
    // Encontrar el item original en la tabla de datos (no en la de display)
    const originalItem = detallesProporcionalesTable.value.find(row => 
      compareRows(row, displayItem as DetallesProporcionalesFormTable)
    );

    if (!originalItem) return;

    // Cargar los datos al formulario
    setFieldValue("detallesOperRamo", originalItem.detallesOperRamo);
    setFieldValue("cveExtCoberDetalles", originalItem.cveExtCoberDetalles);
    setFieldValue("cveOperRamoDetalles", originalItem.cveOperRamoDetalles);
    
    // Cargar porcentajes
    porcentajeRetencion.value = originalItem.porcentajeRetencion;
    porcentajeCesion.value = originalItem.porcentajeCesion;
    
    // Cargar montos formateados
    montoRetencion.value = formatCurrency(originalItem.montoRetencion);
    setFieldValue("montoRetencion", originalItem.montoRetencion);
    
    montoRetencionContrato.value = formatCurrency(originalItem.montoRetencionContrato);
    setFieldValue("montoRetencionContrato", originalItem.montoRetencionContrato);
    
    montoCesion.value = formatCurrency(originalItem.montoCesion);
    setFieldValue("montoCesion", originalItem.montoCesion);
    
    capacidadContrato.value = formatCurrency(originalItem.capacidadContrato);
    setFieldValue("capacidadContrato", originalItem.capacidadContrato);
    
    setFieldValue("cveCriterioAsigCapacidad", originalItem.cveCriterioAsigCapacidad);
    setFieldValue("cveDistrCesion", originalItem.cveDistrCesion);
    setFieldValue("cveMonedaDetalles", originalItem.cveMonedaDetalles);
    setFieldValue("cumulos", originalItem.cumulos);

    // Eliminar la fila editada de la tabla
    detallesProporcionalesTable.value = detallesProporcionalesTable.value.filter(
      row => !compareRows(row, originalItem)
    );

    // Resetear errores
    showErrors.value = false;
  };

  const toggleActive = (displayItem: DetallesProporcionalesTableDisplay) => {
    // busca si por lo menos hay dos filas activas, para permitir desactivar una
    const algunaActiva = detallesProporcionalesTable.value.some(
      (m) => !compareRows(m, displayItem as DetallesProporcionalesFormTable) && m.detalleActivo
    );

    // si no hay ninguna activa, mostramos un dialogo y salimos de la funcion
    if (!algunaActiva) {
      dialog.show({
        title: "Atención",
        message: "Debe haber al menos una fila activa.",
        type: DialogType.ERROR,
      });
      return;
    }

    // Encontrar el índice en la tabla original
    const index = detallesProporcionalesTable.value.findIndex(
      row => compareRows(row, displayItem as DetallesProporcionalesFormTable)
    );

    if (index !== -1) {
      detallesProporcionalesTable.value[index]!.detalleActivo = 
        !detallesProporcionalesTable.value[index]!.detalleActivo;
    }
  };

  const detallesProporcionalesTableHeaders = [
    { 
      title: "Tipo operación / ramo", 
      key: "descExtCoberDetalles", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Operación / ramo (detallada)", 
      key: "descOperRamoDetalles", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "% Retención", 
      key: "porcentajeRetencion", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "% Cesión", 
      key: "porcentajeCesion", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Monto Retención", 
      key: "montoRetencionFormatted", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Monto Retención Contrato", 
      key: "montoRetencionContratoFormatted", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Monto Cesión", 
      key: "montoCesionFormatted", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Capacidad de contrato", 
      key: "capacidadContratoFormatted", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Criterio de capacidad", 
      key: "descCriterioAsigCapacidad", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Distribución Cesión", 
      key: "descDistrCesion", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Moneda detalles", 
      key: "descMonedaDetalles", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "¿cúmulos?", 
      key: "cumulos", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Activo", 
      key: "detalleActivo", 
      sortable: true, 
      headerProps: { style: "font-weight: bold" } 
    },
    { 
      title: "Acciones", 
      key: "actions", 
      sortable: false, 
      headerProps: { style: "font-weight: bold" } 
    },
  ];

  return {
    formData,
    setFieldValue,
    formErrors,
    showErrors,
    handleSubmit,
    queryExtensionesCobertura,
    extensionesCoberturaToShow,
    queryOperacionesRamos,
    porcentajeRetencion,
    porcentajeCesion,
    montoRetencion,
    onInput,
    onBlur,
    montoRetencionContrato,
    onInputRC,
    onBlurRC,
    montoCesion,
    onInputMC,
    onBlurMC,
    capacidadContrato,
    onInputCC,
    onBlurCC,
    queryCriterioAsignacion,
    queryDistribucionCesion,
    queryMoneda,
    detallesProporcionalesTableDisplay,
    detallesProporcionalesTableHeaders,
    sendDataToTable,
    editRow,
    toggleActive,
  };
};