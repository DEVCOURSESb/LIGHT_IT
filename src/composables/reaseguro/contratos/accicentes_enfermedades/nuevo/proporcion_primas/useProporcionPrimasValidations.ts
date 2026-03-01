import { validationsHandler } from "@/utilities/validations/validationsHandler";

export const useProporcionPrimasValidations = () => {
  const val = validationsHandler();

  return {
    // Criterio de asignación
    cveCriterioAsigPrimaPropor: (value: number | null) => {
      return (
        (value != null && [0, 1, 3, 4, 6, 7, 8, 9].includes(value)) ||
        "La asignación de proporción de prima es obligatoria."
      );
    },

    // Reaseguradora (obligatoria cuando criterio = 0, 6, 7, 9)
    cveReaseguradorPrimaPropor: (value: number | null, context: any) => {
      const criterio = context.form?.cveCriterioAsigPrimaPropor;
      if ([0, 6, 7, 9].includes(criterio)) {
        return (
          (value != null && value >= 0) ||
          "La reaseguradora es obligatoria."
        );
      }
      return true;
    },

    // Operación / ramo (obligatoria cuando criterio = 3, 6, 8, 9)
    cveOperRamoPrimaPropor: (value: string | null, context: any) => {
      const criterio = context.form?.cveCriterioAsigPrimaPropor;
      if ([3, 6, 8, 9].includes(criterio)) {
        return (
          (value != null && value !== "") ||
          "La operación / ramo es obligatoria."
        );
      }
      return true;
    },

    // Cobertura (obligatoria cuando criterio = 4, 7, 8, 9)
    cveCobayePrimaPropor: (value: number | null, context: any) => {
      const criterio = context.form?.cveCriterioAsigPrimaPropor;
      if ([4, 7, 8, 9].includes(criterio)) {
        return (
          (value != null && value >= 0) ||
          "La cobertura es obligatoria."
        );
      }
      return true;
    },

    // Número de días cubiertos (entero positivo, máx 5 dígitos)
    noDiasCubiertos: (value: number | null | undefined) => {
      if (value == null || value === undefined) {
        return "El número de días cubiertos es obligatorio.";
      }
      if (!Number.isInteger(value) || value < 0) {
        return "El número de días cubiertos debe ser un entero positivo.";
      }
      if (value > 99999) {
        return "El número de días cubiertos no puede superar 5 dígitos.";
      }
      return true;
    },

    // % Prima anual (0.00 – 100.00, 2 decimales)
    porcentajePrimaAnual: (value: number | null | undefined) => {
      if (value == null || value === undefined) {
        return "El porcentaje de prima anual es obligatorio.";
      }
      return (
        val.minMax(value, 0, 100) ||
        "El porcentaje de prima anual debe estar entre 0.00 y 100.00."
      );
    },
  };
};
