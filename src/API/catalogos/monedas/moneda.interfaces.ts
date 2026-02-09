export interface Moneda {
  id: number
  cveMoneda: number
  descMoneda: string
  esActivo: number
  fechaRegistro: string
  /* prop utilizada en contrato AyE  */
  monActiva?: boolean
}
