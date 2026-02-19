import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { useReaseguradoresSectionValidations } from "./useReaseguradoresSectionValidations";
import { useForm } from "vee-validate";
import { ref, watch, type Ref } from "vue";
import { formattNumber } from "@/utils/formattNumber";
import { formatCurrency } from "@/utils/formatCurrency";

interface FormatNumberOptions {
  [key: string]: Ref<string>;
}

export const useReaseguradoresSection = () => {
  const aeStore = useContratoAEStore();
  const { isTypeProporcional } = storeToRefs(aeStore);

  const {
    queryReaseguradoras,
    queryPtu,
    queryTipoAsignacion,
    queryCalculoComision,
    queryCriterioAsignacion,
  } = useAccidentesEnfermedades();

  const participacion = ref("");
  const porcentajePtu = ref("");
  const porcentajeK = ref("");
  const gastos = ref("");
  const comisRolFija = ref("");
  const comisRolProvisional = ref("");
  const comisRolMin = ref("");
  const comisRolMax = ref("");
  const prioridad = ref("");
  const limResponsabilidad = ref("");
  const limAgregado = ref("");
  const costoFijo = ref("");
  const pmd = ref("");
  const primaMin = ref("");
  const primaMax = ref("");
  const noClaims = ref("");

  const formatNumberOptions: FormatNumberOptions = {
    participacion,
    porcentajePtu,
    porcentajeK,
    gastos,
    comisRolFija,
    comisRolProvisional,
    comisRolMin,
    comisRolMax,
    prioridad,
    limResponsabilidad,
    limAgregado,
    costoFijo,
    pmd,
    primaMin,
    primaMax,
    noClaims,
  };

  const {
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
    resetForm,
  } = useForm({
    validationSchema: useReaseguradoresSectionValidations({
      isTypeProporcional: isTypeProporcional.value,
    }),
    validateOnMount: false,
  });

  const showErrors = ref(false);

  const onInputGeneric = (key: string, value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    const option = formatNumberOptions[key];

    if (option) {
      // actualiza el valor del campo correspondiente
      option.value = clean;
      // Actualizar el formulario con el número sin formato
      const numericValue = clean === "" ? null : parseFloat(clean);
      setFieldValue(key, numericValue);
    }
  };

  const onBlurGeneric = (key: string) => {
    const option = formatNumberOptions[key];
    if (!option?.value || option?.value === "") {
      setFieldValue(key, null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(option.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      option.value = "";
      setFieldValue(key, null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue(key, numericValue);

    // Formatear para visualización con comas y dos decimales
    option.value = formatCurrency(numericValue);
  };

  watch(
    () => participacion.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        participacion.value = "0";
      } else if (Number(newValue) > 100) {
        participacion.value = "100";
      }
    },
  );

  watch(
    () => porcentajePtu.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        porcentajePtu.value = "0";
      } else if (Number(newValue) > 100) {
        porcentajePtu.value = "100";
      }
    },
  );

  watch(
    () => porcentajeK.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        porcentajeK.value = "0";
      } else if (Number(newValue) > 100) {
        porcentajeK.value = "100";
      }
    },
  );

  watch(
    () => gastos.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        gastos.value = "0";
      } else if (Number(newValue) > 100) {
        gastos.value = "100";
      }
    },
  );

  watch(
    () => comisRolFija.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        comisRolFija.value = "0";
      } else if (Number(newValue) > 100) {
        comisRolFija.value = "100";
      }
    },
  );

  watch(
    () => comisRolProvisional.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        comisRolProvisional.value = "0";
      } else if (Number(newValue) > 100) {
        comisRolProvisional.value = "100";
      }
    },
  );

  watch(
    () => comisRolMin.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        comisRolMin.value = "0";
      } else if (Number(newValue) > 100) {
        comisRolMin.value = "100";
      }
    },
  );

  watch(
    () => comisRolMax.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        comisRolMax.value = "0";
      } else if (Number(newValue) > 100) {
        comisRolMax.value = "100";
      }
    },
  );

  watch(
    () => noClaims.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        noClaims.value = "0";
      } else if (Number(newValue) > 100) {
        noClaims.value = "100";
      }
    },
  );

  const handleSubmit = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (valid) {
      console.log(formData);
    }
  };

  return {
    queryReaseguradoras,
    queryPtu,
    queryTipoAsignacion,
    queryCalculoComision,
    queryCriterioAsignacion,
    participacion,
    porcentajePtu,
    setFieldValue,
    formData,
    formErrors,
    showErrors,
    handleSubmit,
    onInputGeneric,
    onBlurGeneric,
    isTypeProporcional,
    porcentajeK,
    gastos,
    comisRolFija,
    comisRolProvisional,
    comisRolMin,
    comisRolMax,
    prioridad,
    limResponsabilidad,
    limAgregado,
    costoFijo,
    pmd,
    primaMin,
    primaMax,
    noClaims,
  };
};
