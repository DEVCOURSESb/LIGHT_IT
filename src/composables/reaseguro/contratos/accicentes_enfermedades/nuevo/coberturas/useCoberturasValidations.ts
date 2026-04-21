import { handleValidations } from "@/utils/validations/handleValidations";

export const useCoberturasValidations = () => {
  const val = handleValidations();

  return {
    cveCriterioAsigCobertura: (value: number | null) => {
      return (
        (value != null && [0, 1, 3, 6].includes(value)) ||
        "La asignación de coberturas es obligatoria."
      );
    },

    cveReaseguradorCobertura: (value: number | null, context: any) => {
      const criterio = context.form?.cveCriterioAsigCobertura;
      if ([0, 6].includes(criterio)) {
        return (
          (value != null && value >= 0) ||
          "La reaseguradora es obligatoria."
        );
      }
      return true;
    },

    cveOperRamoCobertura: (value: string | null, context: any) => {
      const criterio = context.form?.cveCriterioAsigCobertura;
      if ([3, 6].includes(criterio)) {
        return (
          (value != null && value !== "") ||
          "La operación / ramo es obligatoria."
        );
      }
      return true;
    },

    cveCobAyE: (value: number | null) => {
      return (
        (value != null && value >= 0) ||
        "La cobertura es obligatoria."
      );
    },

    propiaSaMax: (value: number | null) => {
      return (
        val.isFalsyExceptZero(value) ||
        "El campo ¿Propia suma asegurada máxima? es obligatorio."
      );
    },

    saMax: (value: number | null, context: any) => {
      const propiaSaMax = context.form?.propiaSaMax;
      if (propiaSaMax === 1) {
        if (value === null || value === undefined) {
          return "La suma asegurada máxima es obligatoria.";
        }
        return (
          val.minMax(value, 0, 9999999999999999999.99) ||
          "La suma asegurada máxima debe ser un número positivo."
        );
      }
      return true;
    },
  };
};