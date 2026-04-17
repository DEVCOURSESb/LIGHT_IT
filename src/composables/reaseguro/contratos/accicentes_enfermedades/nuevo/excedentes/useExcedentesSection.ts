import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formattNumber } from "@/utils/formatters/formattNumber";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { useExcedentesValidations } from "./useExcedentesValidations ";
import type { ExcedentesSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";
import type { coberturasAye } from "@/API/catalogos/coberturas_aye/coberturas_aye.interfaces";

// Tipo del formulario — sin idContrato, noCapa y capaActiva (los calcula/agrega el composable)
type ExcedentesForm = Omit<ExcedentesSection, "idContrato" | "noCapa" | "capaActiva">;

// Tipo display — extiende la interfaz con el campo calculado para la tabla
type ExcedentesDisplay = ExcedentesSection & {
  descCobaye: string;
};

export const useExcedentesSection = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const { excedentes, coberturas } = storeToRefs(aeStore);

  const { queryCriterioAsignacion, queryCoberturasAyE } = useAccidentesEnfermedades();

  // Tabla base mutable
  const originalDataTable = ref<ExcedentesSection[]>([...excedentes.value]);

  // Computed display — agrega descCobaye, es solo lectura
  const dataTable = computed<ExcedentesDisplay[]>(() =>
    originalDataTable.value.map((row) => ({
      ...row,
      descCobaye: getDescCobaye(row.cveCobayeCapa),
    }))
  );

  // Refs numéricos
  const retencionCapa = ref("");
  const cesionCapa    = ref("");

  const formatNumberRefs: Record<string, typeof retencionCapa> = {
    retencionCapa,
    cesionCapa,
  };

  // Formulario
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<ExcedentesForm>({
    validationSchema: useExcedentesValidations(),
    validateOnMount: false,
    initialValues: {
      cveCriterioAsigCapa: 1,
    },
  });

  const showErrors = ref(false);

  // Criterio fijo mientras haya registros activos
  const criterioFijo = computed<number | null>(() =>
    originalDataTable.value.find((r) => r.capaActiva)?.cveCriterioAsigCapa ?? null
  );

  const criterioEstaFijo = computed(() => criterioFijo.value != null);

  // noCapa automático según criterio
  const calcularNoCapa = (
    cveCriterio: number | null,
    cveCobaye: number | null
  ): number => {
    if (cveCriterio === 1) {
      // POR CONTRATO: secuencial global
      return originalDataTable.value.length + 1;
    }
    // POR COBERTURA: secuencial por cobertura
    return (
      originalDataTable.value.filter((r) => r.cveCobayeCapa === cveCobaye).length + 1
    );
  };

  const coberturasDisponibles = ref<coberturasAye[]>();

    watch( [
      coberturas,
      () => queryCoberturasAyE.data.value,
      () => queryCoberturasAyE.isLoading.value,
    ], 
    ([coberturas, _,  isLoading]) => {

      if(coberturas == null || isLoading) return;

      const coberturasCVES = coberturas.map( row => row.cveCobaye );

      console.log(coberturasCVES)
      console.log(queryCoberturasAyE.data.value)
      
      coberturasDisponibles.value = queryCoberturasAyE.data.value?.filter( row => coberturasCVES.includes(row.cveCobaye) ? row : null );
    }
   );

  // Watch: limpiar cveCobayeCapa al cambiar criterio
  watch(
    () => formData.cveCriterioAsigCapa,
    () => { setFieldValue("cveCobayeCapa", null); }
  );

  // Handlers genéricos numéricos
  const onInputGeneric = (key: string, value: string) => {
    const clean    = formattNumber(value);
    const fieldRef = formatNumberRefs[key];
    if (fieldRef) {
      fieldRef.value = clean;
      setFieldValue(
        key as keyof ExcedentesForm,
        clean === "" ? null : parseFloat(clean)
      );
    }
  };

  const onBlurGeneric = (key: string) => {
    const fieldRef = formatNumberRefs[key];
    if (!fieldRef?.value) {
      setFieldValue(key as keyof ExcedentesForm, null);
      return;
    }
    const numeric = parseFloat(fieldRef.value);
    if (isNaN(numeric)) {
      fieldRef.value = "";
      setFieldValue(key as keyof ExcedentesForm, null);
      return;
    }
    setFieldValue(key as keyof ExcedentesForm, numeric);
    fieldRef.value = formatCurrency(numeric);
  };

  // Reset
  const resetFormAndRefs = () => {
    const criterioActual = criterioFijo.value ?? formData.cveCriterioAsigCapa;
    resetForm();
    setFieldValue("cveCriterioAsigCapa", criterioActual);
    retencionCapa.value = "";
    cesionCapa.value    = "";
    showErrors.value    = false;
  };

  // Helper descripción
  const getDescCobaye = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      queryCoberturasAyE.data.value?.find((c) => c.cveCobaye === cve)?.descCobaye ?? ""
    );
  };

  // Agregar excedente
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

    const newRow: ExcedentesSection = {
      idContrato:          "",
      cveCriterioAsigCapa: formData.cveCriterioAsigCapa!,
      cveCobayeCapa:       formData.cveCobayeCapa ?? null,
      noCapa:              calcularNoCapa(formData.cveCriterioAsigCapa, formData.cveCobayeCapa),
      retencionCapa:       formData.retencionCapa ?? 0,
      cesionCapa:          formData.cesionCapa ?? 0,
      capaActiva:          true,
    };

    originalDataTable.value.push(newRow);
    resetFormAndRefs();
  };

  // Toggle activo
  // Busca en originalDataTable por clave compuesta (criterio + cobertura + noCapa)
  const toggleRowActiva = (item: ExcedentesDisplay) => {
    const index = originalDataTable.value.findIndex(
      (r) =>
        r.cveCriterioAsigCapa === item.cveCriterioAsigCapa &&
        r.cveCobayeCapa       === item.cveCobayeCapa &&
        r.noCapa              === item.noCapa
    );
    if (index !== -1) {
      originalDataTable.value[index]!.capaActiva =
        !originalDataTable.value[index]!.capaActiva;
    }
  };

  // Editar fila
  const editRow = (item: ExcedentesDisplay) => {
    const index = originalDataTable.value.findIndex(
      (r) =>
        r.cveCriterioAsigCapa === item.cveCriterioAsigCapa &&
        r.cveCobayeCapa       === item.cveCobayeCapa &&
        r.noCapa              === item.noCapa
    );
    if (index === -1) return;

    const row = originalDataTable.value[index]!;

    setFieldValue("cveCriterioAsigCapa", row.cveCriterioAsigCapa);
    setFieldValue("cveCobayeCapa",       row.cveCobayeCapa);
    setFieldValue("retencionCapa",       row.retencionCapa);
    setFieldValue("cesionCapa",          row.cesionCapa);

    retencionCapa.value = row.retencionCapa ? formatCurrency(row.retencionCapa) : "";
    cesionCapa.value    = row.cesionCapa    ? formatCurrency(row.cesionCapa)    : "";

    originalDataTable.value.splice(index, 1);
    showErrors.value = false;
  };

  // Guardar
  const handleGuardarExcedente = () => {
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
    aeStore.guardarExcedentes(originalDataTable.value);
    dialog.cerrar();
  };

  // Headers
  const hp = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "NO. CAPA",       key: "noCapa",        sortable: true,  headerProps: hp },
    { title: "COBERTURA",      key: "descCobaye",    sortable: true,  headerProps: hp },
    { title: "RETENCIÓN CAPA", key: "retencionCapa", sortable: true,  headerProps: hp },
    { title: "CESIÓN CAPA",    key: "cesionCapa",    sortable: true,  headerProps: hp },
    { title: "ACTIVA",         key: "capaActiva",    sortable: true,  headerProps: hp },
    { title: "EDITAR",         key: "editar",        sortable: false, headerProps: hp },
  ];

  return {
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    retencionCapa,
    cesionCapa,
    onInputGeneric,
    onBlurGeneric,
    queryCriterioAsignacion,
    queryCoberturasAyE,
    tableHeaders,
    dataTable,
    criterioEstaFijo,
    handleAgregarExcedente,
    handleGuardarExcedente,
    toggleRowActiva,
    editRow,
    coberturasDisponibles
  };
};