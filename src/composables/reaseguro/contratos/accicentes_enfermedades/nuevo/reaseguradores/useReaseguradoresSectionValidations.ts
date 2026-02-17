import { validationsHandler } from "@/utilities/validations/validationsHandler";

/**
 * Validaciones de la pestaña reaseguradores en nuevo contrato accidentes y enfermedades
 * @returns Object
 */
export const useReaseguradoresSectionValidations = () => {
  const val = validationsHandler();

  return {
    cveReasegurador: (value: number) => (value != null && value >= 0) || "Reasegurador es obligatorio",
    participacion: (value: number) =>  {
      if (value === null || value === undefined) return "La participación es obligatoria.";
      else return val.minMax(value, 0, 100) || "La participación es obligatoria con un rango de 0.00 a 100.00"
    },
  }
};
