import { Usuarios } from './Users.ts'

// Simulación de la respuesta de la base de datos
const mockUserList: Usuarios[] = [
  {
    id: 1,
    fechaRegistro: new Date(),
    clave: 'USER001',
    nombre: 'Ana',
    aPaterno: 'Gómez',
    aMaterno: 'Rojas',
    username: 'ana.gomez',
    password: 'encrypted_pass',
    esActivo: true,
    fechaSolicitud: new Date(),
    codigoVerificacion: 'ABC',
    fechaActualizacion: new Date(),
    correoElectronico: 'ana@latino.com',
    fechaInicioS: new Date(),
    fechaFinS: '',
    perfilClave: 'ADMIN',
  },
  {
    id: 2,
    fechaRegistro: new Date(),
    clave: 'USER002',
    nombre: 'Alberto',
    aPaterno: 'Martínez',
    aMaterno: 'Díaz',
    username: 'beto.m',
    password: 'encrypted_pass2',
    esActivo: true,
    fechaSolicitud: new Date(),
    codigoVerificacion: 'DEF',
    fechaActualizacion: new Date(),
    correoElectronico: 'beto@latino.com',
    fechaInicioS: new Date(),
    fechaFinS: '',
    perfilClave: 'USUARIO',
  },
]
// -----------------------------------------------------------------

export function UserActions () {
  const fetchUsuarios = async (): Promise<Usuarios[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockUserList)
      }, 500)
    })
  }

  const fetchUsuarioById = async (id: number): Promise<Usuarios | undefined> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = mockUserList.find(u => u.id === id)
        resolve(user)
      }, 500)
    })
  }
  return {
    fetchUsuarios,
    fetchUsuarioById,
  }
}
