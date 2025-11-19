// src/composables/user/useUsuario.ts

import type { Usuarios } from '@/API/user/User'
import { ref } from 'vue'
import { UserActions } from '@/API/user/UserActions'

export function useUsuario() {
  const { fetchUsuarios, fetchUsuarioById, createUsuario, updateUsuario } = UserActions()

  const usuarios = ref<Usuarios[]>([])
  const usuarioSeleccionado = ref<Usuarios | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getUsuarios = async () => {
    isLoading.value = true
    error.value = null
    try {
      const data = await fetchUsuarios()
      usuarios.value = data
    } catch (error_) {
      error.value = 'Error al cargar la lista de usuarios.'
      console.error(error_)
    } finally {
      isLoading.value = false
    }
  }

  const getUsuarioById = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await fetchUsuarioById(id)
      usuarioSeleccionado.value = data || null
      if (!data) {
        error.value = 'Usuario no encontrado.'
      }
    } catch (error_) {
      error.value = 'Error al obtener el detalle del usuario.'
      console.error(error_)
    } finally {
      isLoading.value = false
    }
  }

  const saveUsuario = async (userData: Usuarios) => {
    isLoading.value = true
    error.value = null
    try {
      let result: Usuarios
      // eslint-disable-next-line prefer-const
      result = await (userData.id ? updateUsuario(userData.id, userData) : createUsuario(userData))

      await getUsuarios()
      return result
    } catch (error_) {
      error.value = 'Error al guardar el usuario.'
      console.error(error_)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    usuarios,
    usuarioSeleccionado,
    isLoading,
    error,

    getUsuarios,
    getUsuarioById,
    saveUsuario,
  }
}
