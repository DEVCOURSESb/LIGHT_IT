import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { useDetallesProporcionalesValidations } from "./useDetallesProporcionalesValidations";
import { ref } from "vue";

export const useDetallesProporcionalesSection = () => {
  const { queryExtensionesCobertura } = useAccidentesEnfermedades();
  const showErrors = ref<boolean>(false);

  const {
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
  } = useForm({
    validationSchema: useDetallesProporcionalesValidations(),
    validateOnMount: false,
  });

  const handleSubmit = async () => {
    showErrors.value = true;

    const { valid } = await validate();

    if (valid) {
      console.log(formData);
    }
  };

  return {
    // formulario
    formData,
    setFieldValue,
    formErrors,
    showErrors,

    handleSubmit,

    // queries utilizadas
    queryExtensionesCobertura,
  };
};
