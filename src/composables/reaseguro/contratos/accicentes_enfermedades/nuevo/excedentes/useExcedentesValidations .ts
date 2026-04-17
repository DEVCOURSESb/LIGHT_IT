import { handleValidations } from "@/utils/validations/handleValidations";

export const useExcedentesValidations = () => {
  const val = handleValidations();

  return {
    cveCriterioAsigCapa: (value: number | null) => {
      return (
        (value != null && [1, 4].includes(value)) ||
        "La asignación de capa es obligatoria."
      );
    },

    cveCobayeCapa: (value: number | null, context: any) => {
      const criterio = context.form?.cveCriterioAsigCapa;
      if (criterio === 4) {
        return (
          (value != null && value >= 0) ||
          "La cobertura es obligatoria."
        );
      }
      return true;
    },

    retencionCapa: (value: number | null) => {
      if (value === null || value === undefined)
        return "La retención de capa es obligatoria.";
      return (
        val.minMax(value, 0, 9999999999999999999.99) ||
        "La retención de capa debe ser un número positivo."
      );
    },

    cesionCapa: (value: number | null) => {
      if (value === null || value === undefined)
        return "La cesión de capa es obligatoria.";
      return (
        val.minMax(value, 0, 9999999999999999999.99) ||
        "La cesión de capa debe ser un número positivo."
      );
    },
  };
};