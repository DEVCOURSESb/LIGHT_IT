import { handleValidations } from "@/utils/validations/handleValidations";

export const useIntermediariosValidations = () => {
  const val = handleValidations();

  return {
    // ¿Intermediario? (0=NO | 1=SI)
    intermediario: (value: number | null) => {
      return (
        (value != null && [0, 1].includes(value)) ||
        "El campo ¿Intermediario? es obligatorio."
      );
    },

    // Criterio de asignación (obligatorio cuando intermediario = 1)
    cveCriterioAsigIntermediario: (value: number | null, context: any) => {
      const intermediario = context.form?.intermediario;
      if (intermediario === 1) {
        return (
          (value != null && [0, 1].includes(value)) ||
          "La asignación de intermediario es obligatoria."
        );
      }
      return true;
    },

    // Reaseguradora (obligatoria cuando criterio = 0)
    cveReaseguradorIntermediario: (value: number | null, context: any) => {
      const intermediario = context.form?.intermediario;
      const criterio      = context.form?.cveCriterioAsigIntermediario;
      if (intermediario === 1 && criterio === 0) {
        return (
          (value != null && value >= 0) ||
          "La reaseguradora es obligatoria."
        );
      }
      return true;
    },

    // Intermediario del catálogo (obligatorio cuando intermediario = 1)
    cveIntermediario: (value: number | null, context: any) => {
      const intermediario = context.form?.intermediario;
      if (intermediario === 1) {
        return (
          (value != null && value >= 0) ||
          "El intermediario es obligatorio."
        );
      }
      return true;
    },

    // ¿Corretaje? (0=NO | 1=SI, obligatorio cuando intermediario = 1)
    corretaje: (value: number | null, context: any) => {
      const intermediario = context.form?.intermediario;
      if (intermediario === 1) {
        return (
          (value != null && [0, 1].includes(value)) ||
          "El campo ¿Corretaje? es obligatorio."
        );
      }
      return true;
    },

    // Tipo de corretaje (obligatorio cuando corretaje = 1)
    cveAsignacionCorretaje: (value: number | null, context: any) => {
      const corretaje = context.form?.corretaje;
      if (corretaje === 1) {
        return (
          (value != null && [0, 1, 2].includes(value)) ||
          "El tipo de corretaje es obligatorio."
        );
      }
      return true;
    },

    // % Corretaje fijo (0–100.0000, cuando tipo = 0 FIJA)
    // Mutuamente excluyente con montoCorretajeFijo: al menos uno debe tener valor
    porcentajeCorretajeFijo: (value: number | null, context: any) => {
      const corretaje   = context.form?.corretaje;
      const tipoCorret  = context.form?.cveAsignacionCorretaje;
      const monto       = context.form?.montoCorretajeFijo;

      if (corretaje === 1 && tipoCorret === 0) {
        // Al menos uno de los dos debe tener valor
        if (value == null && monto == null) {
          return "Debe capturar % Corretaje fijo o Monto corretaje fijo.";
        }
        if (value != null) {
          return (
            val.minMax(value, 0, 100) ||
            "El % corretaje fijo debe estar entre 0.0000 y 100.0000."
          );
        }
      }
      return true;
    },

    // Monto corretaje fijo (cuando tipo = 0 FIJA)
    // Mutuamente excluyente con porcentajeCorretajeFijo
    montoCorretajeFijo: (value: number | null, context: any) => {
      const corretaje  = context.form?.corretaje;
      const tipoCorret = context.form?.cveAsignacionCorretaje;
      const pct        = context.form?.porcentajeCorretajeFijo;

      if (corretaje === 1 && tipoCorret === 0) {
        if (value == null && pct == null) {
          return "Debe capturar % Corretaje fijo o Monto corretaje fijo.";
        }
        if (value != null) {
          return (
            (value >= 0) ||
            "El monto de corretaje fijo debe ser un valor positivo."
          );
        }
      }
      return true;
    },

    // Fórmula límite corretaje (obligatoria cuando tipo = 1 VARIABLE)
    cveLimCorretaje: (value: number | null, context: any) => {
      const corretaje  = context.form?.corretaje;
      const tipoCorret = context.form?.cveAsignacionCorretaje;
      if (corretaje === 1 && tipoCorret === 1) {
        return (
          (value != null && value >= 0) ||
          "La fórmula límite de corretaje es obligatoria."
        );
      }
      return true;
    },

    // % Corretaje provisional (cuando tipo = 1 VARIABLE o 2 ESCALONADA)
    // Mutuamente excluyente con montoCorretajeProvisional
    porcentajeCorretajeProvisional: (value: number | null, context: any) => {
      const corretaje  = context.form?.corretaje;
      const tipoCorret = context.form?.cveAsignacionCorretaje;
      const monto      = context.form?.montoCorretajeProvisional;

      if (corretaje === 1 && [1, 2].includes(tipoCorret)) {
        if (value == null && monto == null) {
          return "Debe capturar % Corretaje provisional o Monto corretaje provisional.";
        }
        if (value != null) {
          return (
            val.minMax(value, 0, 100) ||
            "El % corretaje provisional debe estar entre 0.00 y 100.00."
          );
        }
      }
      return true;
    },

    // Monto corretaje provisional (cuando tipo = 1 o 2)
    // Mutuamente excluyente con porcentajeCorretajeProvisional
    montoCorretajeProvisional: (value: number | null, context: any) => {
      const corretaje  = context.form?.corretaje;
      const tipoCorret = context.form?.cveAsignacionCorretaje;
      const pct        = context.form?.porcentajeCorretajeProvisional;

      if (corretaje === 1 && [1, 2].includes(tipoCorret)) {
        if (value == null && pct == null) {
          return "Debe capturar % Corretaje provisional o Monto corretaje provisional.";
        }
        if (value != null) {
          return (
            (value >= 0) ||
            "El monto de corretaje provisional debe ser un valor positivo."
          );
        }
      }
      return true;
    },
  };
};