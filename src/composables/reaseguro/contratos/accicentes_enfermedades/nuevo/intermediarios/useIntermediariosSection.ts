import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "@/utils/formatCurrency";
import { formattNumber } from "@/utils/formattNumber";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useIntermediariosValidations } from "./useIntermediariosValidations";
import type { IntermediarioSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

// Tipo del formulario — sin idContrato e interActivo
type IntermediariosForm = Omit<IntermediarioSection, "idContrato" | "interActivo">;

// Tipo display — extiende la interfaz con campos calculados para la tabla
type IntermediariosDisplay = IntermediarioSection & {
  nombreReasegurador: string;
  nombreIntermediario: string;
};

export const useIntermediariosSection = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const { intermediarios, reaseguradores } = storeToRefs(aeStore);

  const {
    queryReaseguradoras,
    queryIntermediarios,
    queryCriterioAsignacion,
    queryTipoAsignacion,
    queryLimCorretaje: queryLimiteCorretaje,
  } = useAccidentesEnfermedades();

  // Tabla base mutable
  const originalDataTable = ref<IntermediarioSection[]>([...intermediarios.value]);

  // Computed display
  const dataTable = computed<IntermediariosDisplay[]>(() =>
    originalDataTable.value.map((row) => ({
      ...row,
      nombreReasegurador:  getNombreReasegurador(row.cveReaseguradorIntermediario),
      nombreIntermediario: getNombreIntermediario(row.cveIntermediario),
    }))
  );

  // Refs numéricos (formateo visual)
  const porcentajeCorretajeFijo          = ref("");
  const montoCorretajeFijo               = ref("");
  const porcentajeCorretajeProvisional   = ref("");
  const montoCorretajeProvisional        = ref("");

  const formatNumberRefs: Record<string, typeof porcentajeCorretajeFijo> = {
    porcentajeCorretajeFijo,
    montoCorretajeFijo,
    porcentajeCorretajeProvisional,
    montoCorretajeProvisional,
  };

  // Formulario
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<IntermediariosForm>({
    validationSchema: useIntermediariosValidations(),
    validateOnMount: false,
    initialValues: {
      intermediario:                  0,    // 0=NO | 1=SI
      cveCriterioAsigIntermediario:   null,
      cveReaseguradorIntermediario:   null,
      cveIntermediario:               null,
      corretaje:                      0,    // 0=NO | 1=SI
      cveAsignacionCorretaje:         null,
      porcentajeCorretajeFijo:        null,
      montoCorretajeFijo:             null,
      cveLimCorretaje:                null,
      porcentajeCorretajeProvisional: null,
      montoCorretajeProvisional:      null,
    },
  });

  const showErrors = ref(false);

  // Criterio fijo mientras haya registros activos
  const criterioFijo = computed<number | null>(() =>
    originalDataTable.value.find((r) => r.interActivo)?.cveCriterioAsigIntermediario ?? null
  );
  const criterioEstaFijo = computed(() => criterioFijo.value != null);

  // Visibilidad condicional
  const intermediarioSI     = computed(() => formData.intermediario === 1);
  const corretajeSI         = computed(() => formData.corretaje === 1);
  const criterio            = computed(() => formData.cveCriterioAsigIntermediario);
  const tipoCorretaje       = computed(() => formData.cveAsignacionCorretaje);

  // Reasegurador visible solo cuando criterio = 0 (POR REASEGURADORA)
  const showReasegurador    = computed(() => intermediarioSI.value && criterio.value === 0);

  // Campos de corretaje según tipo
  // Fijo (0): porcentajeCorretajeFijo + montoCorretajeFijo (mutuamente excluyentes)
  const showCorretajeFijo   = computed(() => corretajeSI.value && tipoCorretaje.value === 0);
  // Provisional (1=VARIABLE | 2=ESCALONADA): porcentajeCorretajeProvisional + montoCorretajeProvisional
  const showCorretajeProvisional = computed(() => corretajeSI.value && [1, 2].includes(tipoCorretaje.value ?? -1));
  // Fórmula límite solo cuando tipo = 1 (VARIABLE)
  const showLimCorretaje    = computed(() => corretajeSI.value && tipoCorretaje.value === 1);

  // Reaseguradoras del contrato (filtradas)
  const reaseguradoraData = computed(() => {
    const cvesContrato = reaseguradores.value.map((r) => r.cveReasegurador);
    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesContrato.includes(r.cveReasegurador)
    );
  });

  // Validación: límite de registros
  // criterio = 1 (POR CONTRATO): máximo un registro
  // criterio = 0 (POR REASEGURADORA): uno por reasegurador
  const puedeAgregar = (): true | string => {
    const crit = formData.cveCriterioAsigIntermediario;
    if (crit === 1 && originalDataTable.value.some((r) => r.cveCriterioAsigIntermediario === 1)) {
      return "Solo se permite un intermediario por contrato cuando el criterio es POR CONTRATO.";
    }
    if (crit === 0) {
      const cveReaseg = formData.cveReaseguradorIntermediario;
      if (
        cveReaseg != null &&
        originalDataTable.value.some((r) => r.cveReaseguradorIntermediario === cveReaseg)
      ) {
        return "Ya existe un registro para esta reaseguradora.";
      }
    }
    return true;
  };

  // Watches de limpieza
  watch(
    () => formData.intermediario,
    (val) => {
      if (val === 0) {
        setFieldValue("cveCriterioAsigIntermediario",   null);
        setFieldValue("cveReaseguradorIntermediario",   null);
        setFieldValue("cveIntermediario",               null);
        setFieldValue("corretaje",                      0);
        setFieldValue("cveAsignacionCorretaje",         null);
        _limpiarCorretaje();
      } else {
        setFieldValue("cveCriterioAsigIntermediario", criterioFijo.value ?? 1);
      }
    }
  );

  watch(
    () => formData.cveCriterioAsigIntermediario,
    () => { setFieldValue("cveReaseguradorIntermediario", null); }
  );

  watch(
    () => formData.corretaje,
    (val) => {
      if (val === 0) {
        setFieldValue("cveAsignacionCorretaje", null);
        _limpiarCorretaje();
      }
    }
  );

  watch(
    () => formData.cveAsignacionCorretaje,
    () => { _limpiarCorretaje(); }
  );

  // Mutuamente excluyentes: al escribir en uno, limpiar el otro
  watch(
    () => formData.porcentajeCorretajeFijo,
    (val) => {
      if (val != null) {
        setFieldValue("montoCorretajeFijo", null);
        montoCorretajeFijo.value = "";
      }
    }
  );

  watch(
    () => formData.montoCorretajeFijo,
    (val) => {
      if (val != null) {
        setFieldValue("porcentajeCorretajeFijo", null);
        porcentajeCorretajeFijo.value = "";
      }
    }
  );

  watch(
    () => formData.porcentajeCorretajeProvisional,
    (val) => {
      if (val != null) {
        setFieldValue("montoCorretajeProvisional", null);
        montoCorretajeProvisional.value = "";
      }
    }
  );

  watch(
    () => formData.montoCorretajeProvisional,
    (val) => {
      if (val != null) {
        setFieldValue("porcentajeCorretajeProvisional", null);
        porcentajeCorretajeProvisional.value = "";
      }
    }
  );

  const _limpiarCorretaje = () => {
    setFieldValue("porcentajeCorretajeFijo",        null);
    setFieldValue("montoCorretajeFijo",             null);
    setFieldValue("cveLimCorretaje",                null);
    setFieldValue("porcentajeCorretajeProvisional", null);
    setFieldValue("montoCorretajeProvisional",      null);
    porcentajeCorretajeFijo.value        = "";
    montoCorretajeFijo.value             = "";
    porcentajeCorretajeProvisional.value = "";
    montoCorretajeProvisional.value      = "";
  };

  // Handlers genéricos numéricos
  const onInputGeneric = (key: string, value: string) => {
    const clean    = formattNumber(value);
    const fieldRef = formatNumberRefs[key];
    if (fieldRef) {
      fieldRef.value = clean;
      setFieldValue(
        key as keyof IntermediariosForm,
        clean === "" ? null : parseFloat(clean)
      );
    }
  };

  const onBlurGeneric = (key: string) => {
    const fieldRef = formatNumberRefs[key];
    if (!fieldRef?.value) {
      setFieldValue(key as keyof IntermediariosForm, null);
      return;
    }
    const numeric = parseFloat(fieldRef.value);
    if (isNaN(numeric)) {
      fieldRef.value = "";
      setFieldValue(key as keyof IntermediariosForm, null);
      return;
    }
    setFieldValue(key as keyof IntermediariosForm, numeric);
    // Porcentajes: 4 decimales; montos: formatCurrency
    const isPorcentaje = key.startsWith("porcentaje");
    fieldRef.value = isPorcentaje ? numeric.toFixed(4) : formatCurrency(numeric);
  };

  // Reset
  const resetFormAndRefs = () => {
    const criterioActual      = criterioFijo.value ?? formData.cveCriterioAsigIntermediario;
    const intermediarioActual = formData.intermediario;
    resetForm();
    setFieldValue("intermediario",                intermediarioActual);
    setFieldValue("cveCriterioAsigIntermediario", criterioActual);
    setFieldValue("corretaje",                    0);
    porcentajeCorretajeFijo.value        = "";
    montoCorretajeFijo.value             = "";
    porcentajeCorretajeProvisional.value = "";
    montoCorretajeProvisional.value      = "";
    showErrors.value = false;
  };

  // Helpers de descripción
  const getNombreReasegurador = (cve: number | null): string =>
    queryReaseguradoras.data.value?.find((r) => r.cveReasegurador === cve)
      ?.nombreReasegurador ?? "";

  const getNombreIntermediario = (cve: number | null): string =>
    (queryIntermediarios?.data.value ?? []).find((i: any) => i.cveIntermediario === cve)
      ?.nombreIntermediario ?? "";

  // Agregar intermediario
  const handleAgregarIntermediario = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar al intermediario?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: confirmAgregarIntermediario,
      },
    });
  };

  const confirmAgregarIntermediario = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    const limiteCheck = puedeAgregar();
    if (limiteCheck !== true) {
      dialog.show({ title: "Atención", message: limiteCheck, type: DialogType.ERROR });
      return;
    }

    const newRow: IntermediarioSection = {
      idContrato:                     aeStore.generales.idContrato,
      intermediario:                  formData.intermediario,
      cveCriterioAsigIntermediario:   formData.cveCriterioAsigIntermediario,
      cveReaseguradorIntermediario:   formData.cveReaseguradorIntermediario ?? null,
      cveIntermediario:               formData.cveIntermediario ?? null,
      corretaje:                      formData.corretaje,
      cveAsignacionCorretaje:         formData.cveAsignacionCorretaje ?? null,
      porcentajeCorretajeFijo:        formData.porcentajeCorretajeFijo ?? null,
      montoCorretajeFijo:             formData.montoCorretajeFijo ?? null,
      cveLimCorretaje:                formData.cveLimCorretaje ?? null,
      porcentajeCorretajeProvisional: formData.porcentajeCorretajeProvisional ?? null,
      montoCorretajeProvisional:      formData.montoCorretajeProvisional ?? null,
      interActivo:                    true,
    };

    originalDataTable.value.push(newRow);
    resetFormAndRefs();
  };

  // Toggle activo
  const toggleRowActiva = (item: IntermediariosDisplay) => {
    const index = _findIndex(item);
    if (index !== -1) {
      originalDataTable.value[index]!.interActivo =
        !originalDataTable.value[index]!.interActivo;
    }
  };

  // Editar fila
  const editRow = (item: IntermediariosDisplay) => {
    const index = _findIndex(item);
    if (index === -1) return;

    const row = originalDataTable.value[index]!;

    setFieldValue("intermediario",                  row.intermediario);
    setFieldValue("cveCriterioAsigIntermediario",   row.cveCriterioAsigIntermediario);
    setFieldValue("cveReaseguradorIntermediario",   row.cveReaseguradorIntermediario);
    setFieldValue("cveIntermediario",               row.cveIntermediario);
    setFieldValue("corretaje",                      row.corretaje);
    setFieldValue("cveAsignacionCorretaje",         row.cveAsignacionCorretaje);
    setFieldValue("porcentajeCorretajeFijo",        row.porcentajeCorretajeFijo);
    setFieldValue("montoCorretajeFijo",             row.montoCorretajeFijo);
    setFieldValue("cveLimCorretaje",                row.cveLimCorretaje);
    setFieldValue("porcentajeCorretajeProvisional", row.porcentajeCorretajeProvisional);
    setFieldValue("montoCorretajeProvisional",      row.montoCorretajeProvisional);

    porcentajeCorretajeFijo.value        = row.porcentajeCorretajeFijo        != null ? row.porcentajeCorretajeFijo.toFixed(4)        : "";
    montoCorretajeFijo.value             = row.montoCorretajeFijo             != null ? formatCurrency(row.montoCorretajeFijo)         : "";
    porcentajeCorretajeProvisional.value = row.porcentajeCorretajeProvisional != null ? row.porcentajeCorretajeProvisional.toFixed(4) : "";
    montoCorretajeProvisional.value      = row.montoCorretajeProvisional      != null ? formatCurrency(row.montoCorretajeProvisional)  : "";

    originalDataTable.value.splice(index, 1);
    showErrors.value = false;
  };

  // Clave compuesta: criterio + reasegurador + intermediario
  const _findIndex = (item: IntermediarioSection): number =>
    originalDataTable.value.findIndex(
      (r) =>
        r.cveCriterioAsigIntermediario === item.cveCriterioAsigIntermediario &&
        r.cveReaseguradorIntermediario === item.cveReaseguradorIntermediario &&
        r.cveIntermediario             === item.cveIntermediario
    );

  // Guardar
  const handleGuardarIntermediarios = () => {
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
      message: "¿Confirma que los datos ingresados de reaseguradoras del contrato son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: doGuardarIntermediarios,
      },
    });
  };

  const doGuardarIntermediarios = () => {
    aeStore.guardarIntermediarios(originalDataTable.value);
    dialog.cerrar();
  };

  // Headers
  const hp = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "REASEGURADORA",              key: "nombreReasegurador",           sortable: true,  headerProps: hp },
    { title: "INTERMEDIARIO",              key: "nombreIntermediario",          sortable: true,  headerProps: hp },
    { title: "¿CORRETAJE?",                key: "corretaje",                    sortable: true,  headerProps: hp },
    { title: "% CORRETAJE FIJO",           key: "porcentajeCorretajeFijo",      sortable: true,  headerProps: hp },
    { title: "MONTO CORRETAJE FIJO",       key: "montoCorretajeFijo",           sortable: true,  headerProps: hp },
    { title: "% CORRETAJE PROVISIONAL",    key: "porcentajeCorretajeProvisional", sortable: true, headerProps: hp },
    { title: "MONTO CORRETAJE PROVISIONAL",key: "montoCorretajeProvisional",    sortable: true,  headerProps: hp },
    { title: "ACTIVO",                     key: "interActivo",                  sortable: true,  headerProps: hp },
    { title: "EDITAR",                     key: "editar",                       sortable: false, headerProps: hp },
  ];

  return {
    // form
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    // refs numéricos
    porcentajeCorretajeFijo,
    montoCorretajeFijo,
    porcentajeCorretajeProvisional,
    montoCorretajeProvisional,
    onInputGeneric,
    onBlurGeneric,
    // visibilidad condicional
    intermediarioSI,
    corretajeSI,
    showReasegurador,
    showCorretajeFijo,
    showCorretajeProvisional,
    showLimCorretaje,
    criterioEstaFijo,
    // catálogos
    queryCriterioAsignacion,
    queryTipoAsignacion,
    queryLimiteCorretaje,
    queryIntermediarios,
    reaseguradoraData,
    // tabla
    tableHeaders,
    dataTable,
    // acciones
    handleAgregarIntermediario,
    handleGuardarIntermediarios,
    toggleRowActiva,
    editRow,
  };
};