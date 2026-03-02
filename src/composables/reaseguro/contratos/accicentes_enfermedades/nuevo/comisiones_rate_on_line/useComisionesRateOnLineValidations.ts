import { validationsHandler } from "@/utilities/validations/validationsHandler";

export const useComisionesRateOnLineValidations = () => {
  const val = validationsHandler();

  return {
    cveReaseguradorComisRol: (value: number | null) => {
      return (
        (value != null && value >= 0) ||
        "La reaseguradora es obligatoria."
      );
    },

    limiteInf: (value: number | null) => {
      if (value === null || value === undefined)
        return "El límite inferior es obligatorio.";
      return (
        val.minMax(value, 0, 1000) ||
        "El límite inferior debe estar entre 0.00 y 1,000.00."
      );
    },

    limiteSup: (value: number | null, context: any) => {
      if (value === null || value === undefined)
        return "El límite superior es obligatorio.";

      const minMaxResult = val.minMax(value, 0, 1000);
      if (minMaxResult !== true)
        return "El límite superior debe estar entre 0.00 y 1,000.00.";

      const limiteInf = context.form?.limiteInf;
      if (limiteInf != null && value <= limiteInf)
        return "El límite superior debe ser mayor al límite inferior.";

      return true;
    },

    comisRolDefinitiva: (value: number | null) => {
      if (value === null || value === undefined)
        return "La comisión / rate on line definitiva es obligatoria.";
      return (
        val.minMax(value, 0, 100) ||
        "La comisión debe estar entre 0.00 y 100.00."
      );
    },
  };
};