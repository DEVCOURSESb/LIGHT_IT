import type { Usuarios } from './Users.ts'

const userList: Usuarios[] = [
  {
    id: 1,
    fechaRegistro: new Date(),
    clave: 'USER001',
    nombre: 'Elizabet',
    aPaterno: 'Martinez',
    aMaterno: 'Lorenzo',
    username: 'eliza.mtz',
    password: '12345',
    esActivo: true,
    fechaSolicitud: new Date(),
    codigoVerificacion: '',
    fechaActualizacion: new Date(),
    correoElectronico: 'eliza@lightit.com',
    fechaInicioS: new Date(),
    fechaFinS: '',
    perfilClave: 'ADMIN',
  },
]

export function UserActions () {
  const fetchUsuarioByUsername = async (username: string): Promise<Usuarios | undefined> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = userList.find(u => u.username === username)
        resolve(user)
      }, 500)
    })
  }

  const generarCodigo = (): string => {
    return Math.floor(10_000_000 + Math.random() * 90_000_000).toString()
  }

  const enviarCorreo = async (correo: string, codigo: string) => {
    return new Promise(resolve => {
      console.log(`Código enviado a ${correo}: ${codigo}`)
      setTimeout(() => resolve(true), 1000)
    })
  }

  const autenticarUsuario = async (username: string, password: string) => {
    const user = await fetchUsuarioByUsername(username)

    if (!user) {
      return { success: false, message: 'Usuario no encontrado' }
    }
    if (user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta' }
    }

    const codigo = generarCodigo()
    user.codigoVerificacion = codigo

    await enviarCorreo(user.correoElectronico, codigo)

    return { success: true, user }
  }

  const validarCodigo = async (username: string, codigoIngresado: string) => {
    const user = await fetchUsuarioByUsername(username)
    if (!user) {
      return false
    }
    return user.codigoVerificacion === codigoIngresado
  }

  return {
    autenticarUsuario,
    validarCodigo,
  }
}
