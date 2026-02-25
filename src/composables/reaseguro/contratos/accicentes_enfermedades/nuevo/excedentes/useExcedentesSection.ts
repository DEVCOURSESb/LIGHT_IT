import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { formattNumber } from "@/utils/formattNumber";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useExcedentesValidations } from "./useExcedentesValidations ";

interface ExcedenteForm {
  cveCriterioAsigCapa: number | null;
  cveCobayeCapa: number | null;
  retencionCapa: number | null;
  cesionCapa: number | null;
}

interface ExcedenteRow extends ExcedenteForm {
  noCapa: number;         
  descCobaye: string;
  capaActiva: boolean;    
}

export const useExcedentesSection = () => {
  const aeStore = useContratoAEStore();
  const dialog = useDialog();

  const { queryCriterioAsignacion, queryCoberturasAyE } =
    useAccidentesEnfermedades();
 
  const dataTable = ref<ExcedenteRow[]>(aeStore.recuperarExcedentes());
  
  const retencionCapa = ref("");
  const cesionCapa = ref("");

  const formatNumberRefs: Record<string, typeof retencionCapa> = {
    retencionCapa,
    cesionCapa,
  };
  
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
      cveCriterioAsigCapa: 1, 
      cveCobayeCapa: null,
      retencionCapa: null,
      cesionCapa: null,
    },
  });

  const showErrors = ref(false);
  
  const criterioFijo = computed(() => {
    const activos = dataTable.value.filter((r) => r.capaActiva);
    return activos.length > 0 ? activos[0]!.cveCriterioAsigCapa : null;
  });

  const criterioEstaFijo = computed(() => criterioFijo.value != null);
  
  const calcularNoCapa = (cveCriterio: number | null, cveCobaye: number | null): number => {
    if (cveCriterio === 1) {
      
      return dataTable.value.length + 1;
    } else {
      
      const registrosMismaCobertura = dataTable.value.filter(
        (r) => r.cveCobayeCapa === cveCobaye
      );
      return registrosMismaCobertura.length + 1;
    }
  };
  
  watch(
    () => formData.cveCriterioAsigCapa,
    () => {
      setFieldValue("cveCobayeCapa", null);
    }
  );
  
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

  const resetFormAndRefs = () => {
    const criterioActual = criterioFijo.value ?? formData.cveCriterioAsigCapa;
    resetForm();
    setFieldValue("cveCriterioAsigCapa", criterioActual);
    retencionCapa.value = "";
    cesionCapa.value = "";
    showErrors.value = false;
  };
  
  const getDescCobaye = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      (queryCoberturasAyE.data.value ?? []).find((c) => c.cveCobaye === cve)
        ?.descCobaye ?? ""
    );
  };

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

  const toggleRowActiva = (item: ExcedenteRow) => {
    const index = dataTable.value.indexOf(item);
    if (index !== -1) {
      dataTable.value[index]!.capaActiva = !dataTable.value[index]!.capaActiva;
    }
  };

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
    aeStore.guardarExcedentes(dataTable.value);
    dialog.cerrar();
  };

  const headerProps = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "No. Capa",        key: "noCapa",        sortable: true,  headerProps },
    { title: "Cobertura",       key: "descCobaye",    sortable: true,  headerProps },
    { title: "Retención capa",  key: "retencionCapa", sortable: true,  headerProps },
    { title: "Cesión capa",     key: "cesionCapa",    sortable: true,  headerProps },
    { title: "Activa",          key: "capaActiva",    sortable: true,  headerProps },
    { title: "Editar",          key: "editar",        sortable: false, headerProps },
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
  };
};