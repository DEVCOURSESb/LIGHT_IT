import { validationsHandler } from "@/utilities/validations/validationsHandler";

export const useDetallesProporcionalesValidations = () => {
  const val = validationsHandler();

  const round2 = (num: number) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };


  return {
    detallesOperRamo: (value: string) => !!value || "El detalle de operación ramo es obligatorio.",
    cveExtCoberDetalles: (value: number | null, context: any) => {
      const detallesOperRamo = context.form?.detallesOperRamo;
      if (detallesOperRamo === "SÍ") {
        return ( (value != null && value >= 0) || "El tipo de operación / ramo es obligatorio." );
      } else {
        return true;
      }
    },
    cveOperRamoDetalles: (value: number | null, context: any) => {
      const detallesOperRamo = context.form?.detallesOperRamo;
      if (detallesOperRamo === "SÍ") {
        return ((value != null && value >= 0) || "La operación / ramo es obligatoria.");
      } else {
        return true;
      }
    },
    montoRetencion: (value: number, context: any) => {
      if (value === null || value === undefined)
        return "El monto de retención es obligatorio.";
      if (value > context.form?.montoRetencionContrato) {
        return "El monto de retención no puede ser mayor al monto de retención del contrato.";
      } else {
        return (val.minMax(value, 0, 9999999999999999999.99) || "El monto de retención es obligatorio y debe ser un número positivo.");
      }
    },
    montoRetencionContrato: (value: number, /* context: any */) => {
      /* const numericValue = round2(Number(value));
      if (!(value != null && numericValue >= 0)) {
        return "El monto de retención del contrato es obligatorio y debe ser un número positivo.";
        //! SI PORCENTAJE DE RETENCION NO ES NULO, EL MONTO DE RETENCION DEL CONTRATO DEBE SER IGUAL AL PORCENTAJE DE RETENCION Y LA CAPACIDAD DEL CONTRATO
      } else if (context.form?.porcentajeRetencion != null) {
        const montoEsperado = round2(Number(context.form?.capacidadContrato) * (Number(context.form?.porcentajeRetencion) / 100));
        if (numericValue === montoEsperado) return true;
        else
          return `El monto de retención del contrato no corresponde con el porcentaje de retención y la capacidad del contrato (${montoEsperado}).`;
      } else {
        return true;
      } */

        if (!(value != null && value >= 0)) {
          return (val.minMax(value, 0, 9999999999999999999.99) || "Monto de retención contrato es obligatorio.");
        }

        return true;
    },
    montoCesion: (value: number, context: any) => {
      /* const numericValue = round2(Number(value));
      if (!(value != null && val.minMax(numericValue, 0, 9999999999999999999.99))) {
        return "El monto de cesión es obligatorio y debe ser un número positivo.";
        //! SI EL PORCENTAJE DE CESION NO ES NULO, EL MONTO DE CESION DEBE SER IGUAL AL PORCENTAJE DE CESION Y LA CAPACIDAD DEL CONTRATO
      } else if(context.form?.porcentajeCesion != null) {
        const montoEsperdo = round2(Number(context.form?.capacidadContrato) * (Number(context.form?.porcentajeCesion) / 100));
        if (numericValue === montoEsperdo) return true;
        else
          return `El monto de cesión no corresponde con el porcentaje de cesión y la capacidad del contrato (${montoEsperdo}).`;
      } else {
        return true;
      } */
      if (!(value != null && value >= 0)) {
          return (val.minMax(value, 0, 9999999999999999999.99) || "Monto de cesión contrato es obligatorio.");
        }

        return true;
    },
    capacidadContrato: (value: number, context: any) => {
      const numericValue = round2(Number(value));
      if (!(value != null && val.minMax(numericValue, 0, 9999999999999999999.99))) {
        return "La capacidad del contrato es obligatoria, debe ser un número positivo y no puede ser mayor al monto de cesión.";
        // SI PORCENTAJE RETENCION ES VACIO 	CAPACIDAD_CONTRATO = PORCENTAJE_CESION * CAPACIDAD_CONTRATO + PORCENTAJE_RETENCION * CAPACIDAD_CONTRATO = MONTO_RETENCION_CONTRATO + MONTO_CESION
      } else if (context.form?.porcentajeRetencion === null) {
        const montoEsperado = round2(
          Number(context.form?.montoCesion) +
          Number(context.form?.montoRetencionContrato)
        );
        if (numericValue === montoEsperado) return true;
        else
          return `La capacidad del contrato no corresponde con el monto de cesión y retención (${montoEsperado}).`;
      } else {
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
    cumulos: (value: string | null) => {
      return ( (value === "SÍ" || value === "NO") || "El campo de cúmulos es obligatorio." );
    },
  };
};
