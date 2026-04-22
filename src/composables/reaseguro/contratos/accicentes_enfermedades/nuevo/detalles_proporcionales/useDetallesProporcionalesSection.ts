import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { useDetallesProporcionalesValidations } from "./useDetallesProporcionalesValidations";
import { ref, watch, computed } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
import { storeToRefs } from "pinia";
import type { DetallesProporcionalesSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";
import type { Extension } from "@/API/catalogos/extensiones/extensiones.interfaces";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { formattNumber } from "@/utils/formatters/formattNumber";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

// Tipo display: extiende la interfaz con campos calculados para la tabla
type DetallesProporcionalesDisplay = DetallesProporcionalesSection & {
  descExtCoberDetalles: string;
  descOperRamoDetalles: string;
  descCriterioAsigCapacidad: string;
  descDistrCesion: string;
  descMonedaDetalles: string;
  montoRetencionFormatted: string;
  montoCesionFormatted: string;
  capacidadContratoFormatted: string;
};

// tipo del formulario — sin idContrato (lo agrega el store al guardar)
type DetallesProporcionalesForm = Omit<DetallesProporcionalesSection, "idContrato">;

export const useDetallesProporcionalesSection = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const { generales, detallesProporcionales } = storeToRefs(aeStore);

  const {
    queryExtensionesCobertura,
    queryOperacionesRamos,
    queryCriterioAsignacion,
    queryDistribucionCesion,
    queryMoneda,
  } = useAccidentesEnfermedades();

  //  Extensiones filtradas por el mínimo de CAE_OPERACION_RAMO 
  const extensionesCoberturaToShow = ref<Extension[]>([]);

  const calcularExtensiones = () => {
    const operaciones =
      generales.value.CAE_OPERACION_RAMO.filter(
        row => row.operRamoActivo
      ) ?? [];

    if (operaciones.length === 0) {
      extensionesCoberturaToShow.value = [];
      return;
    }

    // Para 1 o más registros: tomar el mínimo registrado
    const minExtCober = Math.min(
      ...operaciones.map(op => op.cveExtCoberContrato)
    );

    extensionesCoberturaToShow.value =
      queryExtensionesCobertura.data.value
        ?.filter((ext: Extension) =>
          ext.cveExtCober >= minExtCober
        )
        .sort((a, b) => a.cveExtCober - b.cveExtCober) ?? [];
  };

  watch(
    [
      () => queryExtensionesCobertura.data.value,
      () => generales.value.CAE_OPERACION_RAMO
    ],
    ([data, operacion]) => {
      if (data || operacion) {
        calcularExtensiones();
      }
    },
    { immediate: true }
  );

  //  Tabla local — inicializada desde el ref del store 
  // Se trabaja sobre una copia local para la edición en curso;
  // guardarDetallesProporcionales actualiza el ref del store + localStorage.
  const detallesProporcionalesTable = ref<DetallesProporcionalesSection[]>(
    [...detallesProporcionales.value]
  );


  // Valor fijo de detallesOperRamo una vez que existe algún registro
  const detallesOperRamoFijo = computed<number | null>(
    () => detallesProporcionalesTable.value[0]?.detallesOperRamo ?? null
  );

  //  Refs de campos numéricos (formateo visual) 
  const porcentajeRetencion = ref<number | null>(null)

  const porcentajeRetencionSlider = computed({
    get: () => porcentajeRetencion.value ?? 0,
    set: (val: number) => {
      porcentajeRetencion.value = val
    }
  })
  const porcentajeCesion       = ref<number>(0);
  const montoRetencion         = ref("");
  const montoCesion            = ref("");
  const capacidadContrato      = ref("");

  const formatNumberRefs: Record<string, typeof montoRetencion> = {
    montoRetencion,
    montoCesion,
    capacidadContrato,
  };

  //  Formulario 
  const showErrors = ref<boolean>(false);

  const {
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
    resetForm,
  } = useForm<DetallesProporcionalesForm>({
    validationSchema: useDetallesProporcionalesValidations(),
    validateOnMount: false,
    initialValues: {
      detallesOperRamo:         detallesOperRamoFijo.value ?? 0,
      detalleActivo:            true,
    },
  });

   // Bloqueado mientras haya al menos un registro activo (patrón criterioEstaFijo)
  const isDetallesOperacionRamoDisabled = computed<boolean>(() => {
    //  tipo de reaseguro es PROPORCIONAL (0)
    if (generales.value.cveTreaseg !== 0) return true;

    const operacionesActivas = generales.value.CAE_OPERACION_RAMO.filter(
      (r) => r.operRamoActivo,
    );

    const total = operacionesActivas.length;

    if (total === 0) return true;

    if (total === 1) {
      const tipoCober = operacionesActivas[0]!.cveExtCoberContrato;
      if (tipoCober === 3) {
        setFieldValue("detallesOperRamo", 0);
        return true;
      }
      // total=1 y tipo≠3 → habilitado
      return false;
    }

    // total > 1 → habilitado
    return false;
  });



  // Sincronizar detallesOperRamo cuando ya hay registros previos
  watch(
    detallesOperRamoFijo,
    (val) => { if (val !== null) setFieldValue("detallesOperRamo", val); },
    { immediate: true }
  );

  // Limpiar campos dependientes al cambiar detallesOperRamo
  watch(
    () => formData.detallesOperRamo,
    (newVal) => {
      if (newVal === 0) {
        setFieldValue("cveExtCoberDetalles", null);
        setFieldValue("cveOperRamoDetalles", null);
      }
    }
  );

  // Limpiar operación/ramo cuando cambia el tipo de extensión
  watch(
    () => formData.cveExtCoberDetalles,
    (newVal) => { if (newVal) setFieldValue("cveOperRamoDetalles", null); }
  );

  //  Porcentajes (lógica cruzada) 
  watch(porcentajeRetencion, (newVal) => {
    if (newVal != null) {
      const clamped = Math.min(100, Math.max(0, newVal));
      if (clamped !== newVal) porcentajeRetencion.value = clamped;
      setFieldValue("porcentajeRetencion", clamped);
      porcentajeCesion.value = parseFloat((100 - clamped).toFixed(2));
    } else {
      setFieldValue("porcentajeRetencion", 0);
      porcentajeCesion.value = 0;
      setFieldValue("porcentajeCesion", 0);
    }
  }, { immediate: true });

  // % Cesión es solo lectura: solo se sincroniza al form
  watch(porcentajeCesion, (newVal) => {
    setFieldValue("porcentajeCesion", newVal ?? 0);
  });

  //  Handler genérico para campos numéricos con formato 
  const onInputGeneric = (key: string, value: string) => {
    const clean    = formattNumber(value);
    const fieldRef = formatNumberRefs[key];
    if (fieldRef) {
      fieldRef.value = clean;
      setFieldValue(
        key as keyof DetallesProporcionalesForm,
        clean === "" ? null : parseFloat(clean)
      );
    }
  };

  const onBlurGeneric = (key: string) => {
    const fieldRef = formatNumberRefs[key];
    if (!fieldRef) return;

    if (!fieldRef.value) {
      setFieldValue(key as keyof DetallesProporcionalesForm, null);
      return;
    }

    const numeric = parseFloat(fieldRef.value);
    if (isNaN(numeric)) {
      fieldRef.value = "";
      setFieldValue(key as keyof DetallesProporcionalesForm, null);
      return;
    }

    setFieldValue(key as keyof DetallesProporcionalesForm, numeric);
    fieldRef.value = formatCurrency(numeric);
  };

  //  Computed display 
  const getDesc = (items: any[], claveField: string, descField: string, value: any): string =>
    items?.find((i) => i[claveField] === value)?.[descField] ?? value?.toString() ?? "";

  const detallesProporcionalesTableDisplay = computed<DetallesProporcionalesDisplay[]>(() =>
    detallesProporcionalesTable.value.map((row) => ({
      ...row,
      descExtCoberDetalles: getDesc(
        queryExtensionesCobertura.data.value ?? [], "cveExtCober", "descExtCober", row.cveExtCoberDetalles
      ),
      descOperRamoDetalles: getDesc(
        queryOperacionesRamos.data.value ?? [], "cveCobertura", "descOperacionRamos", row.cveOperRamoDetalles
      ),
      descCriterioAsigCapacidad: getDesc(
        queryCriterioAsignacion.data.value ?? [], "cveCriterioAsig", "descCriterioAsig", row.cveCriterioAsigCapacidad
      ),
      descDistrCesion: getDesc(
        queryDistribucionCesion.data.value ?? [], "cveDistrcesion", "descDistrcesion", row.cveDistrCesion
      ),
      descMonedaDetalles: getDesc(
        queryMoneda.data.value ?? [], "cveMoneda", "descMoneda", row.cveMonedaDetalles
      ),
      montoRetencionFormatted:         formatCurrency(row.montoRetencion),
      montoCesionFormatted:            formatCurrency(row.montoCesion),
      capacidadContratoFormatted:      formatCurrency(row.capacidadContrato),
    }))
  );

  //  Reset del formulario 
  const resetFormAndRefs = () => {
    resetForm();
    if (detallesOperRamoFijo.value !== null) {
      setFieldValue("detallesOperRamo", detallesOperRamoFijo.value);
    }
    porcentajeRetencion.value    = null;
    porcentajeCesion.value       = 0;
    montoRetencion.value         = "";
    montoCesion.value            = "";
    capacidadContrato.value      = "";
    showErrors.value             = false;
  };

  //  Agregar a tabla 
  const sendDataToTable = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar los detalles del contrato capturados?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: { text: "Sí, agregar", color: "primary", handler: confirmSendDataToTable },
    });
  };

  const confirmSendDataToTable = async () => {
    // Un solo registro cuando detallesOperRamo = NO
    if (formData.detallesOperRamo === 0 && detallesProporcionalesTable.value.length >= 1) {
      dialog.show({
        title: "Atención",
        message: "No se puede agregar más de un registro cuando no hay detalles por operación / ramo.",
        type: DialogType.ERROR,
      });
      return;
    }

    showErrors.value = true;

    const { valid } = await validate();
    if (!valid) return;

    // Validar duplicado por cveOperRamoDetalles (clave natural del spec)
    const operRamoNuevo = formData.cveOperRamoDetalles;
    if (
      operRamoNuevo != null &&
      detallesProporcionalesTable.value.some((r) => r.cveOperRamoDetalles === operRamoNuevo)
    ) {
      dialog.show({
        title: "Atención",
        message: "La operación / ramo seleccionada ya fue registrada previamente y no puede capturarse nuevamente.",
        type: DialogType.ERROR,
      });
      return;
    }

    const newRow: DetallesProporcionalesSection = {
      idContrato:               generales.value.idContrato,
      detallesOperRamo:         formData.detallesOperRamo,
      cveExtCoberDetalles:      formData.cveExtCoberDetalles ?? null,
      cveOperRamoDetalles:      formData.cveOperRamoDetalles ?? null,
      porcentajeRetencion:      formData.porcentajeRetencion ?? null,
      porcentajeCesion:         formData.porcentajeCesion ?? null,
      montoRetencion:           formData.montoRetencion ?? 0,
      montoCesion:              formData.montoCesion ?? 0,
      capacidadContrato:        formData.capacidadContrato ?? 0,
      cveCriterioAsigCapacidad: formData.cveCriterioAsigCapacidad,
      cveDistrCesion:           formData.cveDistrCesion,
      cveMonedaDetalles:        formData.cveMonedaDetalles,
      cumulos:                  formData.cumulos,
      detalleActivo:            true,
    };

    detallesProporcionalesTable.value.push(newRow);
    resetFormAndRefs();
    dialog.cerrar();
  };

  //  Guardar 
  const handleSubmit = () => {
    if (detallesProporcionalesTable.value.length === 0) {
      dialog.show({
        title: "Atención",
        message: "Debe agregar al menos un detalle proporcional antes de continuar.",
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que los datos ingresados de detalles del contrato son correctos?",
      type: DialogType.INFO,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Aceptar",
        color: "primary",
        handler: doGuardarDetalles,
      },
    });
  };

  const doGuardarDetalles = () => {
    // guardarDetallesProporcionales actualiza detallesProporcionales ref + localStorage
    aeStore.guardarDetallesProporcionales(detallesProporcionalesTable.value);
    dialog.cerrar();
  };

  //  Editar fila 
  const editRow = (displayItem: DetallesProporcionalesDisplay) => {
    const index = detallesProporcionalesTable.value.findIndex(
      (row) => row.cveOperRamoDetalles === displayItem.cveOperRamoDetalles
    );
    if (index === -1) return;

    const item = detallesProporcionalesTable.value[index]!;

    setFieldValue("detallesOperRamo",         item.detallesOperRamo);
    setFieldValue("cveExtCoberDetalles",      item.cveExtCoberDetalles);
    setFieldValue("cveOperRamoDetalles",      item.cveOperRamoDetalles);
    setFieldValue("cveCriterioAsigCapacidad", item.cveCriterioAsigCapacidad);
    setFieldValue("cveDistrCesion",           item.cveDistrCesion);
    setFieldValue("cveMonedaDetalles",        item.cveMonedaDetalles);
    setFieldValue("cumulos",                  item.cumulos);

    // Solo se asigna retención; cesión se recalcula via watch
    porcentajeRetencion.value = item.porcentajeRetencion ?? null;

    montoRetencion.value         = item.montoRetencion         ? formatCurrency(item.montoRetencion)         : "";
    montoCesion.value            = item.montoCesion            ? formatCurrency(item.montoCesion)            : "";
    capacidadContrato.value      = item.capacidadContrato      ? formatCurrency(item.capacidadContrato)      : "";

    setFieldValue("montoRetencion",         item.montoRetencion);
    setFieldValue("montoCesion",            item.montoCesion);
    setFieldValue("capacidadContrato",      item.capacidadContrato);

    detallesProporcionalesTable.value.splice(index, 1);
    showErrors.value = false;
  };

  //  Toggle activo 
  const toggleActive = (displayItem: DetallesProporcionalesDisplay) => {
    const index = detallesProporcionalesTable.value.findIndex(
      (row) => row.cveOperRamoDetalles === displayItem.cveOperRamoDetalles
    );
    if (index === -1) return;

    const estaActivo       = detallesProporcionalesTable.value[index]!.detalleActivo;
    const activosRestantes = detallesProporcionalesTable.value.filter(
      (r, i) => i !== index && r.detalleActivo
    ).length;

    if (estaActivo && activosRestantes === 0) {
      dialog.show({
        title: "Atención",
        message: "Debe haber al menos una fila activa.",
        type: DialogType.ERROR,
      });
      return;
    }

    detallesProporcionalesTable.value[index]!.detalleActivo = !estaActivo;
  };

  //  Headers 
  const hp = { style: "font-weight: bold" };

  const detallesProporcionalesTableHeaders = [
    { title: "TIPO OPERACIÓN / RAMO",        key: "descExtCoberDetalles",            sortable: true,  headerProps: hp },
    { title: "OPERACIÓN / RAMO (DETALLADA)", key: "descOperRamoDetalles",            sortable: true,  headerProps: hp },
    { title: "% RETENCIÓN",                  key: "porcentajeRetencion",             sortable: true,  headerProps: hp },
    { title: "% CESIÓN",                     key: "porcentajeCesion",                sortable: true,  headerProps: hp },
    { title: "MONTO RETENCIÓN",              key: "montoRetencionFormatted",         sortable: true,  headerProps: hp },
    { title: "MONTO CESIÓN",                 key: "montoCesionFormatted",            sortable: true,  headerProps: hp },
    { title: "CAPACIDAD DE CONTRATO",        key: "capacidadContratoFormatted",      sortable: true,  headerProps: hp },
    { title: "CRITERIO DE CAPACIDAD",        key: "descCriterioAsigCapacidad",       sortable: true,  headerProps: hp },
    { title: "DISTRIBUCIÓN CESIÓN",          key: "descDistrCesion",                 sortable: true,  headerProps: hp },
    { title: "MONEDA DETALLES",              key: "descMonedaDetalles",              sortable: true,  headerProps: hp },
    { title: "¿CÚMULOS?",                    key: "cumulos",                         sortable: true,  headerProps: hp },
    { title: "ACTIVO",                       key: "detalleActivo",                   sortable: true,  headerProps: hp },
    { title: "ACCIONES",                     key: "actions",                         sortable: false, headerProps: hp },
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
    montoCesion,
    capacidadContrato,
    onInputGeneric,
    onBlurGeneric,
    queryCriterioAsignacion,
    queryDistribucionCesion,
    queryMoneda,
    detallesProporcionalesTableDisplay,
    detallesProporcionalesTableHeaders,
    sendDataToTable,
    editRow,
    toggleActive,
    isDetallesOperacionRamoDisabled,
    porcentajeRetencionSlider,
  };
};