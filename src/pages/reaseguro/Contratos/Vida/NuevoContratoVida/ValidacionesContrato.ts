// Validaciones para el formulario de nuevo contrato de vida
export class ValidacionesContrato {

  static required(message = 'Campo requerido') {
    return (v: any) => !!v || message
  }

  static maxLength(max: number, message: string) {
    return (v: string) =>
      !v || v.length <= max || message
  }

  static noCaracteres(message = 'No se permiten caracteres especiales') {
    const regex = /^[a-zA-Z0-9\s]*$/
    return (v: string) => !v || regex.test(v) || message
  }

  static noEspaciosnoCaracteres(message: string) {
    const regex = /^[A-Z0-9]*$/
    return (v: string) => !v || regex.test(v) || message
  }

  static noCaracteresExceptoComa(mensaje: string) {
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,]+$/

    return (v: string) => {
      if (!v) return true
      if (!regex.test(v)) {
        return mensaje
      }
      return true
    }
  }

  // SUBRAMO
  static subramo() {
    return (v: string[]) =>
      Array.isArray(v) && v.length > 0 && v.every(s => s.length <= 3)
        || 'Subramo requerido'
  }

  // IDENTIFICADOR DE CONTRATO
  static idContrato() {
    return [
      this.required('Identificador de contrato requerido'),
      this.maxLength(16, 'Verificar la longitud ingresada'),
      this.noEspaciosnoCaracteres(
        'No se permiten espacios ni caracteres especiales'
      )
    ]
  }

  // NEGOCIOS CUBIERTOS
  static negociosCubiertos() {
    return [
      this.required('Negocios cubiertos requerido'),
      this.maxLength(1000, 'Verificar la longitud ingresada'),
      this.noCaracteresExceptoComa('Solo se permiten letras, números y comas')
    ]
  }

  // MONEDA
  static moneda() {
    return (v: any) => {
      if (Array.isArray(v)) {
        return v.length > 0 || 'Moneda requerida';
      }
      return !!v || 'Moneda requerida';
    };
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

    // TIPO DE CONTRATO
  static tipoContrato() {
    return (v: number | null) =>
      v !== null || 'Tipo de contrato requerido'
  }

  // 21 dígitos: 19 enteros + 2 decimales
  static numeroC21() {
    const regex = /^\d{1,19}(\.\d{1,2})?$/
    return (v: string) =>
      !v || regex.test(v) || 'Formato numérico inválido'
  }

  //CESION
  static cesion(tipoContrato: () => number | null) {
    const permitidos = [1, 7, 9]

    const regex = /^(100(\.00)?|(\d{1,2})(\.\d{2})?)$/

    return (v: string) => {
      const tipo = tipoContrato()

      if (tipo === null || !permitidos.includes(tipo)) return true
      if (!v) return 'Cesión requerida'
      if (!regex.test(v)) return 'Rango permitido 0.00 – 100.00'
      return true
    }
  }

  // Piso (SEGUNDO, TERCER, CUARTO EXCEDENTE)
  static piso(tipoContrato: () => number | null) {
    const permitidos = [4, 5, 6]

    return (v: string) => {
      const tipo = tipoContrato()
      if (tipo === null || !permitidos.includes(tipo)) return true
      return this.numeroC21()(v)
    }
  }

  // Techo
  static techo(tipoContrato: () => number | null) {
    const permitidos = [4, 5, 6] // SEGUNDO, TERCER, CUARTO EXCEDENTE

    return (v: string) => {
      const tipo = tipoContrato()
      if (tipo === null || !permitidos.includes(tipo)) return true
      if (!v) return 'Techo requerido'
      return this.numeroC21()(v)
    }
  }
  // RETENCION CAPA Y TECHO CAPA (CAPA N)
  static retencionCapa(tipoContrato: () => number | null) {
    return (v: string) => {
      if (tipoContrato() !== 3) return true
      return this.numeroC21()(v)
    }
  }
  // TECHO CAPA
  static techoCapa(tipoContrato: () => number | null) {
    return (v: string) => {
      if (tipoContrato() !== 3) return true
      return this.numeroC21()(v)
    }
  }
// REASEGURADORES
  static companiaReaseg(reaseguradores: any[]) {
    return (v: any) => {
      if (reaseguradores.length > 0) return true
      if (!v) return 'Compañía reaseguradora requerida'
      return true
    }
  }
  //PARTICIPACION
  static participacion() {
    const regex = /^(100(\.00)?|(\d{1,2})(\.\d{1,2})?)$/
    return (v: number | string | null) => {
      if (v === null || v === '') return true
      const value = String(v)
      if (!regex.test(value)) {
        return 'Rango permitido 0.00 – 100.00 (máx. 2 decimales)'
      }
      const num = Number(value)
      if (num < 0 || num > 100) {
        return 'El valor debe estar entre 0 y 100'
      }
      return true
    }
  }
  //INDICADOR DISTR
  static indicadorDistrC() {
    return (v: number | null) => {
      if (v === null || v === undefined) {
        return 'Indicador Distribución Cesión requerido'
      }
      if (!Number.isInteger(v) || v < 0 || v > 9) {
        return 'Valor inválido'
      }
      return true
    }
  }
  //TIPO COBERTURA
  static tipoCobertura() {
    return (value: number | null) => {
      if (value === null || value === undefined) return 'Tipo de cobertura requerido'
      return true
    }
  }
  //COMISION PRIMER AÑO
  static comisionReaseg = 0
  static comisionPrimerAnio(comisionReaseg: number) {
    return (value: number | null) => {
      if (comisionReaseg !== 0) return true
      if (value === null || value === undefined) return 'Comisión primer año requerida'
      if (value < 0 || value > 100) return 'Valor debe estar entre 0.00 y 100.00'
      const regex = /^\d{1,3}(\.\d{1,2})?$/
      if (!regex.test(value.toFixed(2))) return 'Máximo 3 enteros y 2 decimales'
      return true
    }
  }
  //COMISION RENOVACION
  static comisionRenovacion(comisionReaseg: number) {
    return (value: number | null) => {
      if (comisionReaseg !== 0) return true
      if (value === null || value === undefined) return 'Comisión renovación requerida'
      if (value < 0 || value > 100) return 'Valor debe estar entre 0.00 y 100.00'
      const regex = /^\d{1,3}(\.\d{1,2})?$/
      if (!regex.test(value.toFixed(2))) return 'Máximo 3 enteros y 2 decimales'
      return true
    }
  }
  //DETALLE CAPA
  static detalleCapa(tipoContratoFn: () => number | null) {
    return (v: any) => {
      const idTipo = tipoContratoFn();

      if (idTipo !== 12) return true;
      if (v === null || v === undefined || v === '') {
        return 'Detalle de capa requerido';
      }
      return true;
    };
  }

  // Prima de tarifa fija
  static primaTarifaFija(tipoTarifa: () => number | null) {
    const regex = /^\d{1,13}(\.\d{1,2})?$/
    return (v: number | null) => {
      if (tipoTarifa() !== 0) return true
      if (v === null || v === undefined) return 'Prima de tarifa fija requerida'
      if (!regex.test(String(v))) return 'Máximo 13 enteros y 2 decimales'
      return true
    }
  }

  // % sobre prima emitida
  static porSobrePrima(tipoTarifa: () => number | null) {
    const regex = /^\d{1,3}(\.\d{1,2})?$/
    return (v: number | null) => {
      if (tipoTarifa() !== 1) return true
      if (v === null || v === undefined) return '% sobre prima emitida requerida'
      if (!regex.test(String(v))) return 'Máximo 3 enteros y 2 decimales'
      return true
    }
  }

  // Tarifa fija al millar
  static tarifaFijaMillar(tipoTarifa: () => number | null) {
    const regex = /^\d{0,0}(\.\d{1,10})?$/
    return (v: number | null) => {
      if (tipoTarifa() !== 3) return true
      if (v === null || v === undefined) return 'Tarifa fija al millar requerida'
      if (!regex.test(String(v))) return 'Hasta 10 decimales'
      return true
    }
  }

  // Factor tarifa propia
  static factorTarifaPropia(tipoTarifa: () => number | null) {
    const regex = /^\d{1,3}(\.\d{1,2})?$/
    return (v: number | null) => {
      if (tipoTarifa() !== 2) return true
      if (v === null || v === undefined) return 'Factor tarifa propia requerido'
      if (!regex.test(String(v))) return 'Máximo 3 enteros y 2 decimales'
      return true
    }
  }

  // Tarifa propia
  static tarifaPropia(tipoTarifa: () => number | null) {
    return (v: string | null) => {
      if (tipoTarifa() !== 2) return true
      if (!v) return 'Tarifa propia requerida'
      if (v.length > 20) return 'Máximo 20 caracteres'
      return true
    }
  }

  static limiteSiniestralidad() {
    return (value: number | string | null) => {
      if (value === null || value === undefined || value === '') {
        return true
      }
      const strValue = String(value)
      const regex = /^\d{1,3}(\.\d{1,2})?$/

      if (!regex.test(strValue)) {
        return 'Máximo 3 enteros y hasta 2 decimales'
      }

      const num = Number(strValue)

      if (num < 0 || num > 100) {
        return 'El valor debe estar entre 0.00 y 100.00'
      }

      return true
    }
  }


}
