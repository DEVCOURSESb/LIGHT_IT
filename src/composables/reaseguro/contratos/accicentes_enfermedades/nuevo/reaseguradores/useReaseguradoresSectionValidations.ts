import { validationsHandler } from "@/utilities/validations/validationsHandler";

interface props {
  isTypeProporcional: boolean
}

/**
 * Validaciones de la pestaña reaseguradores en nuevo contrato accidentes y enfermedades
 * @returns Object
 */
export const useReaseguradoresSectionValidations = ({ isTypeProporcional }:props) => {
  const val = validationsHandler();

  return {
    cveReasegurador: (value: number) => (value != null && value >= 0) || "Reasegurador es obligatorio",
    participacion: (value: number) =>  {
      if (value === null || value === undefined) return "La participación es obligatoria.";
      else return val.minMax(value, 0, 100) || "La participación es obligatoria con un rango de 0.00 a 100.00"
    },
    otorgaPtu: (value: number) => {
      if ( !isTypeProporcional ) return true;
      else return val.isFalsyExceptZero(value) || "Otorga PTU es obligatorio"
    },
    porcentajePtu: (value: number, context: any) => {
      const otorgaPTU = context.form?.otorgaPtu;
      if ( otorgaPTU === 1 ) {
        if (value === null || value === undefined) return "El porcentaje es obligatorio.";
        else return val.minMax(value, 0, 100) || "El porcentaje es obligatorio con un rango de 0.00 a 100.00"
      }
      return true;
    },
    cvePtu: (value: number, context: any) => {
      const otorgaPTU = context.form?.otorgaPtu;
      if ( otorgaPTU === 1 ) {
        return value != null && value >= 0 || "Fórmula cálculo es obligatorio"
      }
      return true;
    },
    porcentajeK: (value: number, context: any) => {
      const cvFormula = context.form?.cvePtu;

      if ( cvFormula === 2 ) {
        if (value === null || value === undefined) return "El porcentaje es obligatorio.";
        else return val.minMax(value, 0, 100) || "El porcentaje es obligatorio con un rango de 0.00 a 100.00"
      }

      return true;
    },
    gastos: (value: number, context: any) => {
      const cvFormula = context.form?.cvePtu;

      if ( [5, 6, 7].includes(cvFormula) ) {
        if (value === null || value === undefined) return "Gastos son obligatorios.";
        else return val.minMax(value, 0, 100) || "Gastos son obligatorios con un rango de 0 a 100"
      }

      return true;
    },
    aniosArrastre: ( value: number, context: any ) => {
      const cvFormula = context.form?.cvePtu;

      if ( [0, 3, 5, 6].includes(cvFormula) ) {
        if (value === null || value === undefined) return "Años arrastre son obligatorios.";
        else return val.minMax(value, 0, 99) || "Años arrastre son obligatorio con rango de 0 a 99"
      }

      return true;
    },
    comisRolReaseguro: (value: number) => val.isFalsyExceptZero(value) || "Comisión / Rol Reaseguro es obligatorio",
    /* tipo de comision rate on line */
    cveAsignacionComisRol: (value: number, context: any) => {
      const comisRol = context.form?.comisRolReaseguro;
      if ( comisRol === 1 ) {
        return value != null && value >= 0 || "Tipo de comisión / rate on line es obligatorio"
      }
      return true;
    },
    /* formula comision rate online si tipo de comision / rate on line es 1 variable */
    cveCalcomis: (value: number, context: any) => {
      const comisRol = context.form?.cveAsignacionComisRol;
      if(comisRol === 1) {
        if ( value === null || value === undefined ) return "Fórmula comisión / rate on line es obligatorio";
        else return value >= 0 || "Fórmula comisión / rate on line es obligatorio" 
      }
      return true;
    },
    /* comision rate online fija */
    comisRolFija: (value: number, context: any) => {
      const comisRol = context.form?.cveAsignacionComisRol;
      if ( comisRol === 0 ) {
        if (value === null || value === undefined) return "Comisión / rate on line fija es obligatorio";
        else return val.minMax(value, 0, 100) || "Comisión / rate on line fija es obligatorio con un rango de 0.00 a 100.00"
      }
      return true;
    },
    /* comision rate online provisional si ipo de comision es 1 variable o 2 escalonada */
    comisRolProvisional: (value: number, context: any) => {
      const comisRol = context.form?.cveAsignacionComisRol;
      if( [1, 2].includes(comisRol) ) {
        if (value === null || value === undefined) return "Comisión / rate on line provisional es obligatorio";
        else return val.minMax(value, 0, 100) || "Comisión / rate on line provisional es obligatorio con un rango de 0.00 a 100.00"
      }
      return true;
    },
    /* comision rate on line minima si tipo de comision / rate online es 1 variable */
    comisRolMin: (value: number, context: any) => {
      const comisRol = context.form?.cveAsignacionComisRol;
      if ( comisRol === 1 ) {
        if (value === null || value === undefined) return "Comisión / rate on line mínima es obligatorio";
        else return val.minMax(value, 0, 100) || "Comisión / rate on line mínima es obligatorio con un rango de 0.00 a 100.00"
      }
      return true;
    },
    /* comision rate on line maxima si tipo de comision / rate online es 1 variable */
    comisRolMax: (value: number, context: any) => {
      const comisRol = context.form?.cveAsignacionComisRol;
      if ( comisRol === 1 ) {
        if (value === null || value === undefined) return "Comisión / rate on line máxima es obligatorio";
        else return val.minMax(value, 0, 100) || "Comisión / rate on line máxima es obligatorio con un rango de 0.00 a 100.00"
      }
      return true;
    },
    capa: (value: number) => {
      if ( !isTypeProporcional ) {
        if (value === null || value === undefined) return "Capa es obligatoria.";
        else return val.minMax(value, 0, 99999) || "Capa es obligatoria con un rango de 0 a 99999"
      }

      return true;
    },
    prioridad: (value: number) => {
      if ( !isTypeProporcional ) {
        if (value === null || value === undefined) return "Prioridad es obligatoria.";
        else return val.minMax(value, 0, 99999999999999999999.99) || "Prioridad es obligatoria con un rango de 0 a 99999999999999999999.99"
      }

      return true;
    },
    limResponsabilidad: (value: number) => {
      if ( !isTypeProporcional ) {
        if (value === null || value === undefined) return "Límite de responsabilidad es obligatorio.";
        else return val.minMax(value, 0, 99999999999999999999.99) || "Límite de responsabilidad es obligatorio con un rango de 0 a 99999999999999999999.99"
      }

      return true;
    },
    limAgregado: (value: number) => {
      if ( !isTypeProporcional ) {
        if (value === null || value === undefined) return "Límite agregado es obligatorio.";
        else return val.minMax(value, 0, 99999999999999999999.99) || "Límite agregado es obligatorio con un rango de 0 a 99999999999999999999.99"
      }

      return true;
    },
    cveCriterioAsigLimAgregado: (value: number) => {
      if ( !isTypeProporcional ) {
        return value != null && value >= 0 || "Tipo de límite agregado es obligatorio";
      }
      return true;
    },
    cveAsignacionCosto: (value: number) => {
      if ( !isTypeProporcional ) {
        return value != null && value >= 0 || "Tipo de costo es obligatorio";
      }
      return true;
    },
    costoFijo: (value: number, context: any) => {
      const cveAsignacionCosto = context.form?.cveAsignacionCosto;
      if ( cveAsignacionCosto === 0 ) {
        if (value === null || value === undefined) return "Costo fijo es obligatorio";
        else return val.minMax(value, 0, 999999999999999999.00) || "Costo fijo es obligatorio con un rango de 0 a 999999999999.00"
      }
      return true;
    },
    pmd: (value: number, context: any) => {
      const cveAsignacionCosto = context.form?.cveAsignacionCosto;
      if ( cveAsignacionCosto === 1 ) {
        if (value === null || value === undefined) return "PMD es obligatorio";
        else return val.minMax(value, 0, 999999999999999999.00) || "PMD es obligatorio con un rango de 0 a 999999999999.00"
      }
      return true;
    },
    primaMin: (value: number, context: any) => {
      const cveAsignacionCosto = context.form?.cveAsignacionCosto;
      if ( cveAsignacionCosto === 1 ) {
        if (value === null || value === undefined) return "Prima mínima es obligatoria";
        else return val.minMax(value, 0, 999999999999999999.00) || "Prima mínima es obligatoria con un rango de 0 a 999999999999.00"
      }
      return true;
    },
    primaMax: (value: number, context: any) => {
      const cveAsignacionCosto = context.form?.cveAsignacionCosto;
      if ( cveAsignacionCosto === 1 ) {
        if (value === null || value === undefined) return "Prima máxima es obligatoria";
        else return val.minMax(value, 0, 999999999999999999.00) || "Prima máxima es obligatoria con un rango de 0 a 999999999999.00"
      }
      return true;
    },
    facAjusteDividendo: (value: number, context: any) => {
      const cveAsignacionCosto = context.form?.cveAsignacionCosto;
      if ( cveAsignacionCosto === 1 ) {
        if (value === null || value === undefined) return "Factor de ajuste dividendo es obligatorio";
        else return val.minMax(value, 0, 99999) || "Factor de ajuste dividendo es obligatorio con un rango de 0 a 99999"
      }
      return true;
    },
    facAjusteDivisor: (value: number, context: any) => {
      const cveAsignacionCosto = context.form?.cveAsignacionCosto;
      if ( cveAsignacionCosto === 1 ) {
        if (value === null || value === undefined) return "Factor de ajuste divisor es obligatorio";
        else return val.minMax(value, 0, 99999) || "Factor de ajuste divisor es obligatorio con un rango de 0 a 99999"
      }
      return true;
    },
    noClaims: (value: number) => {
      if ( !isTypeProporcional ) {
        if (value === null || value === undefined) return "No claims es obligatorio";
        else return val.minMax(value, 0, 99999) || "No claims es obligatorio con un rango de 0 a 99999"
      }
      return true;
    },
  }
};
