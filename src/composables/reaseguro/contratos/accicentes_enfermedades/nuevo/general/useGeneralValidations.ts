import { handleValidations } from "@/utils/validations/handleValidations";

export const useGeneralValidations = () => {
  const val = handleValidations();

  return {
    idContrato: (value: string) => (val.minMaxString(value, 1, 16) && val.allowUnderscore(value)) || "Debe tener entre 1 y 16 caracteres.",
    fechaInicioContrato: (value: Date) => val.isValidDate(value) || "Fecha inválida.", 
    fechaFinContrato: (value: Date, context: any) => {
      if (!val.isValidDate(value)) {
        return "Fecha inválida.";
      }

      const fechaInicio = context.form?.fechaInicioContrato;

      if (fechaInicio && value < fechaInicio) {
        return "Debe ser mayor a la fecha de inicio.";
      }

      return true;
    },
    ordenCobertura: (value: number) => val.minMax(value, 1, 999) || "Debe ser un número entre 1 y 999.",
    cveTreaseg: (value: number) => value >= 0 || "El tipo de reaseguro es obligatorio.",
    idTcontrato: (value: number) => value >= 0 || "El tipo de contrato es obligatorio.",
    cveFcontrac: (value: number) => value >= 0 || "La forma contractual es obligatoria.",
    // criterio cobertura solo si el reaseguro es proporcional
    cveCriterioCob: (value: number, context: any) => {
      const cveTreaseg = context.form?.cveTreaseg;
      if (cveTreaseg === 0) {
        return value != null && value >= 0 || "El criterio de cobertura es obligatorio.";
      }
      return true;
    },
    // traspasoCartera solo si el reaseguro es proporcional
    traspasoCartera: (value: string, context: any) => {
      const cveTreaseg = context.form?.cveTreaseg;
      if (cveTreaseg === 0) {
        return val.isFalsyExceptZero(value) || "El traspaso de cartera es obligatorio.";
      }
      return true;
    },
    // cveEntidad si la forma contractual es facultativa
    cveEntidad: (value: string, context: any) => {
      const cveFcontrac = context.form?.cveFcontrac;
      if (cveFcontrac === 1) {
        return val.minMaxString(value, 1, 2) || "La entidad federativa es obligatoria.";
      }
      return true;
    },
    // municipio si la forma contractual es facultativa
    municipio: (value: string, context: any) => {
      const cveFcontrac = context.form?.cveFcontrac;
      if (cveFcontrac === 1) {
        return val.minMaxString(value, 1, 100) || "El municipio es obligatorio y debe tener máximo 100 caracteres.";
      }
      return true;
    },
    // cveSector si la forma contractual es facultativa
    cveSector: (value: string, context: any) => {
      const cveFcontrac = context.form?.cveFcontrac;
      if (cveFcontrac === 1) {
        return val.minMaxString(value, 1, 10) || "El tipo de sector es obligatorio.";
      }
      return true;
    },
    // asegurado si la forma contractual es facultativa
    asegurado: (value: string, context: any) => {
      const cveFcontrac = context.form?.cveFcontrac;
      if (cveFcontrac === 1) {
        return val.minMaxString(value, 1, 100) || "El asegurado es obligatorio y debe tener máximo 100 caracteres.";
      }
      return true;
    },
    negociosCubiertos: (value: string) => {
        return (val.minMaxString(value, 1, 1000) && val.noSpecialCharacters(value) ) || "Máximo 1000 caracteres, sin especiales.";
    },
    contratoActivo: (value: boolean) => value != null || "El estatus del contrato es obligatorio.",
  };
};
