export class ValidacionesCalculos {

  static required(message = 'Campo requerido') {
    return (v: any) => !!v || message
  }

  // SUBRAMO
  static subramo() {
    return (v: any[]) => {
      if (!Array.isArray(v) || v.length === 0) return 'Subramo requerido';

      return v.every(s => {
        const val = (typeof s === 'object' && s !== null) ? s.value : s;
        return String(val).length <= 3;
      }) || 'Verificar longitud de subramo';
    }
  }
  // IDENTIFICADOR DE CONTRATO
  static idContrato() {
    return this.required('Identificador de contrato requerido')
  }

  // FECHAS
  static fechaInicio() {
    return this.required('Fecha inicio contrato requerida')
  }

  static fechaFin(fechaInicio: () => string) {
    return (v: string) => {
      if (!v) return 'Fecha fin contrato requerida'
      if (!fechaInicio()) return true
      return new Date(v) >= new Date(fechaInicio())
        || 'La fecha fin debe ser mayor o igual a la fecha inicio'
    }
  }

}
