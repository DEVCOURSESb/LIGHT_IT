import { validationsHandler } from "@/utilities/validations/validationsHandler";

export const useTarifasValidations = () => {
  const val = validationsHandler();

  return {
    cveCriterioAsigTarifa: (value: number | null) => {
      return (
        (value != null && [0, 1, 3, 4, 6, 7, 8, 9].includes(value)) ||
        "La asignación de tarifa es obligatoria."
      );
    },

    cveReaseguradorTarifa: (value: number | null, context: any) => {
      const criterio = context.form?.cveCriterioAsigTarifa;
      if ([0, 6, 7, 9].includes(criterio)) {
        return (
          (value != null && value >= 0) ||
          "La reaseguradora es obligatoria."
        );
      }
      return true;
    },

    cveOperRamoTarifa: (value: string | null, context: any) => {
      const criterio = context.form?.cveCriterioAsigTarifa;
      if ([3, 6, 8, 9].includes(criterio)) {
        return (
          (value != null && value !== "") ||
          "La operación / ramo es obligatoria."
        );
      }
      return true;
    },

    cveCobayeTarifa: (value: number | null, context: any) => {
      const criterio = context.form?.cveCriterioAsigTarifa;
      if ([4, 7, 8, 9].includes(criterio)) {
        return (
          (value != null && value >= 0) ||
          "La cobertura es obligatoria."
        );
      }
      return true;
    },

    cveTarifa: (value: number | null) => {
      return (
        (value != null && value >= 0) ||
        "El tipo de tarifa es obligatorio."
      );
    },

    primaTarifaReaseg: (value: number | null, context: any) => {
      const cveTarifa = context.form?.cveTarifa;
      if ([0, 4].includes(cveTarifa)) {
        if (value === null || value === undefined)
          return "La prima de tarifa fija es obligatoria.";
        return (
          val.minMax(value, 0, 9999999999999999999.99) ||
          "La prima de tarifa fija debe ser un número positivo."
        );
      }
      return true;
    },

    porcentajePrimaEmi: (value: number | null, context: any) => {
      const cveTarifa = context.form?.cveTarifa;
      if (cveTarifa === 1) {
        if (value === null || value === undefined)
          return "El % sobre prima emitida es obligatorio.";
        return (
          val.minMax(value, 0, 100) ||
          "El % sobre prima emitida debe estar entre 0.00 y 100.00."
        );
      }
      return true;
    },

    tarifaMillar: (value: number | null, context: any) => {
      const cveTarifa = context.form?.cveTarifa;
      if ([2, 3].includes(cveTarifa)) {
        if (value === null || value === undefined)
          return "La tarifa fija al millar es obligatoria.";
        return (
          val.minMax(value, 0, 999.99) ||
          "La tarifa fija al millar debe estar entre 0.00 y 999.99."
        );
      }
      return true;
    },

    edad: (value: number | null, context: any) => {
      const cveTarifa = context.form?.cveTarifa;
      if ([2, 4].includes(cveTarifa)) {
        if (value === null || value === undefined)
          return "La edad es obligatoria.";
        return (
          val.minMax(value, 0, 999) ||
          "La edad debe estar entre 0 y 999."
        );
      }
      return true;
    },

    cveSexo: (value: string | null, context: any) => {
      const cveTarifa = context.form?.cveTarifa;
      if ([2, 4].includes(cveTarifa)) {
        return (
          (value != null && value !== "") ||
          "El sexo es obligatorio."
        );
      }
      return true;
    },

    proporcionDias: (value: number | null) => {
      return (
        val.isFalsyExceptZero(value) ||
        "El campo ¿Proporción por días de vigencia? es obligatorio."
      );
    },

    cveMonedaTarifa: (value: number | null, context: any) => {
      const cveTarifa = context.form?.cveTarifa;
      if ([0, 4].includes(cveTarifa)) {
        return (
          (value != null && value >= 0) ||
          "La moneda de tarifa es obligatoria."
        );
      }
      return true;
    },
  };
};