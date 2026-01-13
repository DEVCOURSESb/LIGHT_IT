import type { Intermediario } from './intermediario.interfaces'
import { BaseAPI } from '@/API/BaseAPI'

export function IntermediariosActions () {
  const baseAPI = BaseAPI({ prefix: 'ws_catalogos_reaseguro/api/v1/ReasegCatCnsfIntermediarioRest/' })

  const fetchIntermediarios = async (): Promise<Intermediario[]> => {
    try {
      const response = await baseAPI.post<Intermediario[]>('getAllRecords')
      return response.data
    } catch (error) {
      console.error('Error fetching intermediarios:', error)
      throw error
    }
  }

  const createIntermediario = async (data: Partial<Intermediario>): Promise<Intermediario[]> => {
    try {
      const response = await baseAPI.post<Intermediario[]>('insertRecord', data)
      return response.data
    } catch (error) {
      console.error('Error creating intermediario:', error)
      throw error
    }
  }

  const updateIntermediario = async (data: Partial<Intermediario>): Promise<Intermediario[]> => {
    try {
      const response = await baseAPI.put<Intermediario[]>("updateRecord", data)
      return response.data
    } catch (error) {
      console.error('Error updating intermediario:', error)
      throw error
    }
  }

  const deleteIntermediario = async (id: number): Promise<Intermediario[]> => {
    try {
      const response = await baseAPI.delete<Intermediario[]>(`deleteRecord/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting intermediario:', error)
      throw error
    }
  }

  return {
    fetchIntermediarios,
    createIntermediario,
    updateIntermediario,
    deleteIntermediario,
  }
}
