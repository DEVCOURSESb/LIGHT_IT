import { handleValidations } from "@/utils/validations/handleValidations";

export const useCorretajeValidations = () => {
  const val = handleValidations();

  return {
    // ── Intermediario (siempre obligatorio en este módulo) ─────────────
    cveIntermediarioCorretaje: (value: number | null | undefined) => {
      return (
        (value != null && value >= 0) ||
        "El intermediario es obligatorio."
      );
    },

    // ── Reaseguradora (obligatoria cuando hay escalonado por reaseguradora)
    // La habilitación la controla hayEscalonadoPorReaseg en el composable;
    // aquí se valida presencia cuando el campo está activo.
    cveReaseguradorCorretaje: (value: number | null) => {
      // La validación contextual real se hace en el composable con puedeAgregar().
      // Aquí solo validamos formato cuando se proporciona valor.
      if (value != null && value < 0) {
        return "La reaseguradora seleccionada no es válida.";
      }
      return true;
    },

    // ── Límite inferior (0.00 – 1000.00, obligatorio) ─────────────────
    limiteInfCorretaje: (value: number | null | undefined) => {
      if (value == null || value === undefined) {
        return "El límite inferior es obligatorio.";
      }
      return (
        val.minMax(value, 0, 1000) ||
        "El límite inferior debe estar entre 0.00 y 1,000.00."
      );
    },

    // ── Límite superior (0.00 – 1000.00, obligatorio) ─────────────────
    limiteSupCorretaje: (value: number | null | undefined) => {
      if (value == null || value === undefined) {
        return "El límite superior es obligatorio.";
      }
      return (
        val.minMax(value, 0, 1000) ||
        "El límite superior debe estar entre 0.00 y 1,000.00."
      );
    },

    // ── % Corretaje definitivo (mutuamente excluyente con monto) ───────
    porcentajeCorretajeDef: (value: number | null, context: any) => {
      const monto = context.form?.montoCorretajeDef;

      // Al menos uno debe tener valor
      if (value == null && monto == null) {
        return "Debe capturar % Corretaje definitivo o Monto corretaje definitivo.";
      }

      // Si tiene valor, validar rango
      if (value != null) {
        return (
          val.minMax(value, 0, 100) ||
          "El % corretaje definitivo debe estar entre 0.00 y 100.00."
        );
      }

      return true;
    },

    // ── Monto corretaje definitivo (mutuamente excluyente con %) ───────
    montoCorretajeDef: (value: number | null, context: any) => {
      const pct = context.form?.porcentajeCorretajeDef;

      // Al menos uno debe tener valor
      if (value == null && pct == null) {
        return "Debe capturar % Corretaje definitivo o Monto corretaje definitivo.";
      }

      // Si tiene valor, validar que sea positivo
      if (value != null) {
        return (
          (value >= 0) ||
          "El monto de corretaje definitivo debe ser un valor positivo."
        );
      }

      return true;
    },
  };
};