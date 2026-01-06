
import { BaseAPI } from '@/API/BaseAPI'
import type { CriteriosAsignacion } from './criterios_asignacion.interfaces'

export function CriteriosAsignacionActions () {
  const baseAPI = BaseAPI({ prefix: 'ws_catalogos_reaseguro/api/v1/ReasegCatIntCriterioAsignacionRest/' })

  const fetch = async (): Promise<CriteriosAsignacion[]> => {
    try {
      const response = await baseAPI.post<CriteriosAsignacion[]>('getAllRecords')
      return response.data
    } catch (error) {
      console.error('Error fetching CriteriosAsignacions:', error)
      throw error
    }
  }

  const create = async (
    data: Partial<CriteriosAsignacion>,
  ): Promise<CriteriosAsignacion> => {
    try {
      const response = await baseAPI.post<CriteriosAsignacion>('create', data)
      return response.data
    } catch (error) {
      console.error('Error creating CriteriosAsignacion:', error)
      throw error
    }
  }

  const update = async (
    id: number,
    data: Partial<CriteriosAsignacion>,
  ): Promise<CriteriosAsignacion> => {
    try {
      const response = await baseAPI.put<CriteriosAsignacion>(`update/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating CriteriosAsignacion:', error)
      throw error
    }
  }

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`)
    } catch (error) {
      console.error('Error deleting CriteriosAsignacion:', error)
      throw error
    }
  }

  return {
    fetch,
    create,
    update,
    deletes
  }
}
