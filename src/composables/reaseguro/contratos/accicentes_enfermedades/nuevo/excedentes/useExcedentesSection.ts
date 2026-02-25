import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { formattNumber } from "@/utils/formattNumber";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useExcedentesValidations } from "./useExcedentesValidations ";

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

interface ExcedenteForm {
  cveCriterioAsigCapa: number | null;
  cveCobayeCapa: number | null;
  retencionCapa: number | null;
  cesionCapa: number | null;
}

interface ExcedenteRow extends ExcedenteForm {
  noCapa: number;         // asignado automáticamente
  descCobaye: string;
  capaActiva: boolean;    // true = 1 ACTIVO | false = 2 INACTIVO
}

// ─────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────

export const useExcedentesSection = () => {
  const aeStore = useContratoAEStore();
  const dialog = useDialog();

  const { queryCriterioAsignacion, queryCoberturasAyE } =
    useAccidentesEnfermedades();

  // ── Tabla principal ────────────────────────────────────────────────────
  const dataTable = ref<ExcedenteRow[]>([]);

  // ── Refs de campos numéricos (formateo visual) ─────────────────────────
  const retencionCapa = ref("");
  const cesionCapa = ref("");

  const formatNumberRefs: Record<string, typeof retencionCapa> = {
    retencionCapa,
    cesionCapa,
  };

  // ── Formulario ─────────────────────────────────────────────────────────
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<ExcedenteForm>({
    validationSchema: useExcedentesValidations(),
    validateOnMount: false,
    initialValues: {
      cveCriterioAsigCapa: 1, // default: POR CONTRATO
      cveCobayeCapa: null,
      retencionCapa: null,
      cesionCapa: null,
    },
  });

  const showErrors = ref(false);

  // ─────────────────────────────────────────────
  // Criterio fijo (igual que en Coberturas)
  // Se bloquea mientras haya registros activos
  // ─────────────────────────────────────────────
  const criterioFijo = computed(() => {
    const activos = dataTable.value.filter((r) => r.capaActiva);
    return activos.length > 0 ? activos[0]!.cveCriterioAsigCapa : null;
  });

  const criterioEstaFijo = computed(() => criterioFijo.value != null);

  // ─────────────────────────────────────────────
  // Número de capa automático
  // ─────────────────────────────────────────────
  const calcularNoCapa = (cveCriterio: number | null, cveCobaye: number | null): number => {
    if (cveCriterio === 1) {
      // POR CONTRATO → secuencial global
      return dataTable.value.length + 1;
    } else {
      // POR COBERTURA → secuencial por cobertura
      const registrosMismaCobertura = dataTable.value.filter(
        (r) => r.cveCobayeCapa === cveCobaye
      );
      return registrosMismaCobertura.length + 1;
    }
  };

  // ─────────────────────────────────────────────
  // Limpiar cobertura al cambiar criterio
  // ─────────────────────────────────────────────
  watch(
    () => formData.cveCriterioAsigCapa,
    () => {
      setFieldValue("cveCobayeCapa", null);
    }
  );

  // ─────────────────────────────────────────────
  // Helpers de formateo numérico
  // ─────────────────────────────────────────────
  const onInputGeneric = (key: string, value: string) => {
    const clean = formattNumber(value);
    const fieldRef = formatNumberRefs[key];
    if (fieldRef) {
      fieldRef.value = clean;
      setFieldValue(
        key as keyof ExcedenteForm,
        clean === "" ? null : parseFloat(clean)
      );
    }
  };

  const onBlurGeneric = (key: string) => {
    const fieldRef = formatNumberRefs[key];
    if (!fieldRef?.value) {
      setFieldValue(key as keyof ExcedenteForm, null);
      return;
    }
    const numeric = parseFloat(fieldRef.value);
    if (isNaN(numeric)) {
      fieldRef.value = "";
      setFieldValue(key as keyof ExcedenteForm, null);
      return;
    }
    setFieldValue(key as keyof ExcedenteForm, numeric);
    fieldRef.value = formatCurrency(numeric);
  };

  // ─────────────────────────────────────────────
  // Reset
  // ─────────────────────────────────────────────
  const resetFormAndRefs = () => {
    const criterioActual = criterioFijo.value ?? formData.cveCriterioAsigCapa;
    resetForm();
    setFieldValue("cveCriterioAsigCapa", criterioActual);
    retencionCapa.value = "";
    cesionCapa.value = "";
    showErrors.value = false;
  };

  // ─────────────────────────────────────────────
  // Helper descripción de cobertura
  // ─────────────────────────────────────────────
  const getDescCobaye = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      (queryCoberturasAyE.data.value ?? []).find((c) => c.cveCobaye === cve)
        ?.descCobaye ?? ""
    );
  };

  // ─────────────────────────────────────────────
  // Botón "Agregar Excedente"
  // ─────────────────────────────────────────────
  const handleAgregarExcedente = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar el excedente capturado?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: confirmAgregarExcedente,
      },
    });
  };

  const confirmAgregarExcedente = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    const newRow: ExcedenteRow = {
      cveCriterioAsigCapa: formData.cveCriterioAsigCapa,
      cveCobayeCapa: formData.cveCobayeCapa,
      noCapa: calcularNoCapa(formData.cveCriterioAsigCapa, formData.cveCobayeCapa),
      retencionCapa: formData.retencionCapa,
      cesionCapa: formData.cesionCapa,
      descCobaye: getDescCobaye(formData.cveCobayeCapa),
      capaActiva: true,
    };

    dataTable.value.push(newRow);
    resetFormAndRefs();
  };

  // ─────────────────────────────────────────────
  // Toggle activa (individual)
  // ─────────────────────────────────────────────
  const toggleRowActiva = (item: ExcedenteRow) => {
    const index = dataTable.value.indexOf(item);
    if (index !== -1) {
      dataTable.value[index]!.capaActiva = !dataTable.value[index]!.capaActiva;
    }
  };

  // ─────────────────────────────────────────────
  // Editar fila
  // Al editar se recalculará el noCapa al volver a agregar,
  // por eso se elimina de la tabla y se repuebla el form
  // ─────────────────────────────────────────────
  const editRow = (row: ExcedenteRow) => {
    const index = dataTable.value.indexOf(row);
    if (index !== -1) dataTable.value.splice(index, 1);

    setFieldValue("cveCriterioAsigCapa", row.cveCriterioAsigCapa);
    setFieldValue("cveCobayeCapa",       row.cveCobayeCapa);
    setFieldValue("retencionCapa",       row.retencionCapa);
    setFieldValue("cesionCapa",          row.cesionCapa);

    retencionCapa.value = row.retencionCapa != null ? formatCurrency(row.retencionCapa) : "";
    cesionCapa.value    = row.cesionCapa    != null ? formatCurrency(row.cesionCapa)    : "";
  };

  // ─────────────────────────────────────────────
  // Botón "Guardar Excedente"
  // ─────────────────────────────────────────────
  const handleGuardarExcedente = () => {
    if (dataTable.value.length === 0) {
      dialog.show({
        title: "Error",
        message: "La tabla debe contener al menos un registro para continuar. Verifique por favor.",
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que los datos ingresados de excedentes del contrato son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: doGuardarExcedente,
      },
    });
  };

  const doGuardarExcedente = () => {
    const payload = dataTable.value.map((r) => ({
      cveCriterioAsigCapa: r.cveCriterioAsigCapa,
      cveCobayeCapa:       r.cveCobayeCapa,
      noCapa:              r.noCapa,
      retencionCapa:       r.retencionCapa,
      cesionCapa:          r.cesionCapa,
      capaActiva:          r.capaActiva ? 1 : 2,
    }));

    aeStore.guardarExcedentes(payload);
    dialog.cerrar();
  };

  // ─────────────────────────────────────────────
  // Filtros de tabla
  // ─────────────────────────────────────────────
  const filtroCobaye = ref("");
  const filtroNoCapa = ref("");

  const dataTableFiltrada = computed(() =>
    dataTable.value.filter((row) => {
      const matchCobaye =
        !filtroCobaye.value ||
        row.descCobaye.toLowerCase().includes(filtroCobaye.value.toLowerCase());
      const matchNoCapa =
        !filtroNoCapa.value ||
        String(row.noCapa).includes(filtroNoCapa.value);
      return matchCobaye && matchNoCapa;
    })
  );

  const limpiarFiltros = () => {
    filtroCobaye.value = "";
    filtroNoCapa.value = "";
  };

  // ─────────────────────────────────────────────
  // Headers
  // ─────────────────────────────────────────────
  const headerProps = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "No. Capa",        key: "noCapa",        sortable: true,  headerProps },
    { title: "Cobertura",       key: "descCobaye",    sortable: true,  headerProps },
    { title: "Retención capa",  key: "retencionCapa", sortable: true,  headerProps },
    { title: "Cesión capa",     key: "cesionCapa",    sortable: true,  headerProps },
    { title: "Activa",          key: "capaActiva",    sortable: true,  headerProps },
    { title: "Editar",          key: "editar",        sortable: false, headerProps },
  ];

  // ─────────────────────────────────────────────
  // Exposición
  // ─────────────────────────────────────────────
  return {
    // form
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    // campos numéricos
    retencionCapa,
    cesionCapa,
    onInputGeneric,
    onBlurGeneric,
    // opciones
    queryCriterioAsignacion,
    queryCoberturasAyE,
    // tabla
    tableHeaders,
    dataTable,
    dataTableFiltrada,
    // filtros
    filtroCobaye,
    filtroNoCapa,
    limpiarFiltros,
    // estado
    criterioEstaFijo,
    // handlers
    handleAgregarExcedente,
    handleGuardarExcedente,
    toggleRowActiva,
    editRow,
  };
};