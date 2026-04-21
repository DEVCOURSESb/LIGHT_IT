import { handleValidations } from "@/utils/validations/handleValidations";

export const useAdministracionValidations = () => {
  const val = handleValidations();

  // ── PAGOS ──────────────────────────────────────────────────────────────
  const pago = {
    cveFormapago: (value: number | null | undefined) => {
      return (
        (value != null && value >= 0) ||
        "La forma de pago es obligatoria."
      );
    },

    porcentajePago: (value: number | null, context: any) => {
      const forma = context.form?.cveFormapago;
      if (forma === 7) {
        if (value == null) return "El % de pago es obligatorio.";
        return (
          val.minMax(value, 0.01, 100) ||
          "El % de pago debe estar entre 0.01 y 100.00."
        );
      }
      return true;
    },

    fechaPago: (value: string | null, context: any) => {
      const forma = context.form?.cveFormapago;
      if (forma === 7) {
        return (
          (value != null && value !== "") ||
          "La fecha de pago es obligatoria."
        );
      }
      return true;
    },
  };

  // ── ESTADOS DE CUENTA ──────────────────────────────────────────────────
  const edo = {
    cvePeriodicidadEdo: (value: number | null | undefined) => {
      return (
        (value != null && [1, 2, 3, 4, 7].includes(value as number)) ||
        "La periodicidad del estado de cuenta es obligatoria."
      );
    },

    fechaEdo: (value: string | null, context: any) => {
      const periodo = context.form?.cvePeriodicidadEdo;
      if (periodo === 7) {
        return (
          (value != null && value !== "") ||
          "La fecha del estado de cuenta es obligatoria."
        );
      }
      return true;
    },
  };

  // ── BORDEREAUX PRIMAS ──────────────────────────────────────────────────
  const borPrimas = {
    cvePeriodicidadPrimas: (value: number | null | undefined) => {
      return (
        (value != null && [1, 2, 3, 4, 7].includes(value as number)) ||
        "La periodicidad de bordereaux primas es obligatoria."
      );
    },

    fechaPrimas: (value: string | null, context: any) => {
      const periodo = context.form?.cvePeriodicidadPrimas;
      if (periodo === 7) {
        return (
          (value != null && value !== "") ||
          "La fecha de bordereaux primas es obligatoria."
        );
      }
      return true;
    },
  };

  // ── BORDEREAUX SINIESTROS ──────────────────────────────────────────────
  const borSiniestros = {
    cvePeriodicidadSiniestros: (value: number | null | undefined) => {
      return (
        (value != null && [1, 2, 3, 4, 7].includes(value as number)) ||
        "La periodicidad de bordereaux siniestros es obligatoria."
      );
    },

    fechaSiniestros: (value: string | null, context: any) => {
      const periodo = context.form?.cvePeriodicidadSiniestros;
      if (periodo === 7) {
        return (
          (value != null && value !== "") ||
          "La fecha de bordereaux siniestros es obligatoria."
        );
      }
      return true;
    },
  };

  return { pago, edo, borPrimas, borSiniestros };
};