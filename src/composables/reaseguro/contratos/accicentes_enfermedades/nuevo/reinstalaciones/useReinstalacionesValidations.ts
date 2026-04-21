import { handleValidations } from "@/utils/validations/handleValidations";

export const useReinstalacionesValidations = () => {
  const val = handleValidations();

  return {
    //  ¿Reinstalación? (0=NO | 1=SI) 
    reinstalacion: (value: number | null) => {
      return (
        (value != null && [0, 1].includes(value)) ||
        "El campo ¿Reinstalación? es obligatorio."
      );
    },

    //  Criterio de asignación (obligatorio cuando reinstalacion = 1) 
    cveCriterioAsigReinstalacion: (value: number | null, context: any) => {
      const reinstalacion = context.form?.reinstalacion;
      if (reinstalacion === 1) {
        return (
          (value != null && [0, 1].includes(value)) ||
          "La asignación de reinstalación es obligatoria."
        );
      }
      return true;
    },

    //  Reaseguradora (obligatoria cuando criterio = 0) 
    cveReaseguradorReinstalacion: (value: number | null, context: any) => {
      const reinstalacion = context.form?.reinstalacion;
      const criterio      = context.form?.cveCriterioAsigReinstalacion;
      if (reinstalacion === 1 && criterio === 0) {
        return (
          (value != null && value >= 0) ||
          "La reaseguradora es obligatoria."
        );
      }
      return true;
    },

    //  Cuota de ajuste (obligatoria cuando se habilita, 0–999.99) 
    // La validación contextual aquí es simplificada: se valida rango cuando hay valor.
    // La habilitación real la controla el computed showCuotaAjuste en el composable.
    cuotaAjusteReinstalacion: (value: number | null, context: any) => {
      const reinstalacion = context.form?.reinstalacion;
      if (reinstalacion !== 1) return true;
      // Si el campo está presente y tiene valor, validar rango
      if (value == null) return true; // la obligatoriedad la refuerza el template con :disabled
      return (
        val.minMax(value, 0, 999.99) ||
        "La cuota de ajuste debe estar entre 0.00 y 999.99."
      );
    },

    //  Costo de reinstalación (obligatorio cuando se habilita) 
    costoReinstalacion: (value: number | null, context: any) => {
      const reinstalacion = context.form?.reinstalacion;
      if (reinstalacion !== 1) return true;
      if (value == null) return true;
      return (
        (value >= 0) ||
        "El costo de reinstalación debe ser un valor positivo."
      );
    },

    //  Monto reinstalado (obligatorio cuando reinstalacion = SI) 
    montoReinstalado: (value: number | null, context: any) => {
      const reinstalacion = context.form?.reinstalacion;
      if (reinstalacion === 1) {
        if (value == null) {
          return "El monto reinstalado es obligatorio.";
        }
        return (
          (value >= 0) ||
          "El monto reinstalado debe ser un valor positivo."
        );
      }
      return true;
    },
  };
};