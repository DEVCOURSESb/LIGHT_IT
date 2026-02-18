import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { useReaseguradoresSectionValidations } from "./useReaseguradoresSectionValidations";
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { formattNumber } from "@/utils/formattNumber";
import { formatCurrency } from "@/utils/formatCurrency";

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

  const onInput = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    participacion.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("participacion", numericValue);
  };

  const onBlur = () => {
    if (!participacion.value || participacion.value === "") {
      setFieldValue("participacion", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(participacion.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      participacion.value = "";
      setFieldValue("participacion", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("participacion", numericValue);

    // Formatear para visualización con comas y dos decimales
    participacion.value = formatCurrency(numericValue);
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

  const onInputPorcentajePtu = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    porcentajePtu.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("porcentajePtu", numericValue);
  };

  const onBlurPorcentajePtu = () => {
    if (!porcentajePtu.value || porcentajePtu.value === "") {
      setFieldValue("porcentajePtu", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(porcentajePtu.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      porcentajePtu.value = "";
      setFieldValue("porcentajePtu", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("porcentajePtu", numericValue);

    // Formatear para visualización con comas y dos decimales
    porcentajePtu.value = formatCurrency(numericValue);
  };

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

  const onInputPorcentajeK = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    porcentajeK.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("porcentajeK", numericValue);
  };

  const onBlurPorcentajeK = () => {
    if (!porcentajeK.value || porcentajeK.value === "") {
      setFieldValue("porcentajeK", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(porcentajeK.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      porcentajeK.value = "";
      setFieldValue("porcentajeK", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("porcentajeK", numericValue);

    // Formatear para visualización con comas y dos decimales
    porcentajeK.value = formatCurrency(numericValue);
  };

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

  const onInputGastos = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    gastos.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("gastos", numericValue);
  };

  const onBlurGastos = () => {
    if (!gastos.value || gastos.value === "") {
      setFieldValue("gastos", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(gastos.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      gastos.value = "";
      setFieldValue("gastos", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("gastos", numericValue);

    // Formatear para visualización con comas y dos decimales
    gastos.value = formatCurrency(numericValue);
  };

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

  const onInputComisRolFija = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    comisRolFija.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("comisRolFija", numericValue);
  };

  const onBlurComisRolFija = () => {
    if (!comisRolFija.value || comisRolFija.value === "") {
      setFieldValue("comisRolFija", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(comisRolFija.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      comisRolFija.value = "";
      setFieldValue("comisRolFija", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("comisRolFija", numericValue);

    // Formatear para visualización con comas y dos decimales
    comisRolFija.value = formatCurrency(numericValue);
  };

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

  const onInputComisRolProvisional = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    comisRolProvisional.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("comisRolProvisional", numericValue);
  };

  const onBlurcomisRolProvisional = () => {
    if (!comisRolProvisional.value || comisRolProvisional.value === "") {
      setFieldValue("comisRolProvisional", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(comisRolProvisional.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      comisRolProvisional.value = "";
      setFieldValue("comisRolProvisional", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("comisRolProvisional", numericValue);

    // Formatear para visualización con comas y dos decimales
    comisRolProvisional.value = formatCurrency(numericValue);
  };

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

  const onInputComisRolMin = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    comisRolMin.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("comisRolMin", numericValue);
  };

  const onBlurComisRolMin = () => {
    if (!comisRolMin.value || comisRolMin.value === "") {
      setFieldValue("comisRolMin", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(comisRolMin.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      comisRolMin.value = "";
      setFieldValue("comisRolMin", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("comisRolMin", numericValue);

    // Formatear para visualización con comas y dos decimales
    comisRolMin.value = formatCurrency(numericValue);
  };

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

  const onInputComisRolMax = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    comisRolMax.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("comisRolMax", numericValue);
  };

  const onBlurComisRolMax = () => {
    if (!comisRolMax.value || comisRolMax.value === "") {
      setFieldValue("comisRolMax", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(comisRolMax.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      comisRolMax.value = "";
      setFieldValue("comisRolMax", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("comisRolMax", numericValue);

    // Formatear para visualización con comas y dos decimales
    comisRolMax.value = formatCurrency(numericValue);
  };

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

  const onInputPrioridad = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    prioridad.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("prioridad", numericValue);
  };

  const onBlurPrioridad = () => {
    if (!prioridad.value || prioridad.value === "") {
      setFieldValue("prioridad", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(prioridad.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      prioridad.value = "";
      setFieldValue("prioridad", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("prioridad", numericValue);

    // Formatear para visualización con comas y dos decimales
    prioridad.value = formatCurrency(numericValue);
  };

  const onInputLimResponsabilidad = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    limResponsabilidad.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("limResponsabilidad", numericValue);
  };

  const onBlurLimResponsabilidad = () => {
    if (!limResponsabilidad.value || limResponsabilidad.value === "") {
      setFieldValue("limResponsabilidad", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(limResponsabilidad.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      limResponsabilidad.value = "";
      setFieldValue("limResponsabilidad", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("limResponsabilidad", numericValue);

    // Formatear para visualización con comas y dos decimales
    limResponsabilidad.value = formatCurrency(numericValue);
  };

  const onInputLimAgregado = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    limAgregado.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("limAgregado", numericValue);
  };

  const onBlurLimAgregado = () => {
    if (!limAgregado.value || limAgregado.value === "") {
      setFieldValue("limAgregado", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(limAgregado.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      limAgregado.value = "";
      setFieldValue("limAgregado", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("limAgregado", numericValue);

    // Formatear para visualización con comas y dos decimales
    limAgregado.value = formatCurrency(numericValue);
  };

  const onInputCostoFijo = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    costoFijo.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("costoFijo", numericValue);
  };

  const onBlurCostoFijo = () => {
    if (!costoFijo.value || costoFijo.value === "") {
      setFieldValue("costoFijo", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(costoFijo.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      costoFijo.value = "";
      setFieldValue("costoFijo", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("costoFijo", numericValue);

    // Formatear para visualización con comas y dos decimales
    costoFijo.value = formatCurrency(numericValue);
  };

  const onInputPmd = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    pmd.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("pmd", numericValue);
  };

  const onBlurPmd = () => {
    if (!pmd.value || pmd.value === "") {
      setFieldValue("pmd", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(pmd.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      pmd.value = "";
      setFieldValue("pmd", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("pmd", numericValue);

    // Formatear para visualización con comas y dos decimales
    pmd.value = formatCurrency(numericValue);
  };

  const onInputPrimaMin = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    primaMin.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("primaMin", numericValue);
  };

  const onBlurPrimaMin = () => {
    if (!primaMin.value || primaMin.value === "") {
      setFieldValue("primaMin", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(primaMin.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      primaMin.value = "";
      setFieldValue("primaMin", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("primaMin", numericValue);

    // Formatear para visualización con comas y dos decimales
    primaMin.value = formatCurrency(numericValue);
  };

  const onInputPrimaMax = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    primaMax.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("primaMax", numericValue);
  };

  const onBlurPrimaMax = () => {
    if (!primaMax.value || primaMax.value === "") {
      setFieldValue("primaMax", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(primaMax.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      primaMax.value = "";
      setFieldValue("primaMax", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("primaMax", numericValue);

    // Formatear para visualización con comas y dos decimales
    primaMax.value = formatCurrency(numericValue);
  };

  const onInputNoClaims = (value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    noClaims.value = clean;

    // Actualizar el formulario con el número sin formato
    const numericValue = clean === "" ? null : parseFloat(clean);
    setFieldValue("noClaims", numericValue);
  };

  const onBlurNoClaims = () => {
    if (!noClaims.value || noClaims.value === "") {
      setFieldValue("noClaims", null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(noClaims.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      noClaims.value = "";
      setFieldValue("noClaims", null);
      return;
    }

    // Almacenar en el formulario
    setFieldValue("noClaims", numericValue);

    // Formatear para visualización con comas y dos decimales
    noClaims.value = formatCurrency(numericValue);
  };

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
    onInput,
    onBlur,
    isTypeProporcional,
    onInputPorcentajePtu,
    onBlurPorcentajePtu,
    porcentajeK,
    onInputPorcentajeK,
    onBlurPorcentajeK,
    gastos,
    onInputGastos,
    onBlurGastos,
    comisRolFija,
    onInputComisRolFija,
    onBlurComisRolFija,
    comisRolProvisional,
    onInputComisRolProvisional,
    onBlurcomisRolProvisional,
    comisRolMin,
    onInputComisRolMin,
    onBlurComisRolMin,
    comisRolMax,
    onInputComisRolMax,
    onBlurComisRolMax,
    prioridad,
    onInputPrioridad,
    onBlurPrioridad,
    limResponsabilidad,
    onInputLimResponsabilidad,
    onBlurLimResponsabilidad,
    limAgregado,
    onInputLimAgregado,
    onBlurLimAgregado,
    costoFijo, 
    onInputCostoFijo,
    onBlurCostoFijo,
    pmd,
    onInputPmd,
    onBlurPmd,
    primaMin,
    onInputPrimaMin,
    onBlurPrimaMin,
    primaMax,
    onInputPrimaMax,
    onBlurPrimaMax,
    noClaims,
    onInputNoClaims,
    onBlurNoClaims,
  };
};
