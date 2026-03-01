import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "@/utils/formatCurrency";
import { formattNumber } from "@/utils/formattNumber";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useReinstalacionesValidations } from "./useReinstalacionesValidations";
import type { ReinstalacionesSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

// Tipo del formulario — sin idContrato, noReinstalacion y reinstalacionActiva
type ReinstalacionesForm = Omit<
  ReinstalacionesSection,
  "idContrato" | "noReinstalacion" | "reinstalacionActiva"
>;

// Tipo display — extiende la interfaz con campos calculados para la tabla
type ReinstalacionesDisplay = ReinstalacionesSection & {
  nombreReasegurador: string;
};

export const useReinstalacionesSection = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const { reinstalaciones, reaseguradores } = storeToRefs(aeStore);

  const { queryReaseguradoras } = useAccidentesEnfermedades();

  //  Tabla base mutable 
  const originalDataTable = ref<ReinstalacionesSection[]>([...reinstalaciones.value]);

  //  Computed display — agrega nombreReasegurador 
  const dataTable = computed<ReinstalacionesDisplay[]>(() =>
    originalDataTable.value.map((row) => ({
      ...row,
      nombreReasegurador: getNombreReasegurador(row.cveReaseguradorReinstalacion),
    }))
  );

  //  Refs numéricos (formateo visual) 
  const cuotaAjuste       = ref("");
  const costoReinstalacion = ref("");
  const montoReinstalado  = ref("");

  const formatNumberRefs: Record<string, typeof cuotaAjuste> = {
    cuotaAjusteReinstalacion: cuotaAjuste,
    costoReinstalacion,
    montoReinstalado,
  };

  //  Formulario 
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<ReinstalacionesForm>({
    validationSchema: useReinstalacionesValidations(),
    validateOnMount: false,
    initialValues: {
      reinstalacion:                0,        // 0=NO | 1=SI
      cveCriterioAsigReinstalacion: null,
      cveReaseguradorReinstalacion: null,
      cuotaAjusteReinstalacion:     null,
      costoReinstalacion:           null,
      montoReinstalado:             null,
    },
  });

  const showErrors = ref(false);

  //  Computed: ¿todos los reaseguradores tienen el mismo cveAsignacionCosto?
  const asignacionCostoHomogenea = computed<boolean>(() => {
    if (reaseguradores.value.length === 0) return true;
    const primero = reaseguradores.value[0]!.cveAsignacionCosto;
    return reaseguradores.value.every((r) => r.cveAsignacionCosto === primero);
  });

  // Si la asignación es mixta, el criterio queda fijo en 0 (POR REASEGURADORA)
  const criterioBloqueado = computed<boolean>(() => !asignacionCostoHomogenea.value);

  // Criterio fijo mientras haya registros activos
  const criterioFijo = computed<number | null>(() =>
    originalDataTable.value.find((r) => r.reinstalacionActiva)?.cveCriterioAsigReinstalacion ?? null
  );

  const criterioEstaFijo = computed(() => criterioFijo.value != null);

  //  Visibilidad / habilitación condicional 

  // El módulo entero solo aplica cuando el contrato es NO PROPORCIONAL
  const moduloHabilitado = computed(() => !aeStore.isTypeProporcional);

  // El resto de campos solo se habilitan cuando reinstalacion = 1 (SI)
  const reinstalacionSI = computed(() => formData.reinstalacion === 1);

  // Reaseguradora solo se muestra cuando criterio = 0 (POR REASEGURADORA)
  const showReasegurador = computed(
    () => reinstalacionSI.value && formData.cveCriterioAsigReinstalacion === 0
  );

  //  Habilitación de cuotaAjuste y costoReinstalacion 
  // Depende de cveCriterioAsig y del cveAsignacionCosto del reasegurador seleccionado

  // Obtener cveAsignacionCosto del reasegurador actualmente seleccionado en el form
  const asignacionCostoSeleccionado = computed<number | null>(() => {
    const cve = formData.cveReaseguradorReinstalacion;
    if (cve == null) return null;
    return reaseguradores.value.find((r) => r.cveReasegurador === cve)?.cveAsignacionCosto ?? null;
  });

  // Todos los reaseguradores del contrato son FIJA (0)
  const todosAsignacionFija = computed<boolean>(() =>
    reaseguradores.value.length > 0 &&
    reaseguradores.value.every((r) => r.cveAsignacionCosto === 0)
  );

  /**
   * cuotaAjuste se habilita cuando:
   * - criterio = 1 (POR CONTRATO) y TODOS los reaseg tienen cveAsignacionCosto = 0 (FIJA)
   * - criterio = 0 (POR REASEGURADORA) y el reaseg seleccionado tiene cveAsignacionCosto = 0 (FIJA)
   */
  const showCuotaAjuste = computed<boolean>(() => {
    if (!reinstalacionSI.value) return false;
    const criterio = formData.cveCriterioAsigReinstalacion;
    if (criterio === 1) return todosAsignacionFija.value;
    if (criterio === 0) return asignacionCostoSeleccionado.value === 0;
    return false;
  });

  /**
   * costoReinstalacion se habilita de forma INVERSA a cuotaAjuste:
   * - criterio = 1 (POR CONTRATO) y NO todos los reaseg tienen cveAsignacionCosto = 0 (FIJA)
   * - criterio = 0 (POR REASEGURADORA) y el reaseg seleccionado tiene cveAsignacionCosto ≠ 0 (VARIABLE)
   */
  const showCostoReinstalacion = computed<boolean>(() => {
    if (!reinstalacionSI.value) return false;
    const criterio = formData.cveCriterioAsigReinstalacion;
    if (criterio === 1) return !todosAsignacionFija.value;
    if (criterio === 0) return asignacionCostoSeleccionado.value !== null && asignacionCostoSeleccionado.value !== 0;
    return false;
  });

  // montoReinstalado siempre se muestra si reinstalacion = SI
  const showMontoReinstalado = computed(() => reinstalacionSI.value);

  //  Reaseguradoras del contrato 
  const reaseguradoraData = computed(() => {
    const cvesContrato = reaseguradores.value.map((r) => r.cveReasegurador);
    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesContrato.includes(r.cveReasegurador)
    );
  });

  //  noReinstalacion automático 
  const calcularNoReinstalacion = (cveReaseg: number | null): number => {
    const criterio = formData.cveCriterioAsigReinstalacion;
    if (criterio === 1) {
      // POR CONTRATO: secuencial global
      return originalDataTable.value.length + 1;
    }
    // POR REASEGURADORA: secuencial por reaseguradora
    return (
      originalDataTable.value.filter(
        (r) => r.cveReaseguradorReinstalacion === cveReaseg
      ).length + 1
    );
  };

  // Preview en tiempo real del noReinstalacion
  const noReinstalacionPreview = computed<number | string>(() => {
    if (!reinstalacionSI.value) return "—";
    const criterio = formData.cveCriterioAsigReinstalacion;
    if (criterio === 1) return originalDataTable.value.length + 1;
    if (criterio === 0) {
      const cve = formData.cveReaseguradorReinstalacion;
      if (!cve) return "—";
      return originalDataTable.value.filter((r) => r.cveReaseguradorReinstalacion === cve).length + 1;
    }
    return "—";
  });

  //  Watches de limpieza 
  watch(
    () => formData.reinstalacion,
    (val) => {
      if (val === 0) {
        setFieldValue("cveCriterioAsigReinstalacion", null);
        setFieldValue("cveReaseguradorReinstalacion", null);
        setFieldValue("cuotaAjusteReinstalacion",     null);
        setFieldValue("costoReinstalacion",           null);
        setFieldValue("montoReinstalado",             null);
        cuotaAjuste.value        = "";
        costoReinstalacion.value = "";
        montoReinstalado.value   = "";
      } else {
        // Al habilitar, asignar criterio default según homogeneidad
        const defaultCriterio = criterioBloqueado.value ? 0 : 1;
        setFieldValue("cveCriterioAsigReinstalacion", defaultCriterio);
      }
    }
  );

  watch(
    () => formData.cveCriterioAsigReinstalacion,
    () => {
      setFieldValue("cveReaseguradorReinstalacion", null);
      setFieldValue("cuotaAjusteReinstalacion",     null);
      setFieldValue("costoReinstalacion",           null);
      cuotaAjuste.value        = "";
      costoReinstalacion.value = "";
    }
  );

  watch(
    () => formData.cveReaseguradorReinstalacion,
    () => {
      setFieldValue("cuotaAjusteReinstalacion", null);
      setFieldValue("costoReinstalacion",       null);
      cuotaAjuste.value        = "";
      costoReinstalacion.value = "";
    }
  );

  //  Handlers genéricos numéricos 
  const onInputGeneric = (key: string, value: string) => {
    const clean    = formattNumber(value);
    const fieldRef = formatNumberRefs[key];
    if (fieldRef) {
      fieldRef.value = clean;
      setFieldValue(
        key as keyof ReinstalacionesForm,
        clean === "" ? null : parseFloat(clean)
      );
    }
  };

  const onBlurGeneric = (key: string) => {
    const fieldRef = formatNumberRefs[key];
    if (!fieldRef?.value) {
      setFieldValue(key as keyof ReinstalacionesForm, null);
      return;
    }
    const numeric = parseFloat(fieldRef.value);
    if (isNaN(numeric)) {
      fieldRef.value = "";
      setFieldValue(key as keyof ReinstalacionesForm, null);
      return;
    }
    setFieldValue(key as keyof ReinstalacionesForm, numeric);
    // cuotaAjuste muestra % con 2 decimales, los demás con formatCurrency
    fieldRef.value =
      key === "cuotaAjusteReinstalacion"
        ? numeric.toFixed(2)
        : formatCurrency(numeric);
  };

  //  Reset 
  const resetFormAndRefs = () => {
    const criterioActual = criterioFijo.value ?? formData.cveCriterioAsigReinstalacion;
    const reinstalacionActual = formData.reinstalacion;
    resetForm();
    setFieldValue("reinstalacion",                reinstalacionActual);
    setFieldValue("cveCriterioAsigReinstalacion", criterioActual);
    cuotaAjuste.value        = "";
    costoReinstalacion.value = "";
    montoReinstalado.value   = "";
    showErrors.value         = false;
  };

  //  Helper descripción 
  const getNombreReasegurador = (cve: number | null): string =>
    queryReaseguradoras.data.value?.find((r) => r.cveReasegurador === cve)
      ?.nombreReasegurador ?? "";

  //  Agregar reinstalación 
  const handleAgregarReinstalacion = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar la reinstalación capturada?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: confirmAgregarReinstalacion,
      },
    });
  };

  const confirmAgregarReinstalacion = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    const newRow: ReinstalacionesSection = {
      idContrato:                   aeStore.generales.idContrato,
      reinstalacion:                formData.reinstalacion,
      cveCriterioAsigReinstalacion: formData.cveCriterioAsigReinstalacion,
      cveReaseguradorReinstalacion: formData.cveReaseguradorReinstalacion ?? null,
      noReinstalacion:              calcularNoReinstalacion(formData.cveReaseguradorReinstalacion),
      cuotaAjusteReinstalacion:     formData.cuotaAjusteReinstalacion ?? null,
      costoReinstalacion:           formData.costoReinstalacion ?? null,
      montoReinstalado:             formData.montoReinstalado ?? null,
      reinstalacionActiva:          true,
    };

    originalDataTable.value.push(newRow);
    resetFormAndRefs();
  };

  //  Toggle activo 
  const toggleRowActiva = (item: ReinstalacionesDisplay) => {
    const index = _findIndex(item);
    if (index !== -1) {
      originalDataTable.value[index]!.reinstalacionActiva =
        !originalDataTable.value[index]!.reinstalacionActiva;
    }
  };

  //  Editar fila 
  const editRow = (item: ReinstalacionesDisplay) => {
    const index = _findIndex(item);
    if (index === -1) return;

    const row = originalDataTable.value[index]!;

    setFieldValue("reinstalacion",                row.reinstalacion);
    setFieldValue("cveCriterioAsigReinstalacion", row.cveCriterioAsigReinstalacion);
    setFieldValue("cveReaseguradorReinstalacion", row.cveReaseguradorReinstalacion);
    setFieldValue("cuotaAjusteReinstalacion",     row.cuotaAjusteReinstalacion);
    setFieldValue("costoReinstalacion",           row.costoReinstalacion);
    setFieldValue("montoReinstalado",             row.montoReinstalado);

    cuotaAjuste.value        = row.cuotaAjusteReinstalacion != null ? row.cuotaAjusteReinstalacion.toFixed(2) : "";
    costoReinstalacion.value = row.costoReinstalacion       != null ? formatCurrency(row.costoReinstalacion)   : "";
    montoReinstalado.value   = row.montoReinstalado         != null ? formatCurrency(row.montoReinstalado)      : "";

    originalDataTable.value.splice(index, 1);
    showErrors.value = false;
  };

  // Clave compuesta: criterio + reaseg + noReinstalacion
  const _findIndex = (item: ReinstalacionesSection): number =>
    originalDataTable.value.findIndex(
      (r) =>
        r.cveCriterioAsigReinstalacion === item.cveCriterioAsigReinstalacion &&
        r.cveReaseguradorReinstalacion === item.cveReaseguradorReinstalacion &&
        r.noReinstalacion              === item.noReinstalacion
    );

  //  Guardar 
  const handleGuardarReinstalaciones = () => {
    if (originalDataTable.value.length === 0) {
      dialog.show({
        title: "Error",
        message: "La tabla debe contener al menos un registro para continuar.",
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que los datos ingresados de reinstalaciones son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: doGuardarReinstalaciones,
      },
    });
  };

  const doGuardarReinstalaciones = () => {
    aeStore.guardarReinstalaciones(originalDataTable.value);
    dialog.cerrar();
  };

  //  Headers 
  const hp = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "Reaseguradora",          key: "nombreReasegurador",        sortable: true,  headerProps: hp },
    { title: "No. Reinstalación",      key: "noReinstalacion",           sortable: true,  headerProps: hp },
    { title: "Cuota de ajuste (%)",    key: "cuotaAjusteReinstalacion",  sortable: true,  headerProps: hp },
    { title: "Costo reinstalación",    key: "costoReinstalacion",        sortable: true,  headerProps: hp },
    { title: "Monto reinstalado",      key: "montoReinstalado",          sortable: true,  headerProps: hp },
    { title: "Activa",                 key: "reinstalacionActiva",       sortable: true,  headerProps: hp },
    { title: "Editar",                 key: "editar",                    sortable: false, headerProps: hp },
  ];

  return {
    // form
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    // refs numéricos
    cuotaAjuste,
    costoReinstalacion,
    montoReinstalado,
    onInputGeneric,
    onBlurGeneric,
    // estado condicional
    moduloHabilitado,
    reinstalacionSI,
    showReasegurador,
    showCuotaAjuste,
    showCostoReinstalacion,
    showMontoReinstalado,
    criterioBloqueado,
    criterioEstaFijo,
    noReinstalacionPreview,
    // catálogos
    reaseguradoraData,
    // tabla
    tableHeaders,
    dataTable,
    // acciones
    handleAgregarReinstalacion,
    handleGuardarReinstalaciones,
    toggleRowActiva,
    editRow,
  };
};