export interface Usuarios {
  id: number
  fechaRegistro: Date
  clave: string
  nombre: string
  aPaterno: string
  aMaterno: string
  username: string
  password: string
  esActivo: boolean
  fechaSolicitud: Date
  codigoVerificacion: string
  fechaActualizacion: Date
  correoElectronico: string
  fechaInicioS: Date
  fechaFinS: string
  perfilClave: string
}
