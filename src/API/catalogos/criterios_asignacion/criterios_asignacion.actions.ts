
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

  const create = async (data: Partial<CriteriosAsignacion>): Promise<CriteriosAsignacion[]> => {
    try {
      const response = await baseAPI.post<CriteriosAsignacion[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error('Error creating CriteriosAsignacion:', error)
      throw error
    }
  }

  const update = async (data: Partial<CriteriosAsignacion>): Promise<CriteriosAsignacion[]> => {
    try {
      const response = await baseAPI.put<CriteriosAsignacion[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error('Error updating CriteriosAsignacion:', error)
      throw error
    }
  }

  const deletes = async (id: number): Promise<CriteriosAsignacion[]> => {
    try {
      const data = await baseAPI.delete<CriteriosAsignacion[]>(`deleteRecord/${id}`);
      return data.data;
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
