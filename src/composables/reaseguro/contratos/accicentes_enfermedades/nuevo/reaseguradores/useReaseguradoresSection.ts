import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { useReaseguradoresSectionValidations } from "./useReaseguradoresSectionValidations";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { formattNumber } from "@/utils/formattNumber";
import { formatCurrency } from "@/utils/formatCurrency";

export const useReaseguradoresSection = () => {
  const aeStore = useContratoAEStore();
  const { isTypeProporcional } = storeToRefs(aeStore);

  const { queryReaseguradoras } = useAccidentesEnfermedades();
  const participacion = ref("");

  const {
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
    resetForm,
  } = useForm({
    validationSchema: useReaseguradoresSectionValidations(),
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

  const handleSubmit = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (valid) {
      console.log(formData);
    }
  };

  return {
    queryReaseguradoras,
    participacion,
    setFieldValue,
    formData,
    formErrors,
    showErrors,
    handleSubmit,
    onInput,
    onBlur,
  };
};
