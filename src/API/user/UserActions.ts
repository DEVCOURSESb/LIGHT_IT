import { API, WS } from '@/plugins/axios'

export function UserActions () {
  const validarCorreo = async (correoElectronico: string) => {
    try {
      const response = await API.post(`/AuthRest/sendMail/${correoElectronico}`)

      return {
        success: response.data.success,
        message: response.data.message,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'El correo ingresado no existe en los registros',
      }
    }
  }

  const validarUsuario = async (usuario: string, password: string, codigo: string) => {
    try {
      const body = { username: usuario, password, codigoVerificacion: codigo }
      console.log('ENVIANDO:', body)
      const response = await WS.post(`/auth/login`, body)

      return {
        success: response.data.success,
        message: response.data.message,
        usuario,
        correoElectronico: response.data.correoElectronico,
      }
    } catch (error: any) {
      console.error('Error en el servicio:', error.response?.data)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al validar datos de usuario',
      }
    }
  }

  const verificarCodigo = async (correoElectronico: string, codigo: string) => {
    try {
      const body = { correoElectronico, codigoVerificacion: codigo }
      const response = await API.post(`/auth/login`, body)

      return {
        success: response.data.success,
        token: response.data.token,
        expiresIn: response.data.expiresIn,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Código inválido',
      }
    }
  }

  const logoutUsuario = async (correoElectronico: string) => {
    try {
      const response = await API.post(`/AuthRest/logout/${correoElectronico}`)
      return { success: true, message: response.data.message }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error en logout',
      }
    }
  }

  return {
    validarCorreo,
    validarUsuario,
    verificarCodigo,
    logoutUsuario,
  }
}
