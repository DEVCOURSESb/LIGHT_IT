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
        return "La capacidad del contrato es obligatoria, debe ser un número positivo.";
        // SI PORCENTAJE RETENCION DISTINTO DE VACIO 	CAPACIDAD_CONTRATO
      } else if (val.isFalsyExceptZero(context.form?.porcentajeRetencion)) {
        const montoEsperado = round2(
          Number(context.form?.porcentajeCesion) * Number(context.form?.capacidadContrato) + Number(context.form?.porcentajeRetencion) * Number(context.form?.capacidadContrato)
        );
        if (numericValue === montoEsperado) return true;
        else
          return `La capacidad del contrato no corresponde con el monto de cesión y retención (${montoEsperado}).`;
      } else {
        //TODO: campo monto retencion contrato no existe
        const esperado = round2(
           Number(context.form?.montoCesion) +
          Number(context.form?.montoRetencionContrato)
        );
        return true;
      }
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
