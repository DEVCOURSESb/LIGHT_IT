import { handleValidations } from "@/utils/validations/handleValidations";

export const useDetallesProporcionalesValidations = () => {
  const val = handleValidations();

  const round2 = (num: number) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };


  return {
    detallesOperRamo: (value: number) => val.isFalsyExceptZero(value) || "El detalle de operación ramo es obligatorio.",
    cveExtCoberDetalles: (value: number | null, context: any) => {
      const detallesOperRamo = context.form?.detallesOperRamo;
      if (detallesOperRamo === 1) {
        return ( (value != null && value >= 0) || "El tipo de operación / ramo es obligatorio." );
      } else {
        return true;
      }
    },
    cveOperRamoDetalles: (value: number | null, context: any) => {
      const detallesOperRamo = context.form?.detallesOperRamo;
      if (detallesOperRamo === 1) {
        return ((value != null && value >= 0) || "La operación / ramo es obligatoria.");
      } else {
        return true;
      }
    },
    montoRetencion: (value: number) => {
        if ( !value ) return true;
        return (val.minMax(value, 0, 9999999999999999999.99) || "El monto de retención es obligatorio y debe ser un número positivo.");
      },
      montoCesion: (value: number) => {
      if ( !value ) return true;

      if (!(value != null && value >= 0)) {
          return (val.minMax(value, 0, 9999999999999999999.99) || "Monto de cesión contrato es obligatorio.");
        }

        return true;
    },
    capacidadContrato: (value: number, context: any) => {
      const numericValue = round2(Number(value));

      if (!(value != null && val.minMax(numericValue, 0, 9999999999999999999.99))) {
        return "La capacidad del contrato es obligatoria.";
      }

      const pctRet = context.form?.porcentajeRetencion;
      const pctCes = context.form?.porcentajeCesion;

      if (val.isFalsyExceptZero(pctRet)) {
        const suma = round2((Number(pctCes) || 0) + (Number(pctRet) || 0));

        return suma === 100 || "La suma de porcentajes debe ser 100.";
      }

      const esperado = round2(
        Number(context.form?.montoCesion || 0) +
        Number(context.form?.montoRetencion || 0)
      );

      return numericValue === esperado ||
        `La capacidad del contrato debe ser ${esperado}`;
    },
    cveCriterioAsigCapacidad: (value: string | null) => {
      return ( (value != null && value !== "") || "El criterio de capacidad es obligatorio." );
    },
    cveDistrCesion: (value: string | null) => {
      return ( (value != null && value !== "") || "La distribución de la cesión es obligatoria." );
    },
    cveMonedaDetalles: (value: string | null) => {
      return ( (value != null && value !== "") || "La moneda de los detalles es obligatoria." );
    },
    cumulos: (value: number | null) => {
      return val.isFalsyExceptZero(value) || "El campo de cúmulos es obligatorio.";
    },
  };
};
